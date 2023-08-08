import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
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
    }

    async 互动插件更新(e) {
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
                e.reply(`互动插件更新成功，请重新云崽以应用更新`);
            }
        });
    }
}
