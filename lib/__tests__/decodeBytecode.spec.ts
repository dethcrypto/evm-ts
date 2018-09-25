import { expect } from "chai";
import { BN } from "bn.js";

import { decodeOpcode } from "../decodeBytecode";
import { PushOpcode } from "../opcodes";
import { PeekableIterator } from "../utils/PeekableIterator";
import { byteStringToNumberArray } from "../utils/bytes";
import { Opcode } from "../opcodes/common";

function decodeOpcodeString(opcode: string): Opcode {
  return decodeOpcode(new PeekableIterator(byteStringToNumberArray(opcode)));
}

describe("decodeBytecode", () => {
  it("should decode push operation", () => {
    const input = "7f4e616d6552656700000000000000000000000000000000000000000000000000";
    const expected = new PushOpcode(32, new BN("4e616d6552656700000000000000000000000000000000000000000000000000", 16));

    expect(decodeOpcodeString(input)).to.be.deep.eq(expected);
  });

  it("should not decode malformed push opcode", () => {
    const input = "60";
    const expected = "Decoding PUSH failed at 1 byte of the bytecode";

    expect(() => decodeOpcodeString(input)).to.throw(Error, expected);
  });

  it("should not decode malformed opcodes", () => {
    const input = "606";
    const expected = "Byte string cannot be properly read as bytes.";

    expect(() => decodeOpcodeString(input)).to.throw(Error, expected);
  });

  it("should not decode unknown opcode", () => {
    const input = "fe";
    const expected = "Unknown opcode: 0xfe at 0 byte of the bytecode";

    expect(() => decodeOpcodeString(input)).to.throw(Error, expected);
  });
});
