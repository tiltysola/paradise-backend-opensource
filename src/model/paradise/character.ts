import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class Character extends Model {}

Character.init({
  uuid: {
    type: DataTypes.STRING,
    unique: 'uuid',
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'nickname',
  },
  skin: {
    type: DataTypes.STRING,
  },
  /**
   * 0: default
   * 1: slim
   */
  skinType: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  cape: {
    type: DataTypes.STRING,
  },
  /**
   * OPERATOR
   */
  operator: {
    type: DataTypes.BOOLEAN,
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
  modelName: 'Character',
});

if (process.env.NODE_ENV === 'development') {
  Character.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' }).catch(() => {
    Character.sync({ force: true });
  });
} else {
  Character.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' });
}
