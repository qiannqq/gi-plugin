import yaml from 'js-yaml';
import fs from 'fs'

function getconfig(file, name){
        const _path = process.cwd().replace(/\\/g, '/')
        let cfgyaml = `${_path}/plugins/Gi-plugin/${file}/${name}.yaml`
        const configData = fs.readFileSync(cfgyaml, 'utf8');
        let config = yaml.load(configData);
        return { config };
    }
  
  export default getconfig;