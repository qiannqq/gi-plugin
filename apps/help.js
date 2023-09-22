import plugin from "../../../lib/plugins/plugin.js";
import image from "../model/image.js";
import { segment } from "icqq";
import cfg from '../../../lib/config/config.js'

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
        const { img } = image(e, 'help', 'help')
        if (cfg.package.name == `trss-yunzai`) {
            img.then(async result => {
                const file = result.file;
                await e.reply(segment.image(file))
            }).catch(error => {
                console.error(error);
            });
        } else { e.reply(img) }
        return true;
    }
}