import { exec } from 'child_process'

export class updata extends plugin {
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
        })
    }
    async 互动插件更新(e){
        if (e.msg.includes("强制")) {
            exec('git pull --force', (error, stdout, stderr) => {
                if(error) {
                    e.reply(`更新失败！\n` + error.message)
                } else if (stdout.includes('Already up to date.')) {
                    e.reply(`互动插件已经是最新的了`)
                } else {
                    e.reply(`互动插件更新成功，请重新云崽以应用更新`)
                }
            })
        } else {
            exec('git pull', (error, stdout, stderr) => {
                if (error) {
                    let msg = '更新失败！\n' + error.message;
                    e.reply(msg);
                  } else if (stdout.includes('Already up to date.')) {
                    let msg = '互动插件已经是最新的了';
                    e.reply(msg);
                  } else {
                    e.reply(`互动插件更新成功，请重新云崽以应用更新`)
                  }
            });
        }
    }
}