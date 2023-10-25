import { promises as fs } from 'fs';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Gimodel {
  async duquFile(filePath, callback) {
    console.log(`已废弃。`)
    /**fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const lines = data.split('@');
      const Piaoliu = [];

      lines.forEach((line) => {
        line = line.slice(0, -1);
        const parts = line.split('；');
        const plp = parts[0];
        const userid = parts[1];
        Piaoliu.push(`@${plp}；${userid}`);
      });

      callback(Piaoliu);
    });**/
  }
  async NewduquFile(dc, e) {
    let data = await fs.readFile(dc.filePath, 'utf-8')
    const lines = data.split('@');
    const Piaoliu = [];
    let msgList = [];
    msgList.push({
      message: `${e.group_name}(${e.group_id})的历史文献`,
      nickname: `Q群管家`
    })
    lines.forEach(async (line) => {
      line = line.slice(0, -1);
      const parts = line.split('；');
      const plp = parts[0];
      const userId = parts[1];
      if(dc.type == 'plp'){
        if (userId != undefined && userId != e.user_id) Piaoliu.push(`@${plp}；${userId}`)
      } else if(dc.type == 'history'){
        if(plp > 100000){
          let history = userId
          let userid_ = await redis.get(`Yunzai:giplugin-${plp}_history_userid`);
          userid_ = JSON.parse(userid_);
          let username = await redis.get(`Yunzai:giplugin-${plp}_history_username`);
          username = JSON.parse(username);
          let date = await redis.get(`Yunzai:giplugin-${plp}_history_date`);
          date = JSON.parse(date);
          history = history.replace(/换行/g, '\n');
          let history_text =
            `文献编号:${plp}
贡献者:${username}(${userid_})
贡献时间:${date}
文献正文:
${history}`
          msgList.push({
            message: history_text,
            nickname: `${username}(${userid_})`
          })
        }
      }
    })
    if(dc.type == 'plp') return Piaoliu
    if(dc.type == 'history') return msgList
   }
  async shanchu(filePath, shuju1) {
    try {
      const data = await readFileAsync(filePath, 'utf8');
      const regex = new RegExp(shuju1 + '\\r?\\n?', 'g');
      const updatedData = data.replace(regex, '');
      await writeFileAsync(filePath, updatedData, 'utf8');
    } catch (error) {
      logger.error(error);
    }

  }
}

export default new Gimodel