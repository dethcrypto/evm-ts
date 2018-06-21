import * as invariant from "invariant";
import { Dictionary, keyBy } from "lodash";

import { Opcode, UnknownOpcodeError } from "./opcodes/common";
import * as opcodes from "./opcodes/index";
import { PeekableIterator } from "./utils/PeekableIterator";
import { decodePushFromBytecode } from "./opcodes/index";
import { byteStringToNumberArray } from "./utils/bytes";

const opcodesById: Dictionary<new () => Opcode> = keyBy(opcodes as any, "id");

const dynamicOpcodesDecoders = [decodePushFromBytecode];

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
  const matchedOpcode = dynamicOpcodesDecoders.map(o => o(bytesIterator)).filter(o => !!o);
  invariant(matchedOpcode.length <= 1, "Dynamic opcode matched more than one time!");

  if (matchedOpcode.length === 0) return;

  return matchedOpcode[0]!;
}
