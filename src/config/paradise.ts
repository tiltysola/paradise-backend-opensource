import 'dotenv/config';

const protocol = process.env.ENABLE_SSL === 'true' ? 'https' : 'http';

const config = {
  serverName: process.env.PARADISE_SITE_NAME || 'paradise',
  host: `${protocol}://${process.env.DOMAIN}/api`,
  links: {
    homepage: `${protocol}://${process.env.DOMAIN}`,
    register: `${protocol}://${process.env.DOMAIN}/register`,
  },
  skinDomains: process.env.DOMAIN?.split(',') || [],
  character: {
    /** 用户注册的时候许可的最大角色数 */
    maxCharacters: 3,
  },
  texture: {
    /** 用户注册的时候许可的最大材质数 */
    maxSkins: 3,
    maxCapes: 3,
    /** 用户许可的材质上传大小 (b) */
    maxFileSize: 1 * 1024 * 1024,
  },
};

export default config;
