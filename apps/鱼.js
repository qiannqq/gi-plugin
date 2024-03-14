import common from'../../../lib/common/common.js'

export class Gi_yu extends plugin {
    constructor () {
      super({
        name: 'Gi互动:钓鱼',
        dsc: 'Gi互动:钓鱼',
        event: 'message',
        priority: 5000,
        rule: [
          {
            reg: '^(#|/)?(钓鱼|🎣)$',
            fnc: 'diaoyu'
          }
        ]
      })
    }
    async diaoyu(e){
        // let time = await timerManager.getRemainingTime(e.user_id) 获取该用户的倒计时器
        // let timeSet = timerManager.createTimer(e.user_id, 120); timeSet.start(); 设置该用户的倒计时器
        let time = await timerManager.getRemainingTime(e.user_id)
        if(!time || time == 0) {
            let timeSet = timerManager.createTimer(e.user_id, 120)
            timeSet.start()
            let randomNumber = Math.floor(Math.random() * 5) + 1;
            let yu;
            await e.reply(`你开始了钓鱼……`)
            switch(randomNumber) {
                case 1:
                    yu = "🐟"
                    break;
                case 2:
                    yu = "🐡"
                    break;
                case 3:
                    yu = "🦐"
                    break;
                case 4:
                    yu = "🦀"
                    break;
                case 5:
                    yu = "🐠"
                    break;
            }
            await common.sleep(2000)
            randomNumber = Math.floor(Math.random() * 5) + 1;
            switch(randomNumber) {
                case 1:
                    await e.reply([segment.at(e.user_id), `\n${yu}奋力挣扎着，却抵不过你拧不开瓶盖的力气。\n你将${yu}放到了水桶里。`])
                    break;
                case 2:
                    await e.reply([segment.at(e.user_id), `\n危险与机遇并存，${yu}抓准你走神的这一刻，猛的咬向鱼钩，却不想被鱼钩挂住了嘴。\n你将${yu}放到了水桶里`])
                    break;
                case 3:
                    await e.reply([segment.at(e.user_id), `\n“咦？挂底了？”\n就在你疑惑之时，鱼竿发觉到不对，猛地一起身，${yu}华丽的落到了你的水桶里。\n本场MVP：鱼竿`])
                    break;
                case 4:
                    await e.reply([segment.at(e.user_id), `\n一条${yu}上钩了。\n你将${yu}放到了水桶里`])
                    break;
                case 5:
                    await e.reply([segment.at(e.user_id), `\n早起的鸟有虫吃，早起的${yu}有饵吃~\n你将${yu}放到了水桶里`])
                    break;
            }
            return true
        } else {
            let randomNumber = Math.floor(Math.random() * 3) + 1;
            switch(randomNumber) {
                case 1:
                    await e.reply(`正在重新挂饵中……(${time}s)`)
                    break;
                case 2:
                    await e.reply(`鱼竿：你知道我想说什么。(鱼竿的假期还有${time}s结束)`)
                    break;
                case 3:
                    await e.reply(`鱼被吓跑了，它们需要些时间游回来……(${time}s)`)
                    break;
            }
            return true
        }
    }
}