import { Opcode, notImplementedError } from "./common";
import { PeekableIterator } from "../utils/PeekableIterator";
import { MachineState } from "../types";

/**
 * LOG is a family of opcodes.
 */

const baseId = 0xa1;
const baseType = "LOG";
const range = 5;

export function decodeLogFromBytecode(bytecodeIterator: PeekableIterator<number>): LogOpcode | undefined {
  const opcode = bytecodeIterator.peek();
  if (opcode < baseId || opcode >= baseId + range) return;

  const byteNumber = opcode - baseId + 1;

  bytecodeIterator.next();

  return new LogOpcode(byteNumber);
}

export class LogOpcode extends Opcode {
  constructor(public stackIndex: number) {
    super(baseId + stackIndex, `${baseType}${stackIndex}`);
  }

  run(_state: MachineState): void {
    notImplementedError();
  }
}
