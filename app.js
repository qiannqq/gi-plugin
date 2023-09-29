import os from "os"
import { exec } from "child_process";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(`首先，这是一个基于\x1b[31m云崽\x1b[0m开发的插件`);
console.log(`其次，请在\x1b[31m云崽\x1b[0m根目录执行node app而不是Gi-plugin`);
const platform = os.platform();
if (platform === 'win32') {
    const imagePath = `${__dirname}\\resources\\img\\cd.jpg`;
    exec(`start ${imagePath}`);
}