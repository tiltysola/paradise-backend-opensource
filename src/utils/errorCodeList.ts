export default {
  PAGE_NOT_FOUND: '页面不存在',
  METHOD_NOT_FOUND: '接口不存在',
  RATE_LIMIT_ERROR: '操作频繁',
  // Passport
  ACCESS_DENIED: '请求被拒绝',
  CODE_SEND_FAILED: '验证码发送失败',
  CODE_LIMIT_ERROR: '发送频率受限',
  CODE_VALIDATE_ERROR: '验证码有误',
  CONFIG_EXIST: '配置项已存在',
  EMAIL_EXIST: '邮箱地址已存在',
  USER_ATTEMPT_LIMIT_ERROR: '账户被临时封禁',
  USER_BANNED: '账户被封禁',
  USER_NOT_FOUND: '账户不存在',
  USER_NOT_LOGIN: '用户未登录',
  USER_PASSWORD_ERROR: '密码错误',
  USERNAME_EXIST: '用户名已存在',
  // Paradise
  ACCESS_TOKEN_NOT_FOUND: 'AccessToken不匹配',
  CHARACTER_COUNT_LIMIT_ERROR: '角色数量达到上限',
  CHARACTER_NOT_BELONG_TO_YOU: '当前角色不属于你',
  CHARACTER_NOT_EXIST: '角色不存在',
  CLIENT_TOKEN_NOT_MATCH: '客户端Token不匹配',
  FILE_TYPE_ERROR: '文件类型错误',
  NICKNAME_EXIST: '角色名已存在',
  TEXTURE_COUNT_LIMIT_ERROR: '材质数量达到上限',
  TEXTURE_NOT_BELONG_TO_YOU: '当前材质不属于你',
  TEXTURE_NOT_EXIST: '材质不存在',
  TEXTURE_TYPE_ERROR: '材质类型错误',
};

export const extraCodePassport = {
  EXTRA_FIELD_ACCESSTOKEN: '凭据异常',
  EXTRA_FIELD_AVATAR: '头像必须为JPG或PNG格式',
  EXTRA_FIELD_CODE: '验证码有误',
  EXTRA_FIELD_EMAIL: '邮箱有误',
  EXTRA_FIELD_PASSWORD: '密码为8-16位，需包含大小写数字特殊符号',
  EXTRA_FIELD_USERID: '用户ID有误',
  EXTRA_FIELD_USERNAME: '用户名为2-8位中文字符或4-16位英文字符',
  EXTRA_PAGE_SIZE: '页码信息有误',
};

export const extraCodeParadise = {
  EXTRA_FIELD_ACCESSTOKEN: '凭据异常',
  EXTRA_FIELD_CAPE: '披风信息有误',
  EXTRA_FIELD_CHARID: '角色ID有误',
  EXTRA_FIELD_FILE: '文件信息有误',
  EXTRA_FIELD_NICKNAME: '角色名有误',
  EXTRA_FIELD_OPERATOR: '管理员信息有误',
  EXTRA_FIELD_PASSWORD: '用户名或密码有误',
  EXTRA_FIELD_SKIN: '皮肤信息有误',
  EXTRA_FIELD_SKINTYPE: '皮肤类型有误',
  EXTRA_FIELD_SHARE: '分享信息有误',
  EXTRA_FIELD_TEXTID: '材质ID有误',
  EXTRA_FIELD_TYPE: '材质类型有误',
  EXTRA_FIELD_USERID: '用户ID有误',
  EXTRA_FIELD_USERNAME: '用户名或密码有误',
  EXTRA_PAGE_SIZE: '页码信息有误',
};