/**
 * Gets array index, supports negative indexes to access elements from the end
 */
export function getIndex<T>(array: T[], index: number): T | undefined {
  if (index >= 0) {
    return array[index];
  } else {
    const finalIndex = array.length + index;
    return array[finalIndex];
  }
}

export function getIndexOrDie<T>(array: T[], index: number): T {
  const result = getIndex(array, index);

  if (result === undefined) {
    throw new Error(`Trying to access element ${index} but array has only ${array.length}`);
  }

  return result;
}

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

/**
 * Slice that ensures that final array has desired lenght. WARNING: parameters are different then Array.prototype.length
 */
export function sliceAndEnsureLength<T>(
  array: ReadonlyArray<T>,
  from: number,
  desiredLength: number,
  fill: T,
): ReadonlyArray<T> {
  const slicedArray = array.slice(from, from + desiredLength);

  // fill out missing elements with `fill` parameter
  const realLength = slicedArray.length;
  const filled = [...Array(desiredLength - realLength)].map(_ => fill);

  return [...slicedArray, ...filled];
}
