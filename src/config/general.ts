import 'dotenv/config';

const config = {
  host: process.env.HOST,
  port: Number(process.env.SERVE_PORT),
  devPort: Number(process.env.DEV_PORT),
};

export default config;
