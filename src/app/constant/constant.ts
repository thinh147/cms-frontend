const PREFIX = 'cms_';
export const STORAGE_KEY = {
  ACCESS_TOKEN: PREFIX + 'jwt_access_token',
  USER_INFO: PREFIX + 'user_info',
  SOLD_OUT_RECORD: PREFIX + 'sold_out',
  LANGUAGE: PREFIX + 'lang',
  USER_DATA: PREFIX + 'user_data',
  CALLWINDOW: 'call_window',
  CURRENT_TIP_ID: 'current_tip_id',
  SIDE_BAR_STYLE: 'side_bar_style'
};
export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  VALIDATE_ERROR: 400,
  ACCESS_DENIED: 401,
  SC_FORBIDDEN: 403,
  ERROR_NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NOT_ACTIVATED: 600,
  INVALID_PASSWORD: 800,
  EMAIL_NOTFOUND: 402,
  NOT_ENOUGH_BAMBOO: 1001,
  NOT_ENOUGH_LEAF: 1002,
  BOOSTED_IN_DAY: 1003,
  FR_INVITE_CODE_INVALID: 1004,
  ERROR_EXISTED: 409,
  ERROR_EXPIRED: 410,
  USER_BLOCKED: 1005,
  EXISTING_NAME: 1101,
  EXIST_OFFER_TIME: 1201,
  SOCIALNETWORK_NOT_REGISTER_YET: 1300
};
export const INCOME_TYPE_CODE = {
  INCOME: 'INCOME',
  EXPENDITURE: 'EXPENDITURE'
}
export const INCOME_TYPE = [
  { id: '0', name: 'Income' },
  { id: '1', name: 'Expenditure' }
]
export enum ROLE {
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  QA = "QA"
}
export enum LikeStatus {
  INACTIVE = 1,
  LIKE = 2,
  DISLIKE = 3
}

export const PAGE_SIZE = 5;
export const DEFAULT_SIZE_IMAGE = 5000000;
export const DEFAULT_SIZE_VIDEO = 20000000;