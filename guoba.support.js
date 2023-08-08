import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export function supportGuoba() {
  return {
    pluginInfo: {
      name: `Gi-plugin`,
      title: '互动插件(Gi-plugin)',
      author: '@千奈千祁',
      authorLink: 'https://gitee.com/QianNQQ',
      link: 'https://gitee.com/QianNQQ/Gi-plugin',
      isV3: true,
      isV2: false,
      description: `漂流瓶、每日打卡等群友之间互动的娱乐功能`,
      icon: 'mdi:stove',
      iconColor: '#d19f56',
      iconPath: path.join(__dirname, 'resources/logo.png')
    }
  }
}
