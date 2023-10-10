import { crypt, filterUndefined, isAllUndefinedObj, validate } from 'futo-utils';

import sequelize from '@/dbhelper/paradise';

interface UserProps {
  uuid: string;
  username: string;
  password: string;
  avatar?: string;
  email: string;
  permissions?: string;
  emailStatus?: boolean;
  registerEmail: string;
  banned?: boolean;
  banReason?: string;
  available?: boolean;
}

interface UserPropsModify {
  username?: string;
  password?: string;
  avatar?: string;
  email?: string;
  permissions?: string;
  emailStatus?: boolean;
  registerEmail?: string;
  banned?: boolean;
  banReason?: string;
  available?: boolean;
}

interface UserPropsPK {
  uuid?: string;
  username?: string;
  email?: string;
}

interface UserConfig {
  all?: boolean;
}

interface UserPageProps {
  page?: number;
  pageSize?: number;
}

class UserService {
  /** 创建用户 */
  async create(props: UserProps) {
    return await sequelize.models.User.create({
      ...props,
      password: await crypt(props.password),
    });
  }

  /** 修改用户信息（不包括不可用账户） */
  async modify(userProp: UserPropsPK, props: UserPropsModify) {
    if (!isAllUndefinedObj(userProp) && !isAllUndefinedObj(props)) {
      return await sequelize.models.User.update(filterUndefined({
        ...props,
        password: props.password && (await crypt(props.password)),
      }), {
        where: {
          ...filterUndefined(userProp),
          available: 1,
        },
      });
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 获取用户信息（默认不包括不可用账户） */
  async getUser(userProp: UserPropsPK, config?: UserConfig) {
    if (!isAllUndefinedObj(userProp)) {
      const user = await sequelize.models.User.findOne({
        where: {
          ...filterUndefined(userProp),
          ...(config?.all === true ? {} : { available: 1 }),
        },
      });
      return user;
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 获取全部用户信息（不包括不可用账户） */
  async getAllList(props?: UserPageProps) {
    const { page, pageSize } = props || {};
    const filter: any = { where: { available: 1 }, order: [['createdAt', 'ASC']] };
    if (page && page > 0 && pageSize && pageSize > 0) {
      filter.offset = page * pageSize - pageSize;
    }
    if (pageSize && pageSize > 0) {
      filter.limit = pageSize;
    }
    const users = await sequelize.models.User.findAll(filter);
    return users;
  }

  /** 获取全部用户数量（不包括不可用账户） */
  async getAllListCount() {
    return await sequelize.models.User.count({
      where: {
        available: 1,
      },
    });
  }

  /** 判断用户是否存在（包括不可用账户） */
  async exist(userProp: UserPropsPK) {
    if (!isAllUndefinedObj(userProp)) {
      const user = await this.getUser(userProp, { all: true });
      return !!user;
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 验证用户ID与密码（不包括不可用账户） */
  async validate(userProp: UserPropsPK, password: string) {
    if (!isAllUndefinedObj(userProp)) {
      const user = await this.getUser(filterUndefined(userProp));
      if (!!user && (await validate(password, user.getDataValue('password')))) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }
}

export default new UserService();
