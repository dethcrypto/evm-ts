import { expect } from "chai";

import bytecodeDecoder from "./bytecode-decoder";

describe("BytecodeDecoder", () => {
  it("should decode push operation", () => {
    const input = "6060";
    const expected = [
      {
        id: 96,
        type: "PUSH1",
        arg: 96,
      },
    ];

    expect(bytecodeDecoder(input)).to.be.deep.eq(expected);
  });

  it("should not decode malformed push opcode", () => {
    const input = "60";
    const expected = "Argument to PUSH opcode is missing!";

    expect(() => bytecodeDecoder(input)).to.throw(Error, expected);
  });

  it("should not decode malformed opcodes", () => {
    const input = "606";
    const expected = "Bytecode cannot be properly read as bytes.";

    expect(() => bytecodeDecoder(input)).to.throw(Error, expected);
  });

  it("should not decode unknown opcode", () => {
    const input = "fe";
    const expected = "Unrecognized opcode: fe";

    expect(() => bytecodeDecoder(input)).to.throw(Error, expected);
  });
});
