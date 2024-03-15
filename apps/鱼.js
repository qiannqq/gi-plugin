import common from '../../../lib/common/common.js'
import Fish from '../model/yu.js'
import getconfig from '../model/cfg.js'

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
          reg: '^(#|\/)?出售(.*)\*(.*)?$',
          fnc: '出售'
        },
        {
          reg: '^(#|/)?(我的)?(鱼币|金币|💰)$',
          fnc: 'user_money'
        }
      ]
    })
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
    if(fish_sale[0].number == 0 || fish_sale.length == 0) {
      e.reply(`啊嘞，你好像没有${msg[2]}呢~`)
      return true
    }
    if(msg[3] && msg[3] > 1) {
      let price;
      for(let item of config.fish_sale) {
        if(item.type == msg[2]) price = item.price
      }
      price = price * msg[3]
      await Fish.wr_money(e.user_id, price)
      await Fish.del_fish(e.user_id, msg[2], msg[3])
      await e.reply(`出售成功，获得了${price}金币`)
    } else {
      let price;
      for(let item of config.fish_sale) {
        if(item.type == msg[2]) price = item.price
      }
      await Fish.wr_money(e.user_id, price)
      await Fish.del_fish(e.user_id, msg[2])
      await e.reply(`出售成功，获得了${price}金币`)
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
    await e.reply(msgList)
    return true
  }
  async diaoyu(e) {
    // let time = await timerManager.getRemainingTime(e.user_id) 获取该用户的倒计时器
    // let timeSet = timerManager.createTimer(e.user_id, 120); timeSet.start(); 设置该用户的倒计时器
    let time = await timerManager.getRemainingTime(e.user_id)
    if (!time || time == 0) {
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
    await e.reply(`你很疑惑，为什么淡水库会有鲨鱼？但医生告诉你：你和你的鱼竿需要住院休息。\n鱼竿的假期时间翻倍(${config.fishcd * 2}s)`)
    let timeSet = timerManager.createTimer(e.user_id, config.fishcd * 2)
    timeSet.start()
    // e.group.muteMember(e.user_id, 60)
  }
}