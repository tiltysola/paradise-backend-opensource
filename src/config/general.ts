import 'dotenv/config';

const protocol = process.env.ENABLE_SSL === 'true' ? 'https' : 'http';

const config = {
  host: process.env.HOST,
  port: Number(process.env.SERVE_PORT),
  devPort: Number(process.env.DEV_PORT),

  gate: `${protocol}://${process.env.DOMAIN}`,

  logo: process.env.LOGO,
  siteName: process.env.SITE_NAME as string,
  icpCode: process.env.ICP_CODE,

  attempt: {
    /** 同一时段最大尝试登录次数 */
    maxTimes: 3,
    /** 同一时段间隔时长 */
    frozenTime: 60 * 60 * 1000,
  },
  verify: {
    /** 同一个验证码的最大尝试次数 */
    maxTimes: 3,
  },
  request: {
    /** 同一时段最大请求数量 */
    limit: 600,
    /** 同一时段间隔时长 */
    interval: 60 * 1000,
  },
  /** 验证码请求间隔 */
  acquire: {
    interval: 60 * 1000,
  },
  /** Token合法时间 */
  sessionValidTime: 7 * 24 * 60 * 60 * 1000,

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
