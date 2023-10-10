import 'dotenv/config';

const config = {
  /** 邮箱发信设置 */
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  /** 邮箱验证码有效期 */
  codeValidPeriod: 5 * 60 * 1000,
  /** IP限制邮箱数量 */
  ipLimit: {
    max: 3,
    period: 24 * 60 * 60 * 1000,
  },
};

export default config;
