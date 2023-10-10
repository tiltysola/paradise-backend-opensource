import NodeRSA from 'node-rsa';

import { RSAPrivate, RSAPublic } from '@/config/cert';

export const getPublicKey = () => {
  const key = new NodeRSA(RSAPublic);
  return key.exportKey('public');
};

export const sign = (pass: string) => {
  const key = new NodeRSA(RSAPrivate);
  key.setOptions({
    signingScheme: 'pkcs1-sha1',
  });
  return key.sign(pass, 'base64');
};

export default {
  getPublicKey,
  sign,
};
