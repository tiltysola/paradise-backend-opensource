import { Op } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

import config from '@/config/passport';

class SessionService {
  /** 创建会话 */
  async create(userId: string, token: string) {
    return await sequelize.models.Session.create({
      userId,
      token,
    });
  }

  /** 刷新会话 */
  async refresh(token: string) {
    return await sequelize.models.Session.update({
      token,
    }, {
      where: {
        token,
      },
    });
  }

  /** 无效会话 */
  async invalid(token: string) {
    await sequelize.models.Session.update({
      available: 0,
    }, {
      where: {
        token,
      },
    });
  }

  /** 获取用户ID */
  async getUser(token: string) {
    const session = await sequelize.models.Session.findOne({
      where: {
        token,
        available: 1,
        updatedAt: {
          [Op.gt]: new Date(new Date().getTime() - config.sessionValidTime),
        },
      },
    });
    return session?.getDataValue('userId');
  }
}

export default new SessionService();
