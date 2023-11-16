import plugin from '../../../lib/plugins/plugin.js';
import image from '../model/image.js';
import getconfig from '../model/cfg.js';

export class meiridaka extends plugin {
    constructor(){
      super({
        name: 'Gi互动:每日打卡',
        dsc: 'Gi互动:每日打卡',
        event: 'message',
        priority: 1,
        rule:[
            {
                reg: '^(#|/)?每日打卡$',
                fnc: '每日打卡'
            },
            {
                reg: '^(#|/)?今日欧皇$',
                fnc: '今日欧皇'
            },
            {
                reg: '^(#|/)?让我看看你的卡(.*)$',
                fnc: 'looklookyou'
            },
            {
                reg: '^(#|/)?今日非酋$',
                fnc: '今日非酋'
            }
        ]
      });
    }
    async 今日非酋(e) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const date_time = `${year}-${month}-${day}`;
      let date_time2 = await redis.get(`Yunzai:fqiuriqi_daka`);date_time2 = JSON.parse(date_time2);
      if (date_time !== date_time2){
        let msg = [
          segment.at(e.user_id),
          `\n今天的非酋还没诞生喵~`
        ]
        e.reply(msg)
        return;
      }
      let fqiuname = await redis.get(`Yunzai:fqiuname_daka`);fqiuname = JSON.parse(fqiuname);
      let fqiuqq = await redis.get(`Yunzai:fqiuqq_daka`);fqiuqq = JSON.parse(fqiuqq);
      let zhi =  await redis.get(`Yunzai:fqiuzhi_daka`);zhi = JSON.parse(zhi)
      let msg = [`今日的首个非酋已诞生！！！！\nta的名字：【${fqiuname}】\nta的QQ号：(${fqiuqq})\nta的幸运值是：${zhi} ！！！`]
      e.reply(msg)
      return true;
    }
    async 每日打卡(e) {
        //获取当前日期
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        let date_time2 = await redis.get(`Yunzai:meiridaka3qn:${e.user_id}_daka`);date_time2 = JSON.parse(date_time2);//获取用户最后一次打卡日期
        const zhi1 = await redis.get(`Yunzai:meiridakazhi:${e.user_id}_daka`);//获取用户最后一次打卡的幸运值
        //判断该用户的上一次抽取时间是否是今天
        if (date_time === date_time2) {
            let msg = [
                segment.at(e.user_id),
                `\n你今天已经打过卡了喵~\n你今天的幸运值是`+zhi1+`，可别再忘掉哦喵~`
            ]
            e.reply(msg)
            return;
        }
        const zhi = Math.floor(Math.random() * 101);
        console.log(zhi);
        const { img } = await image(e, 'mrdk', 'mrdk', {
          zhi,
        })
        let msg = [segment.at(e.user_id),
          `\n你今天的幸运值是……\n`,
          img
        ]
        let { config } = getconfig(`config`, `config`)
        if (zhi >= config.mrdkOH){
          
          let date_time3 = await redis.get(`Yunzai:ohuangriqi_daka`);date_time3 = JSON.parse(date_time3); //获取上一次欧皇诞生时间
          if (date_time3 !== date_time){ //判断上一次欧皇诞生时间是否为今天
            msg = [segment.at(e.user_id),
              `\n你今天的幸运值是……\n`,
              img,
              `恭喜你成为今天首个${config.mrdkOH}幸运值以上的欧皇！`
            ]
            redis.set(`Yunzai:ohuangzhi_daka`, JSON.stringify(zhi)); //写入幸运值
            redis.set(`Yunzai:ohuangname_daka`, JSON.stringify(e.nickname));//写入欧皇名字
            redis.set(`Yunzai:ohuangqq_daka`, JSON.stringify(e.user_id));//写入欧皇的qq号
            redis.set(`Yunzai:ohuangqqun_daka`, JSON.stringify(e.group_id));//写入欧皇诞生的群号
            redis.set(`Yunzai:ohuangriqi_daka`, JSON.stringify(date_time));//写入欧皇诞生的时间
          }
        } else if (zhi <= config.mrdkFQ){
          let date_time3 = await redis.get(`Yunzai:fqiuriqi_daka`);date_time3 = JSON.parse(date_time3);//获取：时间
          if(date_time3 !== date_time){//判断：日期
            msg = [segment.at(e.user_id),
              `\n你今天的幸运值是……\n`,
              img,
              `恭喜你成为今天首个${config.mrdkFQ}幸运值以下的非酋！`
            ]
            redis.set(`Yunzai:fqiuzhi_daka`, JSON.stringify(zhi));//写入：幸运值
            redis.set(`Yunzai:fqiuname_daka`, JSON.stringify(e.nickname));//写入：非酋名字
            redis.set(`Yunzai:fqiuqq_daka`, JSON.stringify(e.user_id));//写入：非酋QQ
            redis.set(`Yunzai:fqiuqqun_daka`, JSON.stringify(e.group_id));//写入：非酋groupid
            redis.set(`Yunzai:fqiuriqi_daka`, JSON.stringify(date_time));//写入：非酋日期
          }
        }
        redis.set(`Yunzai:meiridaka3qn:${e.user_id}_daka`, JSON.stringify(date_time));//将当前日期写入redis防止重复抽取
        redis.set(`Yunzai:meiridakazhi:${e.user_id}_daka`, JSON.stringify(zhi));//将打卡获取的幸运值写入redis
        e.reply(msg)
        return true;//结束运行
    }
    async 今日欧皇(e) {
        //获取当前日期
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        let date_time2 = await redis.get(`Yunzai:ohuangriqi_daka`);date_time2 = JSON.parse(date_time2);//获取欧皇最后一次诞生时间
        if (date_time !== date_time2){
          let msg = [
            segment.at(e.user_id),
            `\n今天的欧皇还没诞生喵~`
          ]
          e.reply(msg)
          return;
        }
        let ohuangname = await redis.get(`Yunzai:ohuangname_daka`);ohuangname = JSON.parse(ohuangname);//获取欧皇的名字
        let ohuangqq = await redis.get(`Yunzai:ohuangqq_daka`);ohuangqq = JSON.parse(ohuangqq);//获取欧皇QQ号
        let zhi =  await redis.get(`Yunzai:ohuangzhi_daka`);zhi = JSON.parse(zhi)
        let msg = [`今日的首个欧皇已诞生！！！！\nta的名字：【${ohuangname}】\nta的QQ号：(${ohuangqq})\nta的幸运值是：${zhi} ！！！`]
        e.reply(msg)
        return true;
      }
    async looklookyou(e) {
        const message = e.message[0]
        const at = e.message[1]
        //if(message.text !== `让我看看你的卡` && at.type != `at`) return true;
        //if(e.at == undefined) return true;
        if(message.text !== `让我看看你的卡`) return true;
        if(at == `undefined`) return true;
        logger.mark(at)
        //获取当前日期
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        let date_time2 = await redis.get(`Yunzai:meiridaka3qn:${e.at}_daka`);date_time2 = JSON.parse(date_time2);
        const zhi1 = await redis.get(`Yunzai:meiridakazhi:${e.at}_daka`);
        if (date_time !== date_time2) {
          if (e.at === e.user_id){
            e.reply(`你今天还没打卡喵~\n不过我非常不理解你为什么不直接用“每日打卡”来看自己的幸运值，而是还要at一遍自己？？？`)
            return true;
          }
          let msg = [
              segment.at(e.user_id),
              `\nta今天还没打卡喵`
          ]
          e.reply(msg)
          return true;
        }
        if (e.at === e.user_id){
          e.reply(`你为什么不直接用“每日打卡”来看自己的幸运值，而是还要at一遍自己？？？`)
          return true;
        }
        let msg = [`铛铛铛，ta今天的幸运值是${zhi1}`]
        e.reply(msg)
        return true;
    }
  }