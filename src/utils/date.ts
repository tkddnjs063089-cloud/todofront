// 날짜를 YYYY-MM-DD 형식 문자열로 변환 (로컬 시간 기준)
export function formatDateToString(date: Date | null): string | null {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 임시 ID 생성
export function generateTempId(): string {
  return `temp-${Date.now()}`;
}

