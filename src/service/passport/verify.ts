import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

import mailConfig from '@/config/mail';
import config from '@/config/passport';

const mailTransporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: mailConfig.auth,
});

const mailGenerator = new Mailgen({
  theme: 'cerberus',
  product: {
    logo: config.logo,
    logoHeight: '64px',
    name: config.name,
    link: config.link,
  },
});

class VerifyService {
  /** 创建Mail信息 */
  async createMail(email: string, code: string, ip: string) {
    return await sequelize.models.Verify.create({
      type: 'MAIL',
      key: email,
      code,
      ip,
    });
  }

  /** 通过邮箱获取最近的CODE（指定时间内） */
  async latestMail(email: string) {
    const mail = await sequelize.models.Verify.findOne({
      where: {
        type: 'MAIL',
        key: email,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - mailConfig.codeValidPeriod),
        },
      },
    });
    if (mail) {
      const retries = mail.getDataValue('retries');
      if (retries >= config.verify.maxTimes) {
        throw new Error('CODE_ATTEMPT_LIMIT_ERROR');
      }
    }
    return mail;
  }

  /** 校验IP发送次数（指定时间内） */
  async ipMail(email: string, ip: string) {
    const mailList = new Set();
    const mail = await sequelize.models.Verify.findAll({
      where: {
        type: 'MAIL',
        ip,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - mailConfig.ipLimit.period),
        },
      },
    });
    mail.forEach((v) => {
      const m = v.getDataValue('key');
      mailList.add(m);
    });
    return mailList.has(email) || mailList.size < mailConfig.ipLimit.max;
  }

  /** 验证邮箱和CODE是否匹配（指定时间内） */
  async verifyMail(email: string, code: string) {
    const where = {
      type: 'MAIL',
      key: email,
      createdAt: {
        [Op.gt]: new Date(new Date().getTime() - mailConfig.codeValidPeriod),
      },
      // retries: {
      //   [Op.lt]: config.verify.maxTimes,
      // },
    };
    const mail = await sequelize.models.Verify.findOne({
      where,
    });
    if (mail) {
      const retries = mail.getDataValue('retries');
      if (retries < config.verify.maxTimes) {
        await sequelize.models.Verify.update({
          retries: mail.getDataValue('retries') as number + 1,
        }, {
          where,
        });
      } else {
        throw new Error('CODE_ATTEMPT_LIMIT_ERROR');
      }
    }
    return mail?.getDataValue('code') === code;
  }

  /** 向指定邮箱发送Mail信息 */
  async sendMail(email: string, code: string) {
    return await mailTransporter.sendMail({
      from: `"${config.name}" <${mailConfig.auth.user}>`,
      to: email,
      subject: `[${config.name}] 账户验证邮件`,
      html: mailGenerator.generate({
        body: {
          name: '阁下您好',
          title: '您的验证码为',
          intro: code,
          outro: '为了您的账户安全，请妥善保管您的验证码，请勿提供给他人。',
          signature: false,
        },
      }),
      text: mailGenerator.generatePlaintext({
        body: {
          name: '阁下您好',
          title: '您的验证码为',
          intro: code,
          outro: '为了您的账户安全，请妥善保管您的验证码，请勿提供给他人。',
          signature: false,
        },
      }),
    });
  }
}

export default new VerifyService();
