# 椛鸟风月 · 开源项目 (后端)

> 这是椛鸟风月我的世界认证服务器的后端源代码

## Configure

编辑 `.env.example` 文件，另存为 `.env`

```
# General Config
HOST="0.0.0.0"
SERVE_PORT="8001"
DEV_PORT="8002"

# Site Config
SITE_NAME="椛鸟风月 · 开源项目"
LOGO="https://cdn.mahoutsukai.cn/assets/tilty/images/tilty_logo.png"
DOMAIN="paradise.opensource.mahoutsukai.cn"
ENABLE_SSL="true"

# Mail Config
SMTP_HOST="smtp.mxhichina.com"
SMTP_USER="tiltysola@example.com"
SMTP_PASS="example"
```

## Contribute

```
npm i --registry=https://registry.npmmirror.com
npm run dev
```

## 许可协议

本软件采用 MIT LISENCE 许可协议。
