import fs from 'fs';
function shanchu(filePath, plp2) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const regex = new RegExp(plp2 + '\\r?\\n?', 'g');
        const updatedData = data.replace(regex, '');
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                logger.error(err);
                e.reply(`发生错误` + err)
                return;
            }
        });
    });
}

export default shanchu