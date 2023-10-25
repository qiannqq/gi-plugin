import fs from 'fs';
function shanchu(filePath, plp2) {
  console.log(`已废弃。`)
    /**fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const escapedPlp2 = plp2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPlp2 + '\\s*\\r?\\n?', 'g');
        const updatedData = data.replace(regex, '');
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
          if (err) {
            logger.error(err);
            e.reply(`发生错误` + err)
            return;
          }
        });
      });**/
}

export default shanchu