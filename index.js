import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'yaml'
import init from './model/init.js';

////////////////////////////////////////////////////////////////////
//                          _ooOoo_                               //
//                         o8888888o                              //
//                         88" . "88                              //
//                         (| ^_^ |)                              //
//                         O\  =  /O                              //
//                      ____/`---'\____                           //
//                    .'  \\|     |//  `.                         //
//                   /  \\|||  :  |||//  \                        //
//                  /  _||||| -:- |||||-  \                       //
//                  |   | \\\  -  /// |   |                       //
//                  | \_|  ''\---/''  |   |                       //
//                  \  .-\__  `-`  ___/-. /                       //
//                ___`. .'  /--.--\  `. . ___                     //
//              ."" '<  `.___\_<|>_/___.'  >'"".                  //
//            | | :  `- \`.;`\ _ /`;.`/ - ` : | |                 //
//            \  \ `-.   \_ __\ /__ _/   .-` /  /                 //
//      ========`-.____`-.___\_____/___.-`____.-'========         //
//                           `=---='                              //
//      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //
//         佛祖保佑       永无BUG     永不修改                     //
////////////////////////////////////////////////////////////////////

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//加载漂流瓶文件
const resourcesFolderPath = path.join(__dirname, 'resources');
const plpFilePath = path.join(resourcesFolderPath, 'plp.txt');
if (!fs.existsSync(resourcesFolderPath)) {
  fs.mkdirSync(resourcesFolderPath);
}

if (!fs.existsSync(plpFilePath)) {
  fs.closeSync(fs.openSync(plpFilePath, 'w'));
}

//加载配置文件
const _path = process.cwd().replace(/\\/g, '/');
const configFolder = path.join(`${_path}/plugins/Gi-plugin`, 'config');
const defSetFolder = path.join(`${_path}/plugins/Gi-plugin`, 'defSet');
if (!fs.existsSync(configFolder)) {
  fs.mkdirSync(configFolder);
}
const configFilePath = path.join(configFolder, 'config.yaml');
if (!fs.existsSync(configFilePath)) {
  const defConfigFilePath = path.join(defSetFolder, 'config.yaml');
  fs.copyFileSync(defConfigFilePath, configFilePath);
} else {
  const configFilePath = path.join(configFolder, 'config.yaml');
  const defConfigFilePath = path.join(defSetFolder, 'config.yaml');
  const defConfig = yaml.parse(fs.readFileSync(defConfigFilePath, 'utf8'));
  let config = yaml.parse(fs.readFileSync(configFilePath, 'utf8'));
  for (const key in defConfig) {
    if (!config.hasOwnProperty(key)) {
      config[key] = defConfig[key];
    }
  }
  const updatedConfigYAML = yaml.stringify(config);
  fs.writeFileSync(configFilePath, updatedConfigYAML, 'utf8');
}
const pokeFilePath = path.join(configFolder, 'poke.yaml');
if (!fs.existsSync(pokeFilePath)) {
  const defPokeFilePath = path.join(defSetFolder, 'poke.yaml');
  fs.copyFileSync(defPokeFilePath, pokeFilePath);
}

if(!fs.existsSync(`./plugins/Gi-plugin/config/fishText.yaml`)) {
  fs.copyFileSync(`./plugins/Gi-plugin/defSet/fishText.yaml`, `./plugins/Gi-plugin/config/fishText.yaml`)
} else {
  let config = yaml.parse(fs.readFileSync(`./plugins/Gi-plugin/config/fishText.yaml`, `utf-8`))
  let configNT = config.nothingText || []
  config = config.fishText
  let defcfg = yaml.parse(fs.readFileSync(`./plugins/Gi-plugin/defSet/fishText.yaml`, `utf-8`))
  let defcfgNT = defcfg.nothingText
  defcfg = defcfg.fishText
  fs.writeFileSync(`./plugins/Gi-plugin/config/fishText.yaml`, yaml.stringify({ fishText: [...new Set(config.concat(defcfg))], nothingText: [...new Set(configNT.concat(defcfgNT))] }), `utf-8`)
}

//旧版漂流瓶符号替换为新版漂流瓶符号
// let newplp = await redis.get(`Yunzai:giplugin-newplp`);
// newplp = JSON.parse(newplp);
// if (newplp != `ok`) {
//   fs.readFile(`${_path}/plugins/Gi-plugin/resources/plp.txt`, 'utf8', (err, data) => {
//     if (err) {
//       logger.error("漂流瓶文件初始化出错：", err);
//       return;
//     }

//     const modifiedData = data.replace(/-/g, '@');
//     fs.writeFile(`${_path}/plugins/Gi-plugin/resources/plp.txt`, modifiedData, 'utf8', (err) => {
//       if (err) {
//         logger.error("漂流瓶文件初始化出错：", err);
//         return;
//       }
//     });
//   });
//   redis.set(`Yunzai:giplugin-newplp`, JSON.stringify(`ok`));
// }
//创建数据文件夹
if(!fs.existsSync(`${_path}/plugins/Gi-plugin/resources/data`)) {
  fs.mkdirSync(`${_path}/plugins/Gi-plugin/resources/data`)
}
//迁移旧版漂流瓶数据文件至新版
if(!fs.existsSync(`${_path}/plugins/Gi-plugin/resources/data/dont_del`)) {
  init.plp()
}
// 计时器创建
class CountdownTimer {
  constructor(duration) {
      this.duration = duration;
  }

  start() {
      return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
              this.duration--;

              if (this.duration <= 0) {
                  clearInterval(interval);
                  resolve();
              }
          }, 1000);
      });
  }

  getRemainingTime() {
      return this.duration;
  }
}

class TimerManager {
  constructor() {
      this.timers = {};
  }

  createTimer(user_id, duration) {
      this.timers[user_id] = new CountdownTimer(duration);
      return this.timers[user_id];
  }

  getRemainingTime(user_id) {
      const timer = this.timers[user_id];
      if (timer) {
          return timer.getRemainingTime();
      } else {
          return null;
      }
  }
}

let timerManager = new TimerManager();
global.timerManager = timerManager

// 全局声明Gi版本
let GiPluginVersion = JSON.parse(fs.readFileSync(`./plugins/Gi-plugin/package.json`, `utf-8`))
GiPluginVersion = GiPluginVersion.version
global.GiPluginVersion = GiPluginVersion

let ret = []

logger.info(`---------ヾ(✿ﾟ▽ﾟ)ノ---------`)
logger.info(`互动插件载入成功！`)
logger.info(`Created By 千奈千祁`)




const files = fs
  .readdirSync('./plugins/Gi-plugin/apps')
  .filter((file) => file.endsWith('.js'))

files.forEach((file) => {
    ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')
  
  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
logger.info(`-----------------------------`)
export { apps }
