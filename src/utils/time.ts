import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Shanghai");

// 格式化时间
export function formatTime(time: string | number | Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).tz().format(format);
}

// 秒设置为0
export function formatTimeNoSecond(time: string | number | Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).second(0).format(format);
}
