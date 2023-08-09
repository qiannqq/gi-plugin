import plugin from '../../../lib/plugins/plugin.js';
import { segment } from "icqq";
import duquFile from '../model/duquFile.js';
import shanchu from '../model/shanchu.js'
import fs from 'fs'

const filePath = `plugins/Gi-plugin/resources/plp.txt`

const help = 
`===【Gi插件使用帮助】===
扔漂流瓶：扔出一个漂流瓶，每天只能扔一次
捡漂流瓶：捞出一个漂流瓶，每天只能捡一次
每日打卡：随机抽取幸运值，每天只能抽一次
互动更新：互动插件更新
互动强制更新：忽略本地冲突，强制更新`

export class plp extends plugin {
    constructor(){
        super({
            name: 'Gi互动:漂流瓶',
            dsc: 'Gi互动:漂流瓶',
            event: 'message',
            priority: 1,
            rule:[
                {
                    reg: '^扔漂流瓶$',
                    fnc: '扔漂流瓶'
                },{
                    reg: '^捡漂流瓶$',
                    fnc: '捡漂流瓶'
                },{
                    reg: '^#?(Gi|互动)帮助$',
                    fnc: 'help'
                }
            ]
        })
    }
    async help(e){
        e.reply(help)
        return true;
    }
    async 扔漂流瓶(e){
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        let date_time2 = await redis.get(`Yunzai:giplugin-${e.user_id}_plp`);date_time2 = JSON.parse(date_time2);
        if (date_time === date_time2) {
            e.reply(`你今天已经扔过漂流瓶了，每天只能扔一次哦~`)
            return true;
        }
        e.reply(`发送你想要扔漂流瓶的内容(仅支持文字)`)
        this.setContext(`扔漂流瓶1`)
    }
    async 扔漂流瓶1(e){
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        this.finish(`扔漂流瓶1`)
        let plp;
        plp = `-${this.e.msg}；${e.user_id}`
        fs.appendFile(filePath, plp + '\n', 'utf8', (err) => {
            if (err) {
              logger.error(err);
              e.reply(`发生错误` + err)
              return;
            }
          })
        e.reply(`你的漂流瓶成功扔出去了~`)
        redis.set(`Yunzai:giplugin-${e.user_id}_plp`, JSON.stringify(date_time));
    }
    async 捡漂流瓶(e){
        let plp2;
        duquFile(filePath, async (Piaoliu) => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            const date_time = `${year}-${month}-${day}`;
            let date_time2 = await redis.get(`Yunzai:giplugin-${e.user_id}_plp2`);date_time2 = JSON.parse(date_time2);
            if (date_time === date_time2){
                e.reply(`你今天已经捡过漂流瓶，每天只能捡一次哦~`)
            }
            const randomIndex = Math.floor(Math.random() * Piaoliu.length);
            plp2 = Piaoliu[randomIndex];
            const matches = plp2.match(/-(.*?)；(.*?)/);
            const plp3 = matches[1];
            const plp4 = matches[2];
            if (plp4 == undefined) {
                e.reply(`很可惜，这次没捡到漂流瓶呢~`)
                redis.set(`Yunzai:giplugin-${e.user_id}_plp2`, JSON.stringify(date_time));
                return true;
            } else if (plp3 == ``) {
                e.reply(`很可惜，这次没捡到漂流瓶呢~`)
                redis.set(`Yunzai:giplugin-${e.user_id}_plp2`, JSON.stringify(date_time));
                return true;
            }
            let msg = [`正在查看漂流瓶……
这个漂流瓶里有封信哎
【漂流瓶】
${plp3}`]
            e.reply(msg)
            redis.set(`Yunzai:giplugin-${e.user_id}_plp2`, JSON.stringify(date_time));
            shanchu(filePath, plp2)
        });
    }
}