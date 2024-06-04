export function getPreferredLanguageObject(arr: any[]) {
  let spanish = null;
  let english = null;

  for (const item of arr) {
    if (item.language.name === 'es') {
      spanish = item;
      break;  // Prioritize Spanish, so break the loop if found
    }
    if (item.language.name === 'en') {
      english = item;
    }
  }

  return spanish || english;
}