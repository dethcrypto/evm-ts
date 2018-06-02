export function getIndex<T>(array: T[], index: number): T {
  if (index >= 0) {
    return array[index];
  } else {
    const finalIndex = array.length + index;
    return array[finalIndex];
  }
}

export function bitsToNumber(array: boolean[]): number {
  return array.reduce((acc, value) => {
    return (acc << 2) + (value ? 1 : 0);
  }, 0);
}
