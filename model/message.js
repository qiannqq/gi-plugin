import cfg from '../../../lib/config/config.js'

function img_(e, msg, img) {
    console.log(`已废弃。`)
    /**
    if (cfg.package.name == `trss-yunzai`) {
        img.then(async result => {
            const file = result.file;
            let msg2 = msg[0]
            if (!msg2 || msg2.type === undefined || msg2.type === null){
            if(msg2 == undefined) { msg2 = `` }
            let msg_ = [msg2, segment.image(file)]
            await e.reply(msg_)
            } else {
                let msg1 = msg[1]
                let msg_ = [segment.at(msg2.qq), msg1, segment.image(file)]
                await e.reply(msg_)
            }
        }).catch(error => {
            console.error(error);
        });
    } else {
        let msg_ = [msg, img]
        e.reply(msg_)
    }
    */
}

export default img_