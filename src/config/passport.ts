import 'dotenv/config';

const protocol = process.env.ENABLE_SSL ? 'https' : 'http';

const config = {
  logo: process.env.LOGO,
  name: process.env.SITE_NAME as string,
  link: `${protocol}://${process.env.DOMAIN}`,
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
};

export default config;
