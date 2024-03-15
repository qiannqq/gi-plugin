import fs from 'fs'
import getconfig from './cfg.js'
import Gimodel from './getFile.js'
let GiPath = `./plugins/Gi-plugin`

class Fish {
    /**
     * 取鱼
     * @returns 
     */
    async get_fish() {
        let fishArray = ["🐟", "🐡", "🦐", "🦀", "🐠", "🐙", "🦑", "特殊事件"]
        return fishArray[Math.floor(Math.random() * fishArray.length)]
    }
    async fishing_text() {
        let { config } = getconfig('config', 'fishText')
        let textList = config
        return textList.fishText[Math.floor(Math.random() * textList.fishText.length)]
    }
    /**
     * 存鱼
     * @param {number} uid e.user_id 用户QQ
     * @param {string} yu 鱼，fish
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
    /**
     * 水桶信息
     * @param {number} uid e.user_id 用户QQ
     * @returns 
     */
    async getinfo_bucket(uid) {
        let a = 'utf-8'
        if(!fs.existsSync(GiPath + '/data/fishing') || !fs.existsSync(GiPath + `/data/fishing/${uid}.json`)) {
            return []
        }
        let playerBucket
        try {
            playerBucket = JSON.parse(fs.readFileSync(GiPath + `/data/fishing/${uid}.json`), a)
        } catch (error) {
            playerBucket = []
        }
        return playerBucket
    }
    /**
     * 为用户的钓鱼账户增加鱼币
     * @param {number} uid 用户QQ
     * @param {number} number 增加的鱼币数量
     * @param {string} nickname e.nickname 用户名称，用于鱼布斯财富榜
     * @returns 
     */
    async wr_money(uid, number, nickname) {
        let a = 'utf-8'
        let playerList_money
        if(!fs.existsSync(GiPath + `/data/fishing`)) {
            fs.mkdirSync(GiPath + `/data/fishing`)
        }
        try {
            playerList_money = JSON.parse(fs.readFileSync(GiPath + `/data/fishing/PlayerListMoney.json`, a))
        } catch {
            playerList_money = []
        }
        let playerInfo = []
        for (let item of playerList_money) {
            if(item.uid == uid) playerInfo.push(item)
        }
        if(playerInfo.length == 0){
            playerInfo.push({ uid: uid, uname: nickname, money: number })
        } else {
            await Gimodel.deljson(playerInfo[0], GiPath + `/data/fishing/PlayerListMoney.json`)
            if(!playerInfo[0].nickname){
                playerInfo[0] = {
                    uid,
                    uname: nickname,
                    money: playerInfo[0].money + number,
                }
            } else {
                playerInfo[0].money = playerInfo[0].money + number
            }
        }
        try {
            playerList_money = JSON.parse(fs.readFileSync(GiPath + `/data/fishing/PlayerListMoney.json`, a))
        } catch (error) {
            playerList_money = []
        }
        playerList_money.push(playerInfo[0])
        fs.writeFileSync(GiPath + `/data/fishing/PlayerListMoney.json`, JSON.stringify(playerList_money, null, 3), a) //打字的时候越看这个M越像猫猫，看来我是缺猫了()
        return true
    }
    
    async del_fish(uid, fish, number = 1){
        let a = `utf-8`
        let playerBucket = await this.getinfo_bucket(uid)
        let targetFish = []
        for (let item of playerBucket) {
            if(item.fishType == fish) targetFish.push(item)
        }
        await Gimodel.deljson(targetFish[0], GiPath + `/data/fishing/${uid}.json`)
        targetFish[0].number = targetFish[0].number - number
        playerBucket = await this.getinfo_bucket(uid)
        playerBucket.push(targetFish[0])
        fs.writeFileSync(GiPath + `/data/fishing/${uid}.json`, JSON.stringify(playerBucket, null, 3), a)
        return true
    }

    async get_usermoneyInfo(uid){
        let a = `utf-8`
        let userNumber
        let b
        try {
            b = JSON.parse(fs.readFileSync(GiPath + `/data/fishing/PlayerListMoney.json`, a))            
        } catch (error) {
            b = []
        }
        for (let c of b) {
            if(c.uid == uid) userNumber = c.money
        }
        if(!userNumber) return 0
        return userNumber
    }

}
export default new Fish