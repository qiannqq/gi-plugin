import plugin from '../../../lib/plugins/plugin.js';
import { segment } from "icqq";

export class meiridaka extends plugin {
    constructor(){
      super({
        name: '每日打卡',
        dsc: '每日打卡抽取幸运值（@千奈千祁）',
        event: 'message',
        priority: 1,
        rule:[
            {
                reg: '^每日打卡$',
                fnc: 'meiridaka3qn'
            },
            {
                reg: '^今日欧皇$',
                fnc: 'todayohuang'
            },
            {
                reg: '^让我看看你的卡(.*)$',
                fnc: 'looklookyou'
            }
        ]
      });
    }
    async meiridaka3qn(e) {
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
          const zhi = Math.floor(Math.random() * 101);//随机抽取数字,数字范围可以自己调
          console.log(zhi);
          let msg = [
            segment.at(e.user_id),
            `\n打卡成功！！\n你今天抽到的幸运值为`+zhi+`点`
        ]//将消息设置为变量msg
        if (zhi === 100){//判断本次抽取的幸运值是否为100
          let date_time3 = await redis.get(`Yunzai:ohuangriqi_daka`);date_time3 = JSON.parse(date_time3); //获取上一次欧皇诞生时间
          if (date_time3 !== date_time){ //判断上一次欧皇诞生时间是否为今天
            redis.set(`Yunzai:ohuangzhi_daka`, JSON.stringify(zhi)); //写入幸运值（感觉有点多此一举了
            redis.set(`Yunzai:ohuangname_daka`, JSON.stringify(e.nickname));//写入欧皇名字
            redis.set(`Yunzai:ohuangqq_daka`, JSON.stringify(e.user_id));//写入欧皇的qq号
            redis.set(`Yunzai:ohuangqqun_daka`, JSON.stringify(e.group_id));//写入欧皇诞生的群号
            redis.set(`Yunzai:ohuangriqi_daka`, JSON.stringify(date_time));//写入欧皇诞生的时间（……
          }
        }
        e.reply(msg)//处理方式
        redis.set(`Yunzai:meiridaka3qn:${e.user_id}_daka`, JSON.stringify(date_time));//将当前日期写入redis防止重复抽取
        redis.set(`Yunzai:meiridakazhi:${e.user_id}_daka`, JSON.stringify(zhi));//将打卡获取的幸运值写入redis
        return true;//结束运行
    }
    async todayohuang(e) {
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
        let msg = [`今日的首个欧皇已诞生！！！！\nta的名字：【`+ohuangname+`】\nta的QQ号：(`+ohuangqq+`)\nta的幸运值是：100 ！！！`]
        e.reply(msg)
        return true;
      }
    async looklookyou(e) {
        if(e.at == undefined) return true;
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