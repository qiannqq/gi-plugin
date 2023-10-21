import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import getconfig from './model/cfg.js';
import fs from 'fs';
import yaml from 'yaml';
import lodash from 'lodash'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export function supportGuoba() {
  return {
    pluginInfo: {
      name: `Gi-plugin`,
      title: '互动插件(Gi-plugin)',
      author: '@千奈千祁',
      authorLink: 'https://gitee.com/QianNQQ',
      link: 'https://gitee.com/QianNQQ/gi-plugin',
      isV3: true,
      isV2: false,
      description: `漂流瓶、每日打卡等群友之间互动的娱乐功能`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(__dirname, 'resources/logo.png')
    },
    configInfo: {
      schemas: [
        {
          field: 'autoupdate',
          label: '自动更新',
          helpMessage: '启用时每天1:20自动更新',
          bottomHelpMessage: '是否自动更新',
          component: 'Switch',
        },
      ],
      getConfigData() {
        let { config } = getconfig(`config`, `config`)
        return config;
      },
      setConfigData(data, { Result }) {
        // 1.读取现有配置文件
        const configFilePath = path.join(__dirname, 'config', 'config.yaml');
        let config = {};
        if (fs.existsSync(configFilePath)) {
          const configContent = fs.readFileSync(configFilePath, 'utf8');
          config = yaml.parse(configContent) || {};
        }
        // 2. 更新配置对象
        for (const [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value);
        }
        // 3. 将更新后的配置对象写回文件
        const updatedConfigYAML = yaml.stringify(config);
        fs.writeFileSync(configFilePath, updatedConfigYAML, 'utf8');
        return Result.ok({}, '保存成功~');
      }
    }
  }
}
