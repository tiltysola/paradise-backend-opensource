import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class Attempt extends Model {}

Attempt.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    /**
     * AVAILABLE
     */
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Attempt',
  },
);

if (process.env.NODE_ENV === 'development') {
  Attempt.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' }).catch(() => {
    Attempt.sync({ force: true });
  });
} else {
  Attempt.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' });
}
