import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class Session extends Model {}

Session.init(
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
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
    modelName: 'Session',
  },
);

if (process.env.NODE_ENV === 'development') {
  Session.sync({ alter: true }).catch(() => {
    Session.sync({ force: true });
  });
} else {
  Session.sync({ alter: true });
}
