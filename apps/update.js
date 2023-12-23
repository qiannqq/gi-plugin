import { exec } from 'child_process';
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
                e.reply(`互动插件更新成功，请重启${botname}以应用更新\n更新内容请查看：https://gitee.com/qiannqq/gi-plugin/commits/master`);
            }
        });
    }
}
