import { Opcode } from "./common";
import { PeekableIterator } from "../utils/PeekableIterator";
import { getIndex } from "../utils/arrays";
import { IMachineState } from "../types";

/**
 * DUP is a family of opcodes.
 */

const baseId = 0x80;
const baseType = "DUP";
const range = 16;

export function decodeDupFromBytecode(bytecodeIterator: PeekableIterator<number>): DupOpcode | undefined {
  const opcode = bytecodeIterator.peek();
  if (opcode < baseId || opcode >= baseId + range) return;

  const byteNumber = opcode - baseId + 1;

  bytecodeIterator.next();

  return new DupOpcode(byteNumber);
}

export class DupOpcode extends Opcode {
  constructor(public stackIndex: number) {
    super(baseId + stackIndex, `${baseType}${stackIndex}`);
  }

  run(state: IMachineState): void {
    const elementToDuplicate = getIndex(state.stack, -this.stackIndex);

    if (!elementToDuplicate) {
      throw new Error(
        `Tried to duplicate ${this.stackIndex} element but stack has only ${state.stack.length} elements`,
      );
    }

    state.stack.push(elementToDuplicate);
    state.pc += 1;
  }
}
