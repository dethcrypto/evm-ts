import * as invariant from "invariant";

import { Opcode, DecodeError } from "./common";
import { Environment, IMachineState } from "../bytecode-runner";
import { PeekableIterator } from "../utils/PeekableIterator";

/**
 * PUSH is a family of opcodes.
 */

const baseId = 0x60;
const baseType = "PUSH";
const range = 31;

export function decodePushFromBytecode(bytecodeIterator: PeekableIterator<number>): PushOpcode | undefined {
  const opcode = bytecodeIterator.peek();
  if (opcode < baseId || opcode > baseId + range) return;

  const byteNumber = opcode - baseId + 1;

  try {
    bytecodeIterator.next();
    const args = bytecodeIterator.take(byteNumber);

    return new PushOpcode(byteNumber, args);
  } catch (e) {
    throw new DecodeError(bytecodeIterator.index, "PUSH");
  }
}

export class PushOpcode extends Opcode {
  constructor(public byteNumber: number, public args: number[]) {
    super(baseId + byteNumber, `${baseType}${byteNumber}`);

    invariant(byteNumber === args.length, `byte number (${byteNumber}) doesn't match args bytes: ${args.length}`);
  }

  run(_env: Environment, state: IMachineState): IMachineState {
    return {
      ...state,
      stack: [...state.stack, ...this.args],
      pc: state.pc + 1,
    };
  }
}
