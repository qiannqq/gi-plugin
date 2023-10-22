import { promises as fs } from 'fs';

class Gimodel {
  async duquFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const lines = data.split('@');
      const Piaoliu = [];

      lines.forEach((line) => {
        line = line.slice(0, -1);
        const parts = line.split('；');
        const plp = parts[0];
        const userid = parts[1];
        Piaoliu.push(`@${plp}；${userid}`);
      });

      callback(Piaoliu);
    });
  }
  async NewduquFile(filePath) {
    let data = await fs.readFile(filePath, 'utf-8')
    //logger.mark(data)
    const lines = data.split('@');
    const Piaoliu = [];
    lines.forEach((line) => {
      line = line.slice(0, -1);
      const parts = line.split('；');
      const plp = parts[0];
      const userId = parts[1];
      if (userId != undefined) Piaoliu.push(`@${plp}；${userId}`)
    })
    return Piaoliu
  }
}

export default new Gimodel