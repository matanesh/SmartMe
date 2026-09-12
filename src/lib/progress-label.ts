export function getDailyProgressLabel(count: number) {
  if (count === 0) {
    return "כל רעיון הוא התחלה";
  }

  return count === 1
    ? "עצרת היום על רעיון אחד"
    : `עצרת היום על ${count} רעיונות`;
}
