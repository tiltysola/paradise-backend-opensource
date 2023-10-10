import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class Texture extends Model {}

Texture.init({
  uuid: {
    type: DataTypes.STRING,
    unique: 'uuid',
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * 0: skin
   * 1: cape
   */
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  /**
   * SHARE
   */
  share: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: true,
  },
  /**
   * AVAILABLE
   */
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  sequelize,
  modelName: 'Texture',
});

if (process.env.NODE_ENV === 'development') {
  Texture.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' }).catch(() => {
    Texture.sync({ force: true });
  });
} else {
  Texture.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' });
}
