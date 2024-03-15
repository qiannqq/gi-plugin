import fs from 'fs'
import getconfig from './cfg.js'

class Fish {
    async get_fish() {
        let fishArray = ["🐟", "🐡", "🦐", "🦀", "🐠"]
        return fishArray[Math.floor(Math.random() * 5)]
    }
    async fishing_text() {
        let { config } = getconfig('config', 'fishText')
        let textList = config
        return textList.fishText[Math.floor(Math.random() * textList.fishText.length)]
    }

}
export default new Fish