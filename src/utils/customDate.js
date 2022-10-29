export const customDate = (date) => {
  return (new Date(date)).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "numeric" })
}