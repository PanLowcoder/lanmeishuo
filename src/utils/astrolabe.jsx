/**
 * 类型：0：星盘；1：合盘；2:占卜；
 */
export const CANVAS_VIEW_TYPE = {
  ASTRO: 0,//星盘
  SYNASTRY: 1,//合盘
  DIVINATION: 2,//占卜
};

/**
 * 星盘类型：1：现代；2：古典；3：特殊；
 * @type {{MODERN: number, ANCIENT: number, SPECIAL: number}}
 */
export const ASTRO_TID_TYPES = {
  MODERN: 1,
  ANCIENT: 2,
  SPECIAL: 3,
};

/**
 * 星盘类型
 * @type {{NATAL: number, SOLAR_RETURN: number, PROGRESSIONS: number, NOW: number, SOLAR: number, LUNAR_RETURN: number, THIRDPROGRESSED: number, FIRDARIA: number, TRANSITS: number, PROFECTION: number}}
 */
export const ASTRO_TYPES = {
  NOW: 1,
  NATAL: 2,
  TRANSITS: 3,
  THIRDPROGRESSED: 4,
  PROGRESSIONS: 5,
  SOLAR: 6,
  SOLAR_RETURN: 7,
  LUNAR_RETURN: 8,
  FIRDARIA: 9,
  PROFECTION: 10,
};

/**
 * 星盘-合盘类型
 * @type {{SYNASTRY_1: number, NATAL_2: number, NATAL_1: number, COMPOSITE_THIRDPROGRESSED: number, COMPOSITE_PROGRESSIONS: number, DAVISON: number, SYNASTRY_2: number, MARKS_2: number, MARKS_1: number, COMPOSITE: number}}
 */
export const ASTRO_SYNASTRY_TYPES = {
  SYNASTRY_1: 0,
  SYNASTRY_2: 1,
  SYNASTRY_THIRDPROGRESSED_1: 2,
  SYNASTRY_THIRDPROGRESSED_2: 3,
  SYNASTRY_PROGRESSIONS_1: 4,
  SYNASTRY_PROGRESSIONS_2: 5,
  COMPOSITE: 6,
  COMPOSITE_THIRDPROGRESSED: 7,
  COMPOSITE_PROGRESSIONS: 8,
  DAVISON: 9,
  DAVISON_THIRDPROGRESSED: 10,
  DAVISON_PROGRESSIONS: 11,
  MARKS_1: 12,
  MARKS_2: 13,
  NATAL_1: 14,
  NATAL_2: 15,
};

/**
 * //左下角按钮的类型：-1：不显示；0：显示参数；1：显示单盘；2：显示双盘；
 * @type {{SINGLE: number, PARAMS: number, DOUBLE: number, NONE: number}}
 */
export const BOTTOM_LETF_BTN_TYPE = {
  NONE: -1,
  PARAMS: 0,
  SINGLE: 1,
  DOUBLE: 2,
};