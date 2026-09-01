import vie from "../../translate/vie.json"

const resources = {
  vie
} as const
// Khai báo kiểu cho danh sách key
export type Namespace = keyof typeof resources

// Tự động tạo Type cho Key dựa trên Namespace
export type TranslationKeys<N extends Namespace> = keyof typeof resources[N]

/**
 * Hàm t đọc key linh hoạt từ nhiều file JSON khác nhau
 * @param ns - Tên file / Namespace (vd: 'vie', 'eng')
 * @param key - Key cần lấy chuỗi dịch
 */
export const t = <N extends Namespace>(ns: N, key: TranslationKeys<N>): string => {
  const dictionary = resources[ns]
  return (dictionary as Record<string, string>)[key as string] || (key as string)
}