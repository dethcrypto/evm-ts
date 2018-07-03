import * as invariant from "invariant";
import { BN } from "bn.js";

import { Opcode, DecodeError, notImplementedError } from "./common";
import { IMachineState } from "../VM";
import { PeekableIterator } from "../utils/PeekableIterator";

/**
 * SWAP is a family of opcodes.
 */

const baseId = 0x90;
const baseType = "SWAP";
const range = 16;

export function decodeSwapFromBytecode(bytecodeIterator: PeekableIterator<number>): SwapOpcode | undefined {
  const opcode = bytecodeIterator.peek();
  if (opcode < baseId || opcode > baseId + range) return;

  const byteNumber = opcode - baseId + 1;

  bytecodeIterator.next();

  return new SwapOpcode(byteNumber);
}

export class SwapOpcode extends Opcode {
  constructor(public byteNumber: number) {
    super(baseId + byteNumber, `${baseType}${byteNumber}`);
  }

  run(state: IMachineState): void {
    notImplementedError();
  }
}
