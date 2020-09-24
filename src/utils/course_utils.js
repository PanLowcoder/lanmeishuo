/**
 * 获取视频时长
 * @param second
 * @returns {string}
 */
export function getVideoTime(second) {
  let minute = parseInt(second / 60);
  if (minute < 10) {
    minute = '0' + minute;
  }
  return minute + ':' + second % 60;
}
