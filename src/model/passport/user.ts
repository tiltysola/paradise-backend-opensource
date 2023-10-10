import { DataTypes, Model } from 'sequelize';

import sequelize from '@/dbhelper/paradise';

class User extends Model {}

User.init({
  uuid: {
    type: DataTypes.STRING,
    unique: 'uuid',
  },
  username: {
    type: DataTypes.STRING,
    unique: 'username',
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: 'email',
    allowNull: false,
  },
  /**
   * PERMISSIONS
   */
  permissions: {
    type: DataTypes.STRING,
  },
  /**
   * STATUS
   */
  emailStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  /**
   * ADDITION
   */
  registerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /**
   * BAN
   */
  banned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  banReason: {
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
  modelName: 'User',
});

if (process.env.NODE_ENV === 'development') {
  User.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' }).catch(() => {
    User.sync({ force: true });
  });
} else {
  User.sync({ alter: process.env.SEQUELIZE_TYPE === 'alter' });
}
