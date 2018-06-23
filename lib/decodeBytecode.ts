import { Dictionary, keyBy } from "lodash";

import { Opcode, UnknownOpcodeError } from "./opcodes/common";
import * as opcodes from "./opcodes/index";
import { PeekableIterator } from "./utils/PeekableIterator";
import { decodePushFromBytecode } from "./opcodes/index";
import { byteStringToNumberArray } from "./utils/bytes";
import { decodeDupFromBytecode } from "./opcodes/dup";

const opcodesById: Dictionary<new () => Opcode> = keyBy(opcodes as any, "id");

const dynamicOpcodesDecoders = [decodePushFromBytecode, decodeDupFromBytecode];

export function decodeBytecode(bytecode: string): Opcode[] {
  const bytes = byteStringToNumberArray(bytecode);

  const bytesIterator = new PeekableIterator(bytes);

  let opcodes: Opcode[] = [];
  while (!bytesIterator.done()) {
    opcodes.push(decodeOpcode(bytesIterator));
  }
  return opcodes;
}

function decodeOpcode(bytesIterator: PeekableIterator<number>): Opcode {
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
