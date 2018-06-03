export function getIndex<T>(array: T[], index: number): T {
  if (index >= 0) {
    return array[index];
  } else {
    const finalIndex = array.length + index;
    return array[finalIndex];
  }
}
