import fs from 'fs'
import getconfig from './cfg.js'
let GiPath = `./plugins/Gi-plugin`

class Fish {
    async get_fish() {
        let fishArray = ["🐟", "🐡", "🦐", "🦀", "🐠", "🐙", "🦑"]
        return fishArray[Math.floor(Math.random() * fishArray.length)]
    }
    async fishing_text() {
        let { config } = getconfig('config', 'fishText')
        let textList = config
        return textList.fishText[Math.floor(Math.random() * textList.fishText.length)]
    }
    /**
     * 存鱼
     * @param {*} uid e.user_id 用户QQ
     * @param {*} yu 鱼，fish
     */
    async wr_bucket(uid, yu) {
        let a = `utf-8`
        if(!fs.existsSync(GiPath + `/data`)) {
            fs.mkdirSync(GiPath + `/data`)
        }
        if(!fs.existsSync(GiPath + `/data/fishing`)) {
            fs.mkdirSync(GiPath + '/data/fishing')
        }
        let playerInfo
        try {
            playerInfo = fs.readFileSync(GiPath + `/data/fishing/${uid}.json`, a)
            playerInfo = JSON.parse(playerInfo)
        } catch {
            playerInfo = []
        }
        let number
        for(let item of playerInfo) {
            if(item.fishType == yu) {
                item.number++
                number = true
            }
        }
        if(!number) {
            playerInfo.push({ fishType: yu, number: 1 })
        }
        playerInfo = JSON.stringify(playerInfo, null, 3)
        fs.writeFileSync(GiPath + `/data/fishing/${uid}.json`, playerInfo, a)
        return true
    }

}
export default new Fish