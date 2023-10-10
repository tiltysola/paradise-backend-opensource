import { filterUndefined, isAllUndefinedObj } from 'futo-utils';

import sequelize from '@/dbhelper/paradise';

interface CharacterProps {
  uuid: string;
  userId: string;
  nickname: string;
  skin?: string;
  skinType?: number;
  cape?: string;
  operator?: string;
  available?: boolean;
}

interface CharacterPropsModify {
  userId?: string;
  nickname?: string;
  skin?: string | null;
  skinType?: number;
  cape?: string | null;
  operator?: boolean;
  available?: boolean;
}

interface CharacterPropsPK {
  uuid?: string;
  nickname?: string;
}

interface CharacterConfig {
  all?: boolean;
}

interface CharacterPageProps {
  page?: number;
  pageSize?: number;
}

class CharacterService {
  /** 创建角色 */
  async create(props: CharacterProps) {
    const character = await sequelize.models.Character.create({
      ...props,
    });
    return character;
  }

  /** 修改角色信息（不包括不可用角色） */
  async modify(charProp: CharacterPropsPK, props: CharacterPropsModify) {
    if (!isAllUndefinedObj(charProp) && !isAllUndefinedObj(props)) {
      return await sequelize.models.Character.update(filterUndefined({
        ...props,
      }), {
        where: {
          ...filterUndefined(charProp),
          available: 1,
        },
      });
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 获取角色信息（默认不包括不可用角色） */
  async getCharacter(charProp: CharacterPropsPK, config?: CharacterConfig) {
    if (!isAllUndefinedObj(charProp)) {
      const character = await sequelize.models.Character.findOne({
        where: {
          ...filterUndefined(charProp),
          ...(config?.all === true ? {} : { available: 1 }),
        },
      });
      return character;
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 获取全部角色信息（不包括不可用角色） */
  async getAllList(props?: CharacterPageProps) {
    const { page, pageSize } = props || {};
    const filter: any = { where: { available: 1 }, order: [['createdAt', 'ASC']] };
    if (page && page > 0 && pageSize && pageSize > 0) {
      filter.offset = page * pageSize - pageSize;
    }
    if (pageSize && pageSize > 0) {
      filter.limit = pageSize;
    }
    const characters = await sequelize.models.Character.findAll(filter);
    return characters;
  }

  /** 通过用户ID获取角色信息（不包括不可用角色） */
  async getUserList(userId: string, props?: CharacterPageProps) {
    const { page, pageSize } = props || {};
    const filter: any = { where: { userId, available: 1 }, order: [['createdAt', 'ASC']] };
    if (page && page > 0 && pageSize && pageSize > 0) {
      filter.offset = page * pageSize - pageSize;
    }
    if (pageSize && pageSize > 0) {
      filter.limit = pageSize;
    }
    const characters = await sequelize.models.Character.findAll(filter);
    return characters;
  }

  /** 通过用户ID查询用户角色数 */
  async getUserListCount(userId: string) {
    return await sequelize.models.Character.count({
      where: {
        userId,
        available: 1,
      },
    });
  }

  /** 判断角色是否存在（包括不可用角色） */
  async exist(charProp: CharacterPropsPK) {
    if (!isAllUndefinedObj(charProp)) {
      const character = await this.getCharacter(charProp, { all: true });
      return !!character;
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 通过ID删除角色 */
  async invalid(uuid: string) {
    return await sequelize.models.Character.update({
      available: 0,
    }, {
      where: {
        uuid,
      },
    });
  }
}

export default new CharacterService();
