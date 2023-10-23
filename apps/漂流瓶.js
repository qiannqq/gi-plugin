import plugin from '../../../lib/plugins/plugin.js';
import Gimodel from '../model/duquFile.js';
import shanchu from '../model/shanchu.js';
import getconfig from '../model/cfg.js';
import {promises as fs} from 'fs';

const filePath = `plugins/Gi-plugin/resources/plp.txt`
const _path = process.cwd().replace(/\\/g, '/')

export class plp extends plugin {
    constructor(){
        super({
            name: 'Gi互动:漂流瓶',
            dsc: 'Gi互动:漂流瓶',
            event: 'message',
            priority: 1,
            rule:[
                {
                    reg: '^#?扔漂流瓶$',
                    fnc: '扔漂流瓶'
                },{
                    reg: '^#?捡漂流瓶$',
                    fnc: '捡漂流瓶'
                }
            ]
        })
    }
    async 扔漂流瓶(e){
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        let date_time2 = await redis.get(`Yunzai:giplugin-${e.user_id}_plp`);date_time2 = JSON.parse(date_time2);
        let times_;
        let { config } = getconfig(`config`, `config`)
        if(date_time2){
            const parts = date_time2.split('；');
            const date_time3 = parts[0].substring(1);
            times_ = parseInt(parts[1], 10);
            logger.mark(times_)
            if (!e.isMaster) {
                if (date_time === date_time3) {
                    if(times_ >= config.Rplp) {
                        e.reply(`你今天已经扔过${times_}次漂流瓶，每天只能捡${config.Rplp}次哦~`)
                        return true;
                    }
                } else {
                    times_ = `0`;
                }
            }
        } else {
            times_ = `0`;
        }
        e.reply(`发送你想要扔漂流瓶的内容(仅支持文字和图片)`)
        redis.set(`Yunzai:Giplp_${e.user_id}_times`, JSON.stringify(times_))
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
        let times_ = await redis.get(`Yunzai:Giplp_${e.user_id}_times`)
        times_ = JSON.parse(times_)
        /**if(this.e.msg == undefined){
            logger.warn(`[Gi互动:扔漂流瓶]检测到图片或卡片`);
            e.reply(`扔漂流瓶失败了，无法在漂流瓶内塞进图片卡片等内容。`)
            return true;
        }**/
        const message = this.e.message[0]
        if(message.type != 'text' && message.type != 'image'){
            e.reply(`扔漂流瓶失败了，无法在漂流瓶内塞进卡片内容。`)
            return true;
        }
        let plp_ = this.e.msg
        if (message.type == 'image') {
            plp_ = message.url
        } else {
            plp_ = plp_.replace(/@/g, '');
            plp_ = plp_.replace(/\n/g, '');
            plp_ = plp_.replace(/；/g, '');
            plp_ = plp_.replace(/https/g, '');
            plp_ = plp_.replace(/⁧/g, '');
        }
        plp = `@${plp_}；${e.user_id}`
        fs.appendFile(filePath, plp + '\n', 'utf8', (err) => {
            if (err) {
              logger.error(err);
              e.reply(`发生错误` + err)
              return;
            }
          })
        e.reply(`你的漂流瓶成功扔出去了~`)
        logger.mark(`[Gi互动:扔漂流瓶]用户${e.user_id}扔了一个漂流瓶【${plp_}】`)
        times_++;
        let times = `@${date_time}；${times_}`
        redis.set(`Yunzai:giplugin-${e.user_id}_plp`, JSON.stringify(times));
    }
    async 捡漂流瓶(e){
        let plp2;
        let dc = {
            filePath: filePath,
            type: `plp`
        }
        let Piaoliu = await Gimodel.NewduquFile(dc, e)
        let { config } = getconfig(`config`, `config`)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        let date_time2 = await redis.get(`Yunzai:giplugin-${e.user_id}_plp2`);date_time2 = JSON.parse(date_time2);
        let times_;
        if(date_time2){
            const parts = date_time2.split('；');
            const date_time3 = parts[0].substring(1);
            times_ = parseInt(parts[1], 10);
            if (!e.isMaster) {
                if (date_time === date_time3) {
                    if(times_ >= config.Jplp) {
                        e.reply(`你今天已经捡过${times_}次漂流瓶，每天只能捡${config.Jplp}次哦~`)
                        return true;
                    }
                } else {
                    times_ = `0`;
                }
            }
        } else {
            times_ = `0`;
        }
        const randomIndex = Math.floor(Math.random() * Piaoliu.length);
        if(Piaoliu.length === 0){
            e.reply(`海里空空的，似乎没有漂流瓶呢`)
            return true;
        }
        plp2 = Piaoliu[randomIndex];
        const matches = plp2.match(/@(.*?)；(.*?)/);
        const plp3 = matches[1];
        const plp4 = matches[2];
        if (plp4 == e.user_id) {
            e.reply(`很可惜，这次没捡到漂流瓶呢~`)
            return true;
        }
        if (plp4 == undefined) {
            e.reply(`很可惜，这次没捡到漂流瓶呢~`)
            return true;
        } else if (plp3 == ``) {
            e.reply(`很可惜，这次没捡到漂流瓶呢~`)
            return true;
        }
        let msg = 
[`正在查看漂流瓶……
这个漂流瓶里有封信哎
【漂流瓶】
${plp3}`]
        const regex = /https:\/\/(\w+\.)?qpic\.cn/;
        const regexHttp = /http:\/\/(\w+\.)?qpic\.cn/;
        if (plp3.match(regex)) {
            msg = [`正在查看漂流瓶……\n这个漂流瓶里有照片哎\n【泛黄的照片】\n`,segment.image(plp3)]
            logger.mark(plp3)
            e.reply(msg)
        } else if(plp3.match(regexHttp)){
            msg = [`正在查看漂流瓶……\n这个漂流瓶里有照片哎\n【泛黄的照片】\n`,segment.image(plp3)]
            logger.mark(plp3)
            e.reply(msg)
        } else {
            e.reply(msg)
        }
        times_++;
        let times = `@${date_time}；${times_}`
        redis.set(`Yunzai:giplugin-${e.user_id}_plp2`, JSON.stringify(times));
        shanchu(filePath, plp2)
    }
}