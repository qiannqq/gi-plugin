import plugin from "../../../lib/plugins/plugin.js";
import puppeteer from "../../../lib/puppeteer/puppeteer.js"
//import help from "../resources/html/help.html"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Text = 
`===【Gi插件使用帮助】===
扔漂流瓶：扔出一个漂流瓶，每天只能扔一次
捡漂流瓶：捞出一个漂流瓶，每天只能捡一次
每日打卡：随机抽取幸运值，每天只能抽一次
互动更新：互动插件更新
互动强制更新：忽略本地冲突，强制更新`

export class example2 extends plugin {
    constructor(){
        super({
            name: 'Gi互动:帮助',
            dsc: 'Gi互动:帮助',
            event: 'message',
            priority: 500,
            rule:[
                {
                    reg: '#?(Gi|互动)帮助',
                    fnc: 'help'
                }
            ]
        })
    }
    async help(e){
        //e.reply(Text)
        //e.reply(__dirname)
        image(e, 'help', 'help', {

        });
        return true;
    }
}
async function image(e, file, name) {
    let data = {
        quality: 100,
        tplFile: `./plugins/Gi-plugin/resources/html/help.html`,
    }
    let img = puppeteer.screenshot(name, {
        ...data,
      })
      e.reply(img)
}