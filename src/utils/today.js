import dayjs from "dayjs";

export default function currentTime() {
  return dayjs().format("YYYY-MM-DD ");
}

export function filterTime(time) {
  return dayjs(time).format("YYYY-MM-DD");
}
