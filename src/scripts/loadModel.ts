import fs from 'fs';
import path from 'path';

const deepPath = (_path: string, _source?: string): string[] => {
  const _paths: any[] = [];
  if (fs.existsSync(_path)) {
    const models = fs.readdirSync(_path);
    for (const model of models) {
      if (fs.lstatSync(path.join(_path, model)).isDirectory()) {
        _paths.push(...deepPath(path.join(_path, model), _source || _path));
      } else {
        const relativePath = path.join(_path, model).replace(_source || _path, '');
        if (/^.*\.[tj]s$/i.test(relativePath)) {
          const match = relativePath.match(/^(.*)\.[tj]s$/i);
          if (match) {
            _paths.push(match[1]);
          }
        }
      }
    }
  }
  return _paths;
};

export default (_path: string) => {
  const models = deepPath(_path);
  for (const model of models) {
    require(path.join(_path, model));
  }
};
