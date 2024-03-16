import common from '../../../lib/common/common.js'
import Fish from '../model/yu.js'
import getconfig from '../model/cfg.js'
import Gimodel from '../model/getFile.js'
import fs from 'fs'

export class Gi_yu extends plugin {
  constructor() {
    super({
      name: 'Gi互动:钓鱼',
      dsc: 'Gi互动:钓鱼',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^(#|/)?(钓鱼|🎣)$',
          fnc: 'diaoyu'
        },
        {
          reg: '^(#|/)?(我的)?(水桶|🪣)$',
          fnc: 'user_bucket'
        },
        {
          reg: '^(#|\/)?出售(.*)\*(.*)$',
          fnc: '出售'
        },
        {
          reg: '^(#|/)?(我的)?(鱼币|金币|💰|钱包)$',
          fnc: 'user_money'
        },
        {
          reg: '^(#|/)?(鱼布斯)?(财富|💰)榜$',
          fnc: 'wealth_list'
        },
        {
          reg: '^(#|/)?加急治疗$',
          fnc: '加急治疗'
        },
        {
          reg: '^(#|/)?修改(钓鱼|🎣)昵称(.*)?$',
          fnc: 'change_nickname'
        },
        {
          reg: '^(#|/)?一键出售所有鱼$',
          fnc: 'sell_all_fish'
        }
      ]
    })
  }
  async sell_all_fish(e) {
    let userBucket = await Fish.getinfo_bucket(e.user_id)
    if(!userBucket || userBucket.length <= 0) {
      await e.reply(`你水桶里似乎没有鱼呢`)
    }
    let u = []
    for (let item of userBucket) {
      if(item.number > 0) {
        u.push({
          user_id: e.user_id,
          msg: `出售${item.fishType}*${item.number}`,
          nickname: e.nickname,
          reply: e.reply
        })
      }
    }
    if(u.length <= 0) {
      await e.reply(`你似乎没有鱼可以出售呢~`)
      return true
    }
    for (let item of u) {
      this.出售(item)
    }
  }
  async change_nickname(e){
    if(!await Fish.get_usermoneyInfo(e.user_id, true)) {
      await e.reply(`你还没有出售过鱼，请先出售一次鱼在尝试修改昵称吧~`)
      return true
    }
    let msg = e.msg.match(/^(#|\/)?修改(钓鱼|🎣)昵称(.*)?$/)
    if(!msg[3]) {
      e.reply([segment.at(e.user_id), `\n请输入昵称后再尝试修改昵称呢\n例如：#修改🎣昵称张三`])
      return true
    }
    await e.reply([segment.at(e.user_id), `\n修改昵称需要花费30鱼币的改名费，是否继续？\n【#确认支付】`])
    this.setContext(`change_nickname_`)
  }
  async change_nickname_(e) {
    this.finish(`change_nickname_`)
    if(this.e.msg != `#确认支付`) {
      e.reply(`你取消了支付`)
      return true
    }
    if(await Fish.get_usermoneyInfo(e.user_id) < 5) {
      await e.reply(`啊嘞，你的钱似乎不够支付改名费呢~`)
      return true
    }
    await Fish.deduct_money(e.user_id, 30)
    let userInfo = await Fish.get_usermoneyInfo(e.user_id, true)
    await Gimodel.deljson(userInfo, `./plugins/Gi-plugin/data/fishing/PlayerListMoney.json`)
    let nickname = e.msg.match(/^(#|\/)?修改(钓鱼|🎣)昵称(.*)?$/)[3]
    userInfo = {
      uid: userInfo.uid,
      uname: nickname,
      money: userInfo.money
    }
    let alluserInfo
    try {
      alluserInfo = JSON.parse(fs.readFileSync(`./plugins/Gi-plugin/data/fishing/PlayerListMoney.json`, `utf-8`))
    } catch {
      alluserInfo = []
    }
    alluserInfo.push(userInfo)
    fs.writeFileSync(`./plugins/Gi-plugin/data/fishing/PlayerListMoney.json`, JSON.stringify(alluserInfo, null, 3), `utf-8`)
    await e.reply(`你的🎣昵称已修改为【${nickname}】`)
    return true
  }
  async 加急治疗(e) {
    let time = await timerManager.getRemainingTime(e.user_id)
    console.log(time)
    if(!time || time == 0 ||!await redis.get(`Fishing:${e.user_id}:shayu`)) {
      await e.reply(`你很健康，不需要加急治疗~`)
      return true
    }
    await e.reply(`你需要支付5鱼币以加急治疗，是否支付？\n【#确认支付】`)
    this.setContext('加急治疗_')
  }
  async 加急治疗_(e) {
    this.finish(`加急治疗_`)
    if(this.e.msg == `#确认支付`) {
      if(await Fish.get_usermoneyInfo(e.user_id) < 5) {
        await e.reply([segment.at(e.user_id), `\n医生疑惑的看向你兜里的${await Fish.get_usermoneyInfo(e.user_id)}个鱼币，你尴尬的笑了笑。`])
        return true
      }
      let timeSet = timerManager.createTimer(e.user_id, 3)
      timeSet.start()
      await redis.del(`Fishing:${e.user_id}:shayu`)
      await e.reply([segment.at(e.user_id), `\n在医生的全力以赴下，你健康的出了院~`])
      await Fish.deduct_money(e.user_id, 5)
      return true
    } else {
      await e.reply(`你取消了支付。`)
    }
  }
  async wealth_list (e) {
    let PlayerMoneyList
    try {
      PlayerMoneyList = JSON.parse(fs.readFileSync(`./plugins/Gi-plugin/data/fishing/PlayerListMoney.json`))
    } catch (error) {
      PlayerMoneyList = []
    }
    if(PlayerMoneyList.length <= 0) {
      await e.reply(`还没有人上榜哦~`)
      return true
    }
    PlayerMoneyList.sort((a, b) => b.money - a.money)
    PlayerMoneyList = PlayerMoneyList.slice(0, 10)
    let msg = [`鱼布斯最新A市财富榜前十名：`]
    let paiming = 0
    for (let item of PlayerMoneyList) {
      paiming++;
      msg.push(`\n第${paiming}名: ${item.uname || `侠名`} · ${item.money}鱼币`)
    }
    await e.reply(msg)
    return true
  }
  async user_money(e) {
    await e.reply(`你的兜里还剩${await Fish.get_usermoneyInfo(e.user_id)}个鱼币~`)
  }
  async 出售(e) {
    let { config } = getconfig(`config`, `config`)
    let playerBucket = await Fish.getinfo_bucket(e.user_id)
    if(playerBucket.length == 0) {
      await e.reply(`你没有鱼可以出售哦~`)
      return true
    }
    let fishArray = ["🐟", "🐡", "🦐", "🦀", "🐠", "🐙", "🦑"]
    let msg = e.msg.match(/^(#|\/)?出售(.*)\*(.*)?$/)
    if(!fishArray.includes(msg[2])) {
      await e.reply(`啊嘞，生物百科好像没有你说的鱼呢~`)
      return true
    }
    let fish_sale = []
    for (let item of playerBucket) {
      if(item.fishType == msg[2]) {
        fish_sale.push(item)
      }
    }
    if(fish_sale[0].number <= 0 || fish_sale.length == 0) {
      e.reply(`啊嘞，你好像没有${msg[2]}呢~`)
      return true
    }
    if(msg[3] && msg[3] > 1) {
      if(fish_sale[0].number < msg[3]) {
        e.reply(`啊嘞，数量不够哎？不要虚报数量哦~`)
        return true
      }
      let price;
      for(let item of config.fish_sale) {
        if(item.type == msg[2]) price = item.price
      }
      price = price * msg[3]
      await Fish.wr_money(e.user_id, price, e.nickname)
      await Fish.del_fish(e.user_id, msg[2], msg[3])
      await e.reply(`出售成功，获得了${price}鱼币`)
    } else {
      let price;
      for(let item of config.fish_sale) {
        if(item.type == msg[2]) price = item.price
      }
      await Fish.wr_money(e.user_id, price, e.nickname)
      await Fish.del_fish(e.user_id, msg[2])
      await e.reply(`出售成功，获得了${price}鱼币`)
    }
  }
  async user_bucket(e) {
    let playerBucket = await Fish.getinfo_bucket(e.user_id)
    if (playerBucket.length == 0) {
      await e.reply(`你的水桶里好像是空的呢，钓点鱼进来再查看水桶吧！`)
      return true
    }
    let msgList = [segment.at(e.user_id), `\n你的水桶里有……`]
    for (let item of playerBucket) {
      if (item.number > 0) {
        msgList.push(`\n${item.fishType} x ${item.number}`)
      }
    }
    if(msgList.length <= 2) {
      msgList.push(`\n空空如也~`)
    }
    await e.reply(msgList)
    return true
  }
  async diaoyu(e) {
    // let time = await timerManager.getRemainingTime(e.user_id) 获取该用户的倒计时器
    // let timeSet = timerManager.createTimer(e.user_id, 120); timeSet.start(); 设置该用户的倒计时器
    let time = await timerManager.getRemainingTime(e.user_id)
    if (!time || time == 0) {
      if(await redis.get(`Fishing:${e.user_id}:shayu`)) {
        redis.del(`Fishing:${e.user_id}:shayu`)
      }
      let { config } = getconfig(`config`, `config`)
      let timeSet = timerManager.createTimer(e.user_id, config.fishcd)
      timeSet.start()
      let yu = await Fish.get_fish()
      await e.reply(`你开始了钓鱼……`)
      await common.sleep(2000)
      if (yu == `特殊事件`) {
        let special_event_list = [`鲨鱼`]
        let special_event = special_event_list[Math.floor(Math.random() * special_event_list.length)]
        switch (special_event) {
          case '鲨鱼':
            this.se鲨鱼(e)
            break
        }
        return true
      }
      let yu_text = await Fish.fishing_text()
      yu_text = yu_text.replace(/【鱼】/g, yu)
      yu_text = yu_text.replace(/\n$/g, '')
      await e.reply([segment.at(e.user_id), '\n' + yu_text])
      await Fish.wr_bucket(e.user_id, yu)
      return true
    } else {
      if(await redis.get(`Fishing:${e.user_id}:shayu`)) {
        await e.reply(`你和你的鱼竿还在住院中，距离出院还有${time}s……\n你可以花费5鱼币提前出院【#加急治疗】`)
        return true
      }
      let randomNumber = Math.floor(Math.random() * 3) + 1;
      switch (randomNumber) {
        case 1:
          await e.reply(`正在重新挂饵中……(${time}s)`)
          break;
        case 2:
          await e.reply(`鱼竿：你知道我想说什么。(鱼竿的假期还有${time}s结束)`)
          break;
        case 3:
          await e.reply(`鱼被吓跑了，它们需要些时间游回来……(${time}s)`)
          break;
      }
      return true
    }
  }
  async se鲨鱼(e){
    let msg = [segment.at(e.user_id), `\n水库中突然窜出一条🦈，将你咬伤后逃窜。`]
    await e.reply(msg)
    await common.sleep(500)
    let { config } = getconfig(`config`, `config`)
    await e.reply(`你很疑惑，为什么淡水库会有鲨鱼？但医生告诉你：你和你的鱼竿需要住院休息。\n鱼竿的假期时间翻倍(${config.fishcd * 2}s)\n你可以花费5鱼币提前出院【#加急治疗】`)
    await redis.set(`Fishing:${e.user_id}:shayu`, `true`)
    let timeSet = timerManager.createTimer(e.user_id, config.fishcd * 2)
    timeSet.start()
    // e.group.muteMember(e.user_id, 60)
  }
}