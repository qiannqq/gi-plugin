import plugin from '../../../lib/plugins/plugin.js';
import Gimodel from '../model/getFile.js';
import getconfig from '../model/cfg.js';
import { promises as fs } from 'fs';
import fs_ from 'fs'
import post from '../model/post.js';

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
                    reg: '^(#|/)?扔漂流瓶$',
                    fnc: '扔漂流瓶'
                },{
                    reg: '^(#|/)?捡漂流瓶$',
                    fnc: '捡漂流瓶'
                },{
                    reg: '^(#|/)?撤回漂流瓶$',
                    fnc: 'recall_floating_bottle'
                }
            ]
        })
    }
    async recall_floating_bottle(e){
        //获取日期，用于读取漂流瓶日志文件
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const date_time = `${year}-${month}-${day}`;
        //获取用户在今天发送的漂流瓶
        let dc = {
            filePath: `plugins/Gi-plugin/resources/plp/${date_time}.txt`,
            type: 'rfb'
        }
        let plp = await Gimodel.NewgetFile(dc, e)
        //检查用户扔过漂流瓶没有
        if(plp.length == 0){
            e.reply(`海里似乎没有你今天扔的漂流瓶呢~`)
            return true;
        } else if(plp.length > 1){
            //今天扔过超过一个漂流瓶则不再撤回。别问为什么，问就是懒得写 （摆烂
            e.reply(`你今天已经扔了超过一个漂流瓶，不支持撤回哦~`)
            return true;
        }
        //从漂流瓶数据文件中删除漂流瓶
        await Gimodel.delfile(filePath, plp[0])
        //删除漂流瓶日志中的漂流瓶，将其后面加上“已撤回”
        await Gimodel.delfile(dc.filePath, plp[0])
        fs.appendFile(dc.filePath, plp + `已撤回\n`, `utf-8`)
        e.reply(`已经撤回了哦~`)
        return true;
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
                        e.reply(`你今天已经扔过${times_}次漂流瓶，每天只能扔${config.Rplp}次哦~`)
                        return true;
                    }
                } else {
                    times_ = `0`;
                }
            }
        } else {
            times_ = `0`;
        }
        e.reply(`发送你想要扔漂流瓶的内容(仅支持文字和图片)\n发送[0]取消扔漂流瓶`)
        redis.set(`Yunzai:Giplp_${e.user_id}_times`, JSON.stringify(times_))
        this.setContext(`扔漂流瓶1`)
    }
    async 扔漂流瓶1(e){
        this.finish(`扔漂流瓶1`)
        if(this.e.msg == `0`|| this.e.msg == `[0]`){
            e.reply(`已取消扔漂流瓶`)
            return true;
        }/**
        const date_time = await Gimodel.date_time()
        let times_ = await redis.get(`Yunzai:Giplp_${e.user_id}_times`)
        times_ = JSON.parse(times_)
        let type;
        let plp_content;
        let plp_imgUrl;
        if(e.msg && e.img){
            type = `text_img`
            plp_content = e.msg
            plp_imgUrl = e.img
        } else if(e.msg) {
            type = `text`
            plp_content = e.msg
            plp_imgUrl = ``
        } else if(e.img) {
            type = `image`
            plp_content = ``
            plp_imgUrl = e.img
        } else {
            e.reply(`扔漂流瓶失败了，无法在漂流瓶内塞进卡片内容。`)
            return true;
        }

        let plp_id = await redis.get(`Yunzai:giplugin-plpid`)
        plp_id = JSON.parse(plp_id)
        if (plp_id == undefined) {
            plp_id = `1000001`
        } else {
            plp_id++;
        }

        let plp;
        plp = {
            plp_id,
            plp_userid: e.user_id,
            plp_groupid: e.group_id,
            plp_type: type,
            plp_text: plp_content,
            plp_imgUrl,
        }
        redis.set(`Yunzai.giplugin_plp_${plp_id}`, JSON.stringify(plp))
        redis.set(`Yunzai:giplugin-plpid`, JSON.stringify(plp_id))

        await fs.appendFile(filePath, `@${plp_id}；${e.user_id}\n`, `utf-8`)
        e.reply(`你的漂流瓶成功扔出去了~`)
        logger.mark(`[Gi互动:扔漂流瓶]用户${e.user_id}扔了一个漂流瓶【${plp}】`)
        return true;
**/
        const date_time = await Gimodel.date_time()
        let plp;
        let times_ = await redis.get(`Yunzai:Giplp_${e.user_id}_times`)
        times_ = JSON.parse(times_)
        let plp_ = this.e.msg
        if(!plp_ || plp_ == undefined){
            for (let i = 0; i < this.e.message.length; i++) {
                const msg = this.e.message[i];
                if (msg.type == `image`) {
                    if(!msg.url){
                        plp_ = msg.file
                    } else {
                        plp_ = msg.url
                    }
                }
            }
        } else {
            plp_ = plp_.replace(/@/g, '');
            plp_ = plp_.replace(/\n/g, '');
            plp_ = plp_.replace(/；/g, '');
            plp_ = plp_.replace(/https/g, '');
            plp_ = plp_.replace(/⁧/g, '');
        }
        if(!plp_){
            e.reply(`扔漂流瓶失败了，无法在漂流瓶内塞进卡片内容。`)
            return true;
        }
        plp = `@${plp_}；${e.user_id}`
        let plpfile = `plugins/Gi-plugin/resources/plp/${date_time}.txt`
        let plpfile_ = `plugins/Gi-plugin/resources/plp`
        if (!fs_.existsSync(plpfile_)) {
            fs_.mkdirSync(plpfile_);
            await Gimodel.mdfile(plpfile)
        }
        /**let { config } = getconfig(`config`, `config`)
        if(config.plpshenhe){
            let PLPnumber = await redis.get(`Yunzai:Gi-plugin:PLPnumber`)
            if(!PLPnumber){
                PLPnumber = 10000;
            } else {
                PLPnumber = JSON.parse(PLPnumber)
            }
            let plpsh_ = `plugins/Gi-plugin/resources/plp/shenhe.txt`
            await Gimodel.mdfile(plpsh_)
            fs.appendFile(plpsh_, plp + `；${PLPnumber}`, `utf-8`)
            PLPnumber++;
            await redis.set(`Yunzai:Gi-plugin:PLPnumber`, JSON.stringify(PLPnumber))
            e.reply(`你的瓶子已经成功交由港口管理员审核了，审核通过后就可以送进海洋哦~`)
            return true;
        }**/
        fs.appendFile(plpfile, plp + `\n`, `utf-8`)
        let dcpost = {
            user_id: e.user_id,
            plpdata: plp_,
            botid: e.self_id,
            group_id: e.group_id
        }
        post(dcpost)
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
        /**
        let dc = {
            filePath,
            type: 'plp'
        }
        let plpid = await Gimodel.NewgetFile(dc, e)
        const randomIndex = Math.floor(Math.random() * plpid.length);
        if(plpid.length === 0){
            e.reply(`海里空空的，没有漂流瓶呢~`)
            return true;
        }
        let plp_id1 = plpid[randomIndex]
        const matches = plp_id1.match(/@(.*)；(.*)/);
        let plpcontent = await redis.get(`Yunzai:giplugin_plp_${matches[1]}`)
        plpcontent = JSON.parse(plpcontent)

        if(plpcontent.plp_type == `text`){
            e.reply(`正在查看漂流瓶……\n这个漂流瓶里有封信哎\n【漂流瓶】\n` + plpcontent.plp_text)
        } else if(plpcontent.plp_type == `image`){
            let msg = [`正在查看漂流瓶……\n这个漂流瓶里有照片哎\n【泛黄的照片】\n`, segment.image(plpcontent.plp_imgUrl)]
            e.reply(msg)
        } else if(plpcontent.plp_type == `text_img`){
            let msg = [`正在查看漂流瓶……\n这个漂流瓶里有一封信和一张照片哎\n【信和照片】\n` + plpcontent.plp_text, segment.image(plpcontent.plp_imgUrl)]
            e.reply(msg)
        }

        await Gimodel.delfile(dc.filePath, plp_id1)

        return true;**/

        let plp2;
        let dc = {
            filePath: filePath,
            type: `plp`
        }
        let Piaoliu = await Gimodel.NewgetFile(dc, e)
        let { config } = getconfig(`config`, `config`)
        const date_time = await Gimodel.date_time()
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
        Gimodel.delfile(filePath, plp2)
    }
}