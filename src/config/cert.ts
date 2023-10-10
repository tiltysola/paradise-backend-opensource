import fs from 'fs';
import NodeRSA from 'node-rsa';
import path from 'path';

const certPath = path.join(process.cwd(), './cert');
if (!fs.existsSync(certPath)) {
  fs.mkdirSync(certPath);
  const key = new NodeRSA();
  const keyPair = key.generateKeyPair(4096);
  fs.writeFileSync(path.join(certPath, 'rsa.pub'), keyPair.exportKey('public'));
  fs.writeFileSync(path.join(certPath, 'rsa'), keyPair.exportKey('private'));
}

export const RSAPublic = fs.readFileSync(path.join(certPath, 'rsa.pub'));

export const RSAPrivate = fs.readFileSync(path.join(certPath, 'rsa'))
