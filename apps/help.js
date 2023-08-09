import plugin from "../../../lib/plugins/plugin.js";
import puppeteer from "../../../lib/puppeteer/puppeteer.js"

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
        image(e, 'help', 'help', {});
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