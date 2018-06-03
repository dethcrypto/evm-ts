import * as invariant from "invariant";
import { chunk } from "lodash";

export function bitsToNumber(array: boolean[]): number {
  return array.reduce((acc, value) => {
    return (acc << 2) + (value ? 1 : 0);
  }, 0);
}

export function byteStringToNumberArray(bytesString: string): number[] {
  invariant(bytesString.length % 2 === 0, "Byte string cannot be properly read as bytes.");

  return chunk(bytesString.split(""), 2).map(byte => parseInt(`${byte[0]}${byte[1]}`, 16));
}
