import { segment } from "icqq";
import cfg from '../../../lib/config/config.js'

function img_(e, msg, img) {
    if (cfg.package.name == `trss-yunzai`) {
        img.then(async result => {
            const file = result.file;
            let msg_ = [msg, segment.image(file)]
            await e.reply(msg_)
        }).catch(error => {
            console.error(error);
        });
    } else {
        let msg_ = [msg, img]
        e.reply(msg_) 
    }
}

export default img_