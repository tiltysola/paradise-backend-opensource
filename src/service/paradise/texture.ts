import crypto from 'crypto';
import fs from 'fs';
import { filterUndefined, isAllUndefinedObj, Logger } from 'futo-utils';
import sharp from 'sharp';

import sequelize from '@/dbhelper/paradise';

interface TextureProps {
  uuid: string;
  userId: string;
  hash: string;
  type: number;
}

interface TexturePropsPK {
  uuid?: string;
  hash?: string;
}

interface TextureConfig {
  all?: boolean;
}

interface TexturePageProps {
  type: number;
  page?: number;
  pageSize?: number;
}

class TextureService {
  /** 创建材质 */
  async create(props: TextureProps) {
    const texture = await sequelize.models.Texture.create({
      ...props,
    });
    return texture;
  }

  /** 获取材质信息（默认不包括不可用材质） */
  async getTexture(textProp: TexturePropsPK, config?: TextureConfig) {
    if (!isAllUndefinedObj(textProp)) {
      const texture = await sequelize.models.Texture.findOne({
        where: {
          ...filterUndefined(textProp),
          ...(config?.all === true ? {} : { available: 1 }),
        },
      });
      return texture;
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 获取全部材质信息（不包括不可用材质） */
  async getAllList(props?: TexturePageProps) {
    const { type, page, pageSize } = props || {};
    const filter: any = { where: { type, available: 1 }, order: [['createdAt', 'ASC']] };
    if (page && page > 0 && pageSize && pageSize > 0) {
      filter.offset = page * pageSize - pageSize;
    }
    if (pageSize && pageSize > 0) {
      filter.limit = pageSize;
    }
    const textures = await sequelize.models.Texture.findAll(filter);
    return textures;
  }

  /** 通过用户ID获取材质列表（不包括不可用材质） */
  async getUserList(userId: string, type: number) {
    const textures = await sequelize.models.Texture.findAll({
      where: {
        userId,
        type,
        available: 1,
      },
    });
    return textures;
  }

  /** 通过用户ID查询用户材质数 */
  async getUserListCount(userId: string, type: number) {
    return await sequelize.models.Texture.count({
      where: {
        userId,
        type,
        available: 1,
      },
    });
  }

  /** 通过分享信息获取材质列表（不包括不可用材质） */
  async getShareList(type: number) {
    const textures = await sequelize.models.Texture.findAll({
      where: {
        type,
        share: 1,
        available: 1,
      },
    });
    return textures;
  }

  /** 通过ID设置分享信息 */
  async shareById(uuid: string, share: boolean) {
    await sequelize.models.Texture.update({
      share,
    }, {
      where: {
        uuid,
      },
    });
  }

  /** 通过ID判断材质是否存在（包括不可用材质） */
  async exist(textProp: TexturePropsPK) {
    if (!isAllUndefinedObj(textProp)) {
      const texture = await this.getTexture(textProp);
      return !!texture;
    } else {
      throw new Error('FIELD_VALIDATE_ERROR');
    }
  }

  /** 通过ID删除材质 */
  async invalid(uuid: string) {
    await sequelize.models.Texture.update({
      available: 0,
    }, {
      where: {
        uuid,
      },
    });
  }

  /** 计算图像HASH值 */
  async computeTextureHash(imagePath: string) {
    const image = sharp(fs.readFileSync(imagePath));
    const metadata = await image.metadata();
    const buffer = await image.png().toBuffer();
    const bufSize = 8192;
    const hash = crypto.createHash('sha256');
    const buf = Buffer.allocUnsafe(bufSize);
    const { width = 0, height = 0 } = metadata;
    buf.writeUInt32BE(width, 0);
    buf.writeUInt32BE(height, 4);
    let pos = 8;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        // eslint-disable-next-line
        const imgidx = (width * y + x) << 2;
        const alpha = buffer[imgidx + 3];
        buf.writeUInt8(alpha, pos + 0);
        if (alpha === 0) {
          buf.writeUInt8(0, pos + 1);
          buf.writeUInt8(0, pos + 2);
          buf.writeUInt8(0, pos + 3);
        } else {
          buf.writeUInt8(buffer[imgidx + 0], pos + 1);
          buf.writeUInt8(buffer[imgidx + 1], pos + 2);
          buf.writeUInt8(buffer[imgidx + 2], pos + 3);
        }
        pos += 4;
        if (pos === bufSize) {
          pos = 0;
          hash.update(buf);
        }
      }
    }
    if (pos > 0) {
      hash.update(buf.slice(0, pos));
    }
    return hash.digest('hex');
  }

  async checkImageSize(imagePath: string, type: number) {
    try {
      const image = sharp(fs.readFileSync(imagePath));
      const metadata = await image.metadata();
      const { width = 0, height = 0 } = metadata;
      if (Number(type) === 0) {
        return !!(
          width % 32 === 0 &&
          height % 32 === 0 &&
          (width / height === 1 || width / height === 2)
        );
      } else {
        return !!(
          width % 32 === 0 &&
          height % 32 === 0 &&
          width / height === 2
        );
      }
    } catch (err) {
      Logger.critical('[TTS]', err);
      return false;
    }
  }
}

export default new TextureService();
