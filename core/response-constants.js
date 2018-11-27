
const ERROR = 'ERROR';
const ANIME_NOT_FOUND = 'Anime not found';
const USER_ALREADY_EXISTS = 'User already exists';
const USER_NOT_FOUND = 'User not found';
const INCORRECT_PASSWORD = 'Incorrect password';
const EPISODE_NOT_FOUND = 'Episode not found';
const UNAUTHORIZED_USER = 'Unauthorized user';
const COMMENT_NOT_EMPTY = 'Comment can\'t be empty';
const BAD_SCORE_FOR_EVALUATION = 'Undefined score or score out of range [1,5]';
const PAGE_NOT_NUMBER = 'Page is not a number';
const PAGE_SIZE_NOT_NUMBER = 'Page size is not a number';
const PAGE_SIZE_BAD_RANGE = 'Page size is out of the range [1,30]';
const INVALID_SORT_OPTIONS = (option, type, validFields) => `${option} is not a valid option for ${type}. ${validFields.join(', ')} is/are available.`;
const DIFF_PASSWORD_CONFIRM = 'Password and confirmation password differs';

module.exports = {
  ANIME_NOT_FOUND,
  ERROR,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  INCORRECT_PASSWORD,
  EPISODE_NOT_FOUND,
  UNAUTHORIZED_USER,
  COMMENT_NOT_EMPTY,
  BAD_SCORE_FOR_EVALUATION,
  PAGE_NOT_NUMBER,
  PAGE_SIZE_BAD_RANGE,
  PAGE_SIZE_NOT_NUMBER,
  INVALID_SORT_OPTIONS,
  DIFF_PASSWORD_CONFIRM,
};
