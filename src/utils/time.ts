import dayjs from "dayjs";
// 格式化时间
export function formatTime(time: string | number | Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).format(format);
}

// 秒设置为0
export function formatTimeNoSecond(time: string | number | Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).second(0).format(format);
}
