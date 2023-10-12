import { Op } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

import config from '@/config/general';

class AttemptService {
  /** 创建一次登录请求记录 */
  async create(userId: string, success: boolean, type: string) {
    return await sequelize.models.Attempt.create({
      type,
      userId,
      success,
    });
  }

  /** 获取登录请求记录信息 */
  async getAttempt(userId: string, success: boolean, type: string) {
    return await sequelize.models.Attempt.count({
      where: {
        type,
        userId,
        success,
        available: 1,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - config.attempt.frozenTime),
        },
      },
    });
  }

  /** 清空用户所有的登录失败记录 */
  async clearAttempts(userId: string) {
    return await sequelize.models.Attempt.update({
      available: 0,
    }, {
      where: {
        userId,
        available: 1,
      },
    });
  }
}

export default new AttemptService();
