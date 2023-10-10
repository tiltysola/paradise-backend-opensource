import { Op } from 'sequelize';

import sequelize from '@/dbhelper/paradise';
import { sign } from '@/utils/validateCertification';

import config from '@/config/paradise';
import passportConfig from '@/config/passport';

import characterService from './character';
import texture from './texture';

interface YggdrasilProps {
  userId: string;
  accessToken: string;
  clientToken: string;
  selectedProfile?: string;
}

interface YggdrasilJoinProps {
  accessToken: string;
  serverId: string;
  selectedProfile: string;
  ip: string;
}

class YggdrasilService {
  /** 创建Yggdrasil对象 */
  async create(props: YggdrasilProps) {
    return await sequelize.models.Yggdrasil.create({
      ...props,
      type: 'TOKEN',
    });
  }

  /** 通过accessToken删除Yggdrasil对象 */
  async invalid(accessToken: string) {
    return await sequelize.models.Yggdrasil.update({
      available: 0,
    }, {
      where: {
        accessToken,
        type: 'TOKEN',
      },
    });
  }

  /** 通过用户ID删除全部Yggdrasil对象 */
  async invalidAll(userId: string) {
    return await sequelize.models.Yggdrasil.update({
      available: 0,
    }, {
      where: {
        userId,
        type: 'TOKEN',
      },
    });
  }

  /** 通过accessToken获取用户ID */
  async getUserId(accessToken: string) {
    const yggdrasil = await sequelize.models.Yggdrasil.findOne({
      where: {
        accessToken,
        type: 'TOKEN',
        available: 1,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - passportConfig.sessionValidTime),
        },
      },
    });
    return yggdrasil?.getDataValue('userId');
  }

  /** 通过accessToken获取clientToken */
  async getClientToken(accessToken: string) {
    const yggdrasil = await sequelize.models.Yggdrasil.findOne({
      where: {
        accessToken,
        type: 'TOKEN',
        available: 1,
        createdAt: {
          [Op.gt]: new Date(new Date().getTime() - passportConfig.sessionValidTime),
        },
      },
    });
    return yggdrasil?.getDataValue('clientToken');
  }

  /** 创建服务器加入请求 */
  async createServerJoin(props: YggdrasilJoinProps) {
    return await sequelize.models.Yggdrasil.create({
      ...props,
      type: 'JOIN',
    });
  }

  /** 通过服务器ID获取服务器加入请求 */
  async getJoinById(serverId: string) {
    return await sequelize.models.Yggdrasil.findOne({
      where: {
        serverId,
        type: 'JOIN',
        available: 1,
      },
    });
  }

  /** 通过用户ID获取YggdrasilUser对象 */
  async getUserObjectById(userId: string) {
    return {
      id: userId,
      properties: [{
        name: 'preferredLanguage',
        value: 'zh_CN',
      }],
    };
  }

  /** 通过角色ID获取YggdrasilCharacter对象 */
  async getProfileObjectById(charId: string, signed = true) {
    const properties: any[] = [];
    const character = await characterService.getCharacter({ uuid: charId });
    const skinId = character?.getDataValue('skin');
    const capeId = character?.getDataValue('cape');
    if (skinId || capeId) {
      const textures: any = {};
      if (skinId) {
        const skin = await texture.getTexture({ uuid: skinId });
        const skinHash = skin?.getDataValue('hash');
        textures.SKIN = {
          url: `${config.host?.replace(/\/+$/g, '') || ''}/yggdrasil/textures/${skinHash}`,
          metadata: {
            model: character?.getDataValue('skinType') === 0 ? 'default' : 'slim',
          },
        };
      }
      if (capeId) {
        const cape = await texture.getTexture({ uuid: capeId });
        const capeHash = cape?.getDataValue('hash');
        textures.CAPE = {
          url: `${config.host?.replace(/\/+$/g, '') || ''}/yggdrasil/textures/${capeHash}`,
        };
      }
      properties.push(this.getSignedProperty({
        name: 'textures',
        value: JSON.stringify({
          timestamp: new Date().getTime(),
          profileId: charId,
          profileName: character?.getDataValue('nickname'),
          textures,
        }),
      }, signed));
    }
    properties.push(this.getSignedProperty({
      name: 'uploadableTextures',
      value: 'skin,cape',
    }, signed));
    return {
      id: charId,
      name: character?.getDataValue('nickname'),
      properties,
    };
  }

  /** 获取签名后的属性 */
  private getSignedProperty(props: {
    name: string;
    value: string;
  }, signed = false) {
    const { name, value } = props;
    const data: any = {
      name,
      value: Buffer.from(value).toString('base64'),
    };
    if (signed) {
      data.signature = sign(Buffer.from(value).toString('base64'));
    }
    return data;
  }
}

export default new YggdrasilService();
