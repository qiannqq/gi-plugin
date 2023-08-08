import fs from 'fs';

function duquFile(filePath, callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const lines = data.split('-');
    const Piaoliu = [];

    lines.forEach((line) => {
        line = line.slice(0, -1);
        const parts = line.split('；');
        const plp = parts[0];
        const userid = parts[1];
        Piaoliu.push(`-${plp}；${userid}`);
    });

    callback(Piaoliu);
  });
}

export default duquFile