import plugin from "../../../lib/plugins/plugin.js";
import image from "../model/image.js";
import img_ from "../model/message.js";

export class chafen extends plugin {
    constructor(){
        super({
            name: 'Gi互动:模拟高考查分',
            dsc: 'Gi互动:模拟高考查分',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '#?查分$',
                    fnc: '查分'
                }
            ]
        })
    }
    async 查分(e){
        let zhi1 = await redis.get(`Yunzai:chafen${e.user_id}`);zhi1 = JSON.parse(zhi1);
        if (zhi1 === 8) {
          let yuwen = await redis.get(`Yunzai:chafen${e.user_id}_yuwen`);yuwen = JSON.parse(yuwen);
          let shuxue = await redis.get(`Yunzai:chafen${e.user_id}_shuxue`);shuxue = JSON.parse(shuxue);
          let yingyu = await redis.get(`Yunzai:chafen${e.user_id}_yingyu`);yingyu = JSON.parse(yingyu);
          let wuli = await redis.get(`Yunzai:chafen${e.user_id}_wuli`);wuli = JSON.parse(wuli);
          let zhengzhi = await redis.get(`Yunzai:chafen${e.user_id}_zhengzhi`);zhengzhi = JSON.parse(zhengzhi);
          let huaxue = await redis.get(`Yunzai:chafen${e.user_id}_huaxue`);huaxue = JSON.parse(huaxue);
          let zongfen = await redis.get(`Yunzai:chafen${e.user_id}_zongfen`);zongfen = JSON.parse(zongfen);
          const user_id = e.user_id;
          const user_name = e.nickname;
          const { img } = image(e, 'chafen', 'chafen',{
            user_id,
            user_name,
            yuwen,
            shuxue,
            yingyu,
            wuli,
            zhengzhi,
            huaxue,
            zongfen,
          });
            let msg = [
                segment.at(e.user_id),
                `\n你已经查过分了\n`
            ]
            //e.reply(msg)
            img_(e, msg, img)
            return true;
        }
        let zhi = 8;
        redis.set(`Yunzai:chafen${e.user_id}`, JSON.stringify(zhi));
        const yuwen = Math.floor(Math.random() * 111) + 40;
        const shuxue = Math.floor(Math.random() * 111) + 40;
        const yingyu = Math.floor(Math.random() * 111) + 40;
        const wuli = Math.floor(Math.random() * 71) + 30;
        const zhengzhi = Math.floor(Math.random() * 71) + 30;
        const huaxue = Math.floor(Math.random() * 71) + 30;
        const zongfen = yuwen + shuxue + yingyu + wuli + zhengzhi + huaxue;
        const user_name = e.nickname;
        const user_id = e.user_id;
        const { img } = image(e, 'chafen', 'chafen',{
          user_id,
          user_name,
          yuwen,
          shuxue,
          yingyu,
          wuli,
          zhengzhi,
          huaxue,
          zongfen,
        });
        let msg = [
            segment.at(e.user_id),
            `\n你的分数是……\n`]
        //e.reply(msg)
        img_(e, msg, img)
        redis.set(`Yunzai:chafen${e.user_id}_yuwen`, JSON.stringify(yuwen));//语文
        redis.set(`Yunzai:chafen${e.user_id}_shuxue`, JSON.stringify(shuxue));//数学
        redis.set(`Yunzai:chafen${e.user_id}_yingyu`, JSON.stringify(yingyu));//英语
        redis.set(`Yunzai:chafen${e.user_id}_wuli`, JSON.stringify(wuli));//物理
        redis.set(`Yunzai:chafen${e.user_id}_zhengzhi`, JSON.stringify(zhengzhi));//政治
        redis.set(`Yunzai:chafen${e.user_id}_huaxue`, JSON.stringify(huaxue));//化学
        redis.set(`Yunzai:chafen${e.user_id}_zongfen`, JSON.stringify(zongfen));//总分
        return true;
    }
}