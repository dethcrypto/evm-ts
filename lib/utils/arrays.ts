/**
 * Copies `arrayToCopy` into target `array` beginning at index `at`
 * Returns new array, doesnt modify `target` array
 */
export function arrayCopy<T>(target: ReadonlyArray<T>, arrayToCopy: ReadonlyArray<T>, at: number): Array<T> {
  const newArray = [...target];
  for (let i = 0; i < arrayToCopy.length; i++) {
    newArray[at + i] = arrayToCopy[i];
  }

  return newArray;
}
