import plugin from '../../../lib/plugins/plugin.js';
import fs from 'fs';
import path from 'path';
import duquFile from '../model/duquFile.js';

export class lishiwenxian extends plugin {
  constructor() {
    super({
      name: 'Gi互动:历史文献',
      dsc: 'Gi互动:历史文献',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: '^#?本群历史$',
          fnc: '本群历史'
        },
        {
          reg: '^#?贡献历史$',
          fnc: '贡献历史1'
        }
      ]
    })
  }
  async 本群历史(e) {
    let filePath = `plugins/Gi-plugin/resources/history/${e.group_id}.txt`
    let msgList = [];
    msgList.push({
      message: `群${e.group_name}(${e.group_id})的历史文献`,
      nickname: `Q群管家`
    })
    try {
      const history_data = await new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const history_ = history_data.split('@');
      

      for (let line of history_) {
        line = line.slice(0, -1);
        const parts = line.split('；');
        const number = parts[0];
        let history = parts[1];
        if (number > 100000) {
          let userid = await redis.get(`Yunzai:giplugin-${number}_history_userid`);
          userid = JSON.parse(userid);
          let username = await redis.get(`Yunzai:giplugin-${number}_history_username`);
          username = JSON.parse(username);
          let date = await redis.get(`Yunzai:giplugin-${number}_history_date`);
          date = JSON.parse(date);
          history = history.replace(/换行/g, '\n');
          let history_text =
            `文献编号:${number}
贡献者:${username}(${userid})
贡献时间:${date}
文献正文:
${history}`
          msgList.push({
            message: history_text,
            nickname: `${username}(${userid})`
          })
        }
      };

      if (msgList.length > 0) {
        let dec = [`点击查看本群历史`]
        let forwardMsg = await e.group.makeForwardMsg(msgList)
        if (typeof (forwardMsg.data) === 'object') {
          let detail = forwardMsg.data?.meta?.detail
          if (detail) {
            detail.news = [{ text: `点击查看本群历史` }]
          }
        } else {
          forwardMsg.data = forwardMsg.data
            .replace(/\n/g, '')
            .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
            .replace(/___+/, `<title color="#777777" size="26">${dec}</title>`)
        }
        await e.reply(forwardMsg)
      } else {
        e.reply(`本群暂无历史文献，请发送“#贡献历史”以提交历史文献`)
      }
    } catch (error) {
      logger.error(error);
      return false;
    }
    return true;
  }
  async 贡献历史1(e) {
    //let filePath = `plugins/Gi-plugin/resources/history/${e.group_id}.txt`
    const filePath = path.join('plugins', 'Gi-plugin', `resources`, `history`, `${e.group_id}.txt`);
    const folderPath = path.join('plugins', 'Gi-plugin', `resources`, `history`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    (async () => {
      try {
        await fs.access(filePath, fs.constants.F_OK);
      } catch (err) {
        try {
          await fs.writeFile(filePath, '');
        } catch (writeErr) {
        }
      }
    })();
    e.reply(`贡献历史仅支持发送文字，请发送内容`)
    this.setContext(`贡献历史`)
  }
  async 贡献历史(e) {
    this.finish(`贡献历史`)
    let history;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    let formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    let filePath = `plugins/Gi-plugin/resources/history/${e.group_id}.txt`
    let message = this.e.message[0]
    if (message.type != `text`) {
      e.reply(`贡献失败，无法贡献除文字以外的内容`);
      return true;
    }
    let history_ = this.e.msg;
    //if (message.type == `image`) {
      //history_ = message.url;
    //} else {
      history_ = history_.replace(/@/g, '');
      history_ = history_.replace(/\n/g, '换行');
      history_ = history_.replace(/；/g, '');
      history_ = history_.replace(/https/g, '');
      history_ = history_.replace(/⁧/g, '');
    //}
    let number = await redis.get(`Yunzai:giplugin-${e.group_id}_history_number`);
    number = JSON.parse(number);
    if (!number) {
      number = `100000`
    }
    number++;
    history = `@${number}；${history_}`
    redis.set(`Yunzai:giplugin-${number}_history_userid`, JSON.stringify(e.user_id));
    redis.set(`Yunzai:giplugin-${number}_history_username`, JSON.stringify(e.nickname));
    redis.set(`Yunzai:giplugin-${number}_history_date`, JSON.stringify(formattedDateTime));
    redis.set(`Yunzai:giplugin-${e.group_id}_history_number`, JSON.stringify(number));
    let msg =
      `文献编号：${number}
贡献时间：【${formattedDateTime}】
贡献成功！`
    await fs.appendFile(filePath, history + '\n', 'utf8', (err) => {
      if (err) {
        logger.error(err);
        e.reply(`发生错误` + err)
        return;
      }
    })
    e.reply(msg)
  }
}