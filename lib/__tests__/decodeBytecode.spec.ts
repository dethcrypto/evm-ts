import { expect } from "chai";

import { decodeBytecode } from "../decodeBytecode";
import { PushOpcode, AddOpcode } from "../opcodes";
import { BN } from "bn.js";

describe("decodeBytecode", () => {
  it("should decode push operation", () => {
    const input = "7f4e616d6552656700000000000000000000000000000000000000000000000000";
    const expected = [
      new PushOpcode(32, new BN("4e616d6552656700000000000000000000000000000000000000000000000000", 16)),
    ];

    expect(decodeBytecode(input)).to.be.deep.eq(expected);
  });

  it("should decode multiple ops operation", () => {
    const input =
      "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01";
    const expected = [
      new PushOpcode(32, new BN("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16)),
      new PushOpcode(32, new BN("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", 16)),
      new AddOpcode(),
    ];

    expect(decodeBytecode(input)).to.be.deep.eq(expected);
  });

  it("should not decode malformed push opcode", () => {
    const input = "60";
    const expected = "Decoding PUSH failed at 1 byte of the bytecode";

    expect(() => decodeBytecode(input)).to.throw(Error, expected);
  });

  it("should not decode malformed opcodes", () => {
    const input = "606";
    const expected = "Byte string cannot be properly read as bytes.";

    expect(() => decodeBytecode(input)).to.throw(Error, expected);
  });

  it("should not decode unknown opcode", () => {
    const input = "fe";
    const expected = "Unknown opcode: 0xfe at 0 byte of the bytecode";

    expect(() => decodeBytecode(input)).to.throw(Error, expected);
  });
});
