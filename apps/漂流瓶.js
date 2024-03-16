import plugin from '../../../lib/plugins/plugin.js';
import Gimodel from '../model/getFile.js';
import getconfig from '../model/cfg.js';
import { promises as fs } from 'fs';
import fs_ from 'fs'
import post from '../model/post.js';
import fetch from 'node-fetch';
import { segment } from 'icqq';

const filePath = `plugins/Gi-plugin/resources/plp.txt`
const GiPath = `./plugins/Gi-plugin`
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
        await e.reply(`该功能正在维护中……`) 
        // 漂流瓶结构大改，所以撤回漂流瓶要维护
        return true
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
        }
        let times_ = await redis.get(`Yunzai:Giplp_${e.user_id}_times`)
        times_ = JSON.parse(times_)
        let type;
        let plp_content;
        let plp_imgUrl;
        if(this.e.msg && this.e.img){
            type = `text_img`
            plp_content = this.e.msg
            plp_imgUrl = this.e.img
        } else if(this.e.msg) {
            type = `text`
            plp_content = this.e.msg
            plp_imgUrl = ``
        } else if(this.e.img) {
            type = `image`
            plp_content = ``
            plp_imgUrl = this.e.img
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
        redis.set(`Yunzai:giplugin_plp_${plp_id}`, JSON.stringify(plp))
        redis.set(`Yunzai:giplugin-plpid`, JSON.stringify(plp_id))
        let data;
        try {
            data = JSON.parse(await fs.readFile(GiPath + `/data/dbid.json`, `utf-8`))
        } catch {
            data = []
        }
        data.push({ number: plp_id, qq: e.user_id })
        if(!fs_.existsSync(GiPath + `/data`)) {
            fs_.mkdirSync(GiPath + `/data`)
        }
        await fs.writeFile(GiPath + `/data/dbid.json`, JSON.stringify(data, null, 3), `utf-8`)
        e.reply(`你的漂流瓶成功扔出去了~`)
        logger.mark(`[Gi互动:扔漂流瓶]用户${e.user_id}扔了一个漂流瓶【${plp}】`)
        return true;
    }
    async 捡漂流瓶(e){
        let plpid;
        try {
            plpid = JSON.parse(fs_.readFileSync(GiPath + `/data/dbid.json`, `utf-8`))
        } catch {
            plpid = []
        }
        if(plpid.length === 0){
            let { config } = getconfig(`config`, `config`)
            if(config.plpapi) {
                this.捡漂流瓶API(e)
                return true
            }
            e.reply(`海里空空的，没有漂流瓶呢~`)
            return true;
        }
        let plp_id1 = plpid[Math.floor(Math.random() * plpid.length)]
        let plpcontent = JSON.parse(await redis.get(`Yunzai:giplugin_plp_${plp_id1.number}`))
        // console.log(plp_id1.number)
        let msgList = []
        if(plpcontent.plp_type == `text`){
            msgList.push({
                user_id: plp_id1.qq,
                message: plpcontent.plp_text
            })
            let msg = await Bot[Bot.uin].pickUser(e.self_id).makeForwardMsg(msgList)
            let detail = msg.data?.meta?.detail
            detail.news = [{ text: `点击查看漂流瓶` }]
            await e.reply(msg)
        } else if(plpcontent.plp_type == `image`){
            msgList.push({
                user_id: plp_id1.qq,
                message: segment.image(plpcontent.plp_imgUrl[0])
            })
            let msg = await Bot[Bot.uin].pickUser(e.self_id).makeForwardMsg(msgList)
            let detail = msg.data?.meta?.detail
            detail.news = [{ text: `点击查看漂流瓶` }]
            await e.reply(msg)
        } else if(plpcontent.plp_type == `text_img`){
            msgList.push({
                user_id: plp_id1.qq,
                message: [plpcontent.plp_text, segment.image(plpcontent.plp_imgUrl[0])]
            })
            let msg = await Bot[Bot.uin].pickUser(e.self_id).makeForwardMsg(msgList)
            let detail = msg.data?.meta?.detail
            detail.news = [{ text: `点击查看漂流瓶` }]
            await e.reply(msg)
        }

        await Gimodel.deljson(plp_id1, GiPath + `/data/dbid.json`)
        await redis.del(`Yunzai:giplugin_plp_${plp_id1.number}`)

        return true;
    }
    async 捡漂流瓶API(e){
        let plp = await fetch(`https://free.wqwlkj.cn/wqwlapi/drift.php?select=&type=json`)
        try {
            plp = await plp.json()
        } catch {
            e.reply(`海里空空的，似乎没有漂流瓶呢`)
            return
        }
        if(plp.code != 1) {
            e.reply(`海里空空的，似乎没有漂流瓶呢`)
            return
        }
        let msg =
`正在查看漂流瓶
这个漂流瓶里有封信哎
【漂流瓶】
标题：${plp.title}
正文：${plp.content}`
        await e.reply(msg)
    }
}