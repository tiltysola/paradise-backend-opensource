import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class Yggdrasil extends Model {}

Yggdrasil.init({
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
  },
  accessToken: {
    type: DataTypes.STRING,
  },
  clientToken: {
    type: DataTypes.STRING,
  },
  selectedProfile: {
    type: DataTypes.STRING,
  },
  serverId: {
    type: DataTypes.STRING,
  },
  ip: {
    type: DataTypes.STRING,
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
  modelName: 'Yggdrasil',
});

if (process.env.NODE_ENV === 'development') {
  Yggdrasil.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' }).catch(() => {
    Yggdrasil.sync({ force: true });
  });
} else {
  Yggdrasil.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' });
}
