import { Logger } from 'futo-utils';
import path from 'path';
import { Sequelize } from 'sequelize';

import 'dotenv/config';

export default new Sequelize({
  host: 'localhost',
  username: 'root',
  password: 'root',
  storage: path.join(process.cwd(), 'paradise.sqlite'),
  dialect: 'sqlite',
  logging: (msg) => {
    if (process.env.NODE_ENV !== 'test') {
      Logger.info(msg);
    }
  },
});
