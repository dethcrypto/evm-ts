import * as invariant from "invariant";
import { chunk, Dictionary, keyBy } from "lodash";

import { Opcode, UnknownOpcodeError } from "./opcodes/common";
import * as opcodes from "./opcodes/index";
import { PeekableIterator } from "./utils/PeekableIterator";
import { decodePushFromBytecode } from "./opcodes/index";

const opcodesById: Dictionary<new () => Opcode> = keyBy(opcodes as any, "id");

const dynamicOpcodesDecoders = [decodePushFromBytecode];

export default function bytecodeDecoder(bytecode: string): Opcode[] {
  invariant(bytecode.length % 2 === 0, "Bytecode cannot be properly read as bytes.");

  const bytes: number[] = chunk(bytecode.split(""), 2).map(byte => parseInt(`${byte[0]}${byte[1]}`, 16));

  const bytesIterator = new PeekableIterator(bytes);

  let opcodes: Opcode[] = [];
  while (bytesIterator.hasNext()) {
    bytesIterator.next();

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

  return new OpcodeClass();
}

function decodeDynamicOpcode(bytesIterator: PeekableIterator<number>): Opcode | undefined {
  const matchedOpcode = dynamicOpcodesDecoders.map(o => o(bytesIterator)).filter(o => !!o);
  invariant(matchedOpcode.length <= 1, "Dynamic opcode matched more than one time!");

  if (matchedOpcode.length === 0) return;

  return matchedOpcode[0]!;
}
