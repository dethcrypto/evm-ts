import { BN } from "bn.js";

import { Opcode, DecodeError } from "./common";
import { PeekableIterator } from "../utils/PeekableIterator";
import { MachineState } from "../types";

/**
 * PUSH is a family of opcodes.
 */

const baseId = 0x60;
const baseType = "PUSH";
const range = 32;

export function decodePushFromBytecode(bytecodeIterator: PeekableIterator<number>): PushOpcode | undefined {
  const opcode = bytecodeIterator.peek();
  if (opcode < baseId || opcode >= baseId + range) return;

  const byteNumber = opcode - baseId + 1;

  try {
    bytecodeIterator.next();
    const arg = bytecodeIterator.take(byteNumber);

    return new PushOpcode(byteNumber, new BN(arg));
  } catch (e) {
    throw new DecodeError(bytecodeIterator.index, "PUSH");
  }
}

export class PushOpcode extends Opcode {
  constructor(public byteNumber: number, public arg: BN) {
    super(baseId + byteNumber, `${baseType}${byteNumber}`);
  }

  run(state: MachineState): void {
    state.stack.push(this.arg);
    state.pc += this.byteNumber + 1;
  }
}
