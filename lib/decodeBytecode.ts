import { keyBy } from "lodash";
import { Dictionary } from "ts-essentials";

import { Opcode, UnknownOpcodeError } from "./opcodes/common";
import * as opcodes from "./opcodes";
import { PeekableIterator } from "./utils/PeekableIterator";

const opcodesById: Dictionary<new () => Opcode> = keyBy(opcodes as any, "id");

const dynamicOpcodesDecoders = [
  opcodes.decodePushFromBytecode,
  opcodes.decodeDupFromBytecode,
  opcodes.decodeSwapFromBytecode,
  opcodes.decodeLogFromBytecode,
];

export function decodeOpcode(bytesIterator: PeekableIterator<number>): Opcode {
  const opcode = decodeStaticOpcode(bytesIterator) || decodeDynamicOpcode(bytesIterator);

  if (!opcode) throw new UnknownOpcodeError(bytesIterator.index, bytesIterator.peek());

  return opcode;
}

function decodeStaticOpcode(bytesIterator: PeekableIterator<number>): Opcode | undefined {
  const opcodeByte = bytesIterator.peek();

  const OpcodeClass = opcodesById[opcodeByte.toString()];

  if (!OpcodeClass) return;
  bytesIterator.next();

  return new OpcodeClass();
}

function decodeDynamicOpcode(bytesIterator: PeekableIterator<number>): Opcode | undefined {
  let matchedOpcode: Opcode | undefined;
  for (let i = 0; i < dynamicOpcodesDecoders.length; i++) {
    const decoder = dynamicOpcodesDecoders[i];

    const decodedOpcode = decoder(bytesIterator);
    if (!decodedOpcode) {
      continue;
    }

    matchedOpcode = decodedOpcode;
    break;
  }

  return matchedOpcode;
}
