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

    // @todo handle undefined cases with helpers (lodash?, require?)
    // @todo this should take byteNumber into account
    if (args === undefined) {
      throw new Error("Argument to PUSH opcode is missing!");
    }
  }

  run(_env: Environment, state: IMachineState): IMachineState {
    return {
      ...state,
      stack: [...state.stack, ...this.args],
      pc: state.pc + 1,
    };
  }
}
