import puppeteer from "../../../lib/puppeteer/puppeteer.js"

function image(e, file, name, obj) {
    let data = {
      quality: 100,
      tplFile: `./plugins/Gi-plugin/resources/html/${file}.html`,
      ...obj
    }
    let img = puppeteer.screenshot(name, {
      ...data
    })
  
    return {
      img
    };
  }
  
  export default image;