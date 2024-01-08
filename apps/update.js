import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { exec, execSync } = require("child_process");
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cfg from '../../../lib/config/config.js'
import getconfig from '../model/cfg.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { config } = getconfig(`config`, `config`)

export class update extends plugin {
    constructor() {
        super({
            name: '互动插件更新',
            dsc: '互动插件更新',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '^(#|/)?(互动|Gi|gi|gI|GI)(强制)?更新$',
                    fnc: '互动插件更新',
                    //Permission: 'master'
                }
            ]
        });
        this.task = {
            cron: config.updatetime,
            name: '自动更新',
            fnc: this.自动更新.bind(this)
          }
    }
    async 自动更新(){
        let botname = cfg.package.name
        const { config } = getconfig(`config`, `config`)
        if(!config.autoupdate) return true;
        const parentDir = path.join(__dirname, '..');
        exec(`git pull`, { cwd: parentDir }, (error, stdout, stderr) => {
            if (error) {
                logger.error(`[Gi自动更新]更新失败！\n${error.message}`);
            } else if (stdout.includes('Already up to date.')) {
                logger.mark(`[Gi自动更新]互动插件未发现新版本`);
            } else {
                logger.mark(`[Gi自动更新]互动插件更新成功，请重启${botname}以应用更新`);
            }
        });
    }
    async 互动插件更新(e) {
        if(!e.isMaster){
            e.reply(`暂无权限，只有主人才能操作`)
            return true;
        }
        let botname = cfg.package.name
        //e.reply(`[Gi-plugin]正在执行更新操作，请稍等`)
        const gitPullCmd = 'git -C ./plugins/Gi-plugin/ pull --no--rebase';
        //const gitPullForceCmd = 'git reset --hard origin/master && git pull --force';

        let command = gitPullCmd;

        if (e.msg.includes("强制")) {
            e.reply(`[Gi-plugin]正在执行强制更新操作，请稍等`)
            command = `git -C ./plugins/earth-k-plugin/ checkout . && ${gitPullCmd}`
        } else {
            e.reply(`[Gi-plugin]正在执行更新操作，请稍等`)
        }
        this.oldCommitId = await getcommitId(`Gi-plugin`)

        let ret = await execSyncc(command)

        if(ret.error){
            gitErr(ret.error, ret.stdout);
            return true;
        }

        let msgList = [];
        let time = await getTime(`Gi-plugin`)
        if (/(Already up[ -]to[ -]date|已经是最新的)/.test(ret.stdout)){
            await e.reply(`互动插件已经是最新的了\n最后更新时间:${time}`)
        } else {
            await e.reply(`互动插件\n最后更新时间:${time}`)
            let log = await getLog(`Gi-plugin`)
            for (let item of log) {
                msgList.push({
                    user_id: Bot.uin,
                    nickname: Bot.nickname,
                    message: item
                })
            }
            try {
                msgList = await e.group.makeForwardMsg(msgList)
            } catch(err) {
                msgList = await e.friend.makeForwardMsg(msgList)
            }
            e.reply(msgList)
        }

    }
}


async function getLog(plugin) {
    let cm = `cd ./plugins/${plugin}/ && git log -20 --oneline --pretty=format:'%h||[%cd] %s' --date=format:'%m-%d %H:%M'`;

    let logAll;
    try {
        logAll = await execSync(cm, { encoding: "utf-8" });
    } catch (error) {
        logger.error(error.toString());
        this.reply(error.toString());
        return [];
    }

    if (!logAll) return [];

    logAll = logAll.split("\n").map(line => {
        const [hash, details] = line.split("||");
        if (hash === this.oldCommitId || details.includes("Merge branch")) {
            return null;
        }
        return details.replace(/^\[(.*?)\]\s*/, '');
    }).filter(Boolean);

    return logAll;
}
/**
 * 获取上次提交的commitId
 * @param {string} plugin 插件名称
 * @returns 
 */
async function getcommitId(plugin) {
    let cm = `git -C ./plugins/${plugin}/ rev-parse --short HEAD`;

    let commitId = await execSync(cm, { encoding: "utf-8" });
    commitId = lodash.trim(commitId);

    return commitId;
}

async function execSyncc(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
        resolve({ error, stdout, stderr });
      });
    });
}

async function gitErr(err, stdout) {
    let msg = "更新失败！";
    let errMsg = err.toString();
    stdout = stdout.toString();

    if (errMsg.includes("Timed out")) {
      let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, "");
      await this.reply(msg + `\n连接超时：${remote}`);
      return;
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
      let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, "");
      await this.reply(msg + `\n连接失败：${remote}`);
      return;
    }

    if (errMsg.includes("be overwritten by merge")) {
      await this.reply(
        msg +
        `存在冲突：\n${errMsg}\n` +
        "请解决冲突后再更新，或者执行#强制更新，放弃本地修改"
      );
      return;
    }

    if (stdout.includes("CONFLICT")) {
      await this.reply([
        msg + "存在冲突\n",
        errMsg,
        stdout,
        "\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改",
      ]);
      return;
    }

    await this.reply([errMsg, stdout]);
}

async function getTime(plugin){
    let cm = `cd ./plugins/${plugin}/ && git log -1 --oneline --pretty=format:"%cd" --date=format:"%m-%d %H:%M"`;

    let time = "";
    try {
      time = await execSync(cm, { encoding: "utf-8" });
      time = lodash.trim(time);
    } catch (error) {
      logger.error(error.toString());
      time = "获取时间失败";
    }
    return time;
}