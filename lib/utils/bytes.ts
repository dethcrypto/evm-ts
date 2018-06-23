import * as invariant from "invariant";
import { chunk } from "lodash";
import { BN } from "bn.js";

export function byteStringToNumberArray(bytesString: string): number[] {
  invariant(bytesString.length % 2 === 0, "Byte string cannot be properly read as bytes.");

  return chunk(bytesString.split(""), 2).map(byte => parseInt(`${byte[0]}${byte[1]}`, 16));
}

export const MAX_UINT_256 = new BN(2).pow(new BN(256));
