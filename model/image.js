import puppeteer from "../../../lib/puppeteer/puppeteer.js"
/**
 * 浏览器截图
 * @param {*} e E
 * @param {*} file html模板名称
 * @param {*} name 
 * @param {object} obj 渲染变量，类型为对象
 * @returns 
 */
async function image(e, file, name, obj) {
  let data = {
    quality: 100,
    tplFile: `./plugins/Gi-plugin/resources/html/${file}.html`,
    ...obj
  }
  let img = await puppeteer.screenshot(name, {
    ...data
  })

  return {
    img
  };
}

export default image;