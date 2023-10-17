import plugin from "../../../lib/plugins/plugin.js";
import image from "../model/image.js";
import img_ from '../model/message.js'

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
        const { img } = await image(e, 'help', 'help')
        e.reply(img)
        return true;
    }
}