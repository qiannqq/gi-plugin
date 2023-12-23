import { promises as fs } from 'fs'
import fs_ from 'fs'
import Gimodel from './getFile.js'

class init {
    async plp() {
        let dc = {
            type: 'init',
            filePath: 'plugins/Gi-plugin/resources/plp.txt'
        }
        let data = await Gimodel.NewgetFile(dc)

        for (const item of data) {
            const matches = item.match(/@(.*)；(.*)/);
            let plp_content = matches[1];
            let plp_userid = matches[2];
            let plp_type = `text`

            const regex = /https:\/\/(\w+\.)?qpic\.cn/;
            const regexHttp = /http:\/\/(\w+\.)?qpic\.cn/;

            let plp_imgUrl = ``
            if (plp_content.match(regex)) {
                plp_type = `image`
                plp_imgUrl = plp_content
                plp_content = ``
            } else if (plp_content.match(regexHttp)) {
                plp_type = `image`
                plp_imgUrl = plp_content
                plp_content = ``
            }
            let plp_id = await redis.get(`Yunzai:giplugin-plpid`)
            plp_id = JSON.parse(plp_id)
            if (plp_id == undefined) {
                plp_id = `1000001`
            } else {
                plp_id++;
            }
            let ok_data = {
                plp_id,
                plp_userid,
                plp_groupid: ``,
                plp_type,
                plp_text: plp_content,
                plp_imgUrl,
            }

            redis.set(`Yunzai:giplugin_plp_${plp_id}`, JSON.stringify(ok_data))
            redis.set(`Yunzai:giplugin-plpid`, JSON.stringify(plp_id))

            await Gimodel.delfile(dc.filePath, item)
            await fs.appendFile(dc.filePath, plp_id + `\n`, `utf-8`)
            
        }

        try {
            // 创建名为 "dont_del" 的文件
            await fs.writeFile('plugins/Gi-plugin/resources/data/dont_del', 'File created to mark completion', 'utf-8');
            logger.mark('初始化标记创建完成');
        } catch (error) {
            logger.error('初始化标记创建失败：', error);
        }

    }
}

export default new init