import cluster from 'cluster';
import { errorHandlerMiddleware, Logger, logMiddleware, uploadMiddleware, utilMiddleware } from 'futo-utils';
import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import os from 'os';
import path from 'path';

import yggdrasilMiddleware from '@/middleware/paradise/yggdrasil';
import authMiddleware from '@/middleware/passport/auth';

import router from '@/router';
import loadModel from '@/scripts/loadModel';
import errorCodeList from '@/utils/errorCodeList';

import config from '@/config/general';

import 'dotenv/config';

const numCpus = process.env.NODE_ENV === 'development' ? 1 : Math.min(os.cpus().length, 8);

loadModel(path.join(__dirname, './model'));

const initialServer = async (master: boolean) => {
  // Server
  const app = new Koa();
  app.proxy = true;
  app.use(yggdrasilMiddleware);

  // StaticServer
  const koaStaticServer = koaStatic(path.join(process.cwd(), './public'), {});

  // Middleware
  app.use(utilMiddleware({ errorCodeList }));
  app.use(errorHandlerMiddleware);
  app.use(logMiddleware);
  app.use(bodyParser());
  app.use(koaStaticServer);
  app.use(uploadMiddleware({
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
  }));
  app.use(authMiddleware);
  app.use(router.routes());

  // Port
  if (process.env.NODE_ENV !== 'test') {
    if (!master) {
      const httpHost = config.host;
      let httpPort = config.port;
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        httpPort = config.devPort;
      }
      http.createServer(app.callback()).listen(httpPort, httpHost, () => {
        Logger.impt(`Http listening on: ${httpHost}:${httpPort}`);
      });
    }
  }
};

if (cluster.isPrimary) {
  initialServer(true);
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    Logger.critical('[Cluster]', `Worker ${worker.process.pid} died.`);
    cluster.fork();
  });
} else {
  initialServer(false);
}
