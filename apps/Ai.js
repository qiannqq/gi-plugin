import plugin from '../../../lib/plugins/plugin.js';
import fetch from "node-fetch";

export class GPT extends plugin {
    constructor () {
      super({
        name: '语言模型',
        dsc: '语言模型',
        event: 'message',
        priority: 5000,
        rule: [
          {
            reg: '^#(ai|aI|Ai|AI)(.*)$',
            fnc: 'GPT'
          }
        ]
      })
    }
    async GPT(e){
        let msg = e.msg;
        const msgmatch = msg.match(/#(ai|aI|Ai|AI)(.*)/)
        if(msgmatch[2] == ``) return true;
        let api = `https://api.lolimi.cn/API/AI/xh.php?msg=${msgmatch[2]}`
        let Aimsg = await fetch(api)
        Aimsg = await Aimsg.json()
        if(Aimsg.code != 200){
            
        }
        if(msgmatch[1] == `星火`){
          let api = `https://api.lolimi.cn/API/AI/xh.php?msg=${msgmatch[2]}`
          let Aimsg = await fetch(api)
          Aimsg = await Aimsg.json()
          if(Aimsg.code != 200) return true
          e.reply(Aimsg.data.output, true)
        } else if(msgmatch[1] == `文心`){
          let api = `https://api.lolimi.cn/API/AI/wx.php?msg=${msgmatch[2]}`
          let Aimsg = await fetch(api)
          Aimsg = await Aimsg.json()
          if(Aimsg.code != 200) return true;
          e.reply(Aimsg.data.output, true)
        } else if(msgmatch[1] == `chat`){
          let api = `https://api.lolimi.cn/API/AI/mfcat3.5.php?msg=${msgmatch[2]}&type=json`
          let Aimsg = await fetch(api)
          Aimsg = await Aimsg.json()
          if(Aimsg.code != 1) {
            logger.mark(Aimsg)  
            return true;
          }
          e.reply(Aimsg.data, true)
        }
        return true;
    }
}