import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cfg from '../../../lib/config/config.js'
import getconfig from '../model/cfg.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class update extends plugin {
    constructor() {
        super({
            name: '互动插件更新',
            dsc: '互动插件更新',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: '^#?(互动|Gi)(强制)?更新$',
                    fnc: '互动插件更新',
                    Permission: 'master'
                }
            ]
        });
        this.task = {
            cron: '0 20 1 * * ?',
            name: '自动更新',
            fnc: this.自动更新.bind(this)
          }
    }
    async 自动更新(){
        let botname = cfg.package.name
        const { config } = getconfig(`config`)
        if(!config.autoupdate) return true;
        const parentDir = path.join(__dirname, '..');
        exec(`git pull`, { cwd: parentDir }, (error, stdout, stderr) => {
            if (error) {
                Bot.PickUser(cfg.masterQQ[0]).sendMsg(`更新失败！\n${error.message}`);
            } else if (stdout.includes('Already up to date.')) {
                //e.reply(`互动插件已经是最新的了`);
            } else {
                Bot.PickUser(cfg.masterQQ[0]).sendMsg(`互动插件更新成功，请重新${botname}以应用更新`);
            }
        });
    }
    async 互动插件更新(e) {
        let botname = cfg.package.name
        e.reply(`[Gi-plugin]正在执行更新操作，请稍等`)
        const parentDir = path.join(__dirname, '..'); // 上级目录路径
        const gitPullCmd = 'git pull';
        const gitPullForceCmd = 'git reset --hard origin/master && git pull --force';

        let command = gitPullCmd;

        if (e.msg.includes("强制")) {
            command = gitPullForceCmd;
        }
        exec(command, { cwd: parentDir }, (error, stdout, stderr) => {
            if (error) {
                e.reply(`更新失败！\n${error.message}`);
            } else if (stdout.includes('Already up to date.')) {
                e.reply(`互动插件已经是最新的了`);
            } else {
                e.reply(`互动插件更新成功，请重新${botname}以应用更新`);
            }
        });
    }
}
