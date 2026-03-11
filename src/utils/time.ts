import dayjs from "dayjs";

export function formatTime(time: string | number | Date, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).format(format);
}
