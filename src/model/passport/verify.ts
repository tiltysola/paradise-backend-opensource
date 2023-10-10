import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class Verify extends Model {}

Verify.init(
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    /**
     * RETRIES
     */
    retries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Verify',
  },
);

if (process.env.NODE_ENV === 'development') {
  Verify.sync({ alter: true }).catch(() => {
    Verify.sync({ force: true });
  });
} else {
  Verify.sync({ alter: true });
}
