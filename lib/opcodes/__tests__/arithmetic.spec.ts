import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";

describe("arithmetic opcodes", () => {
  describe("ADD", () => {
    it("add with overflow", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01",
      ));
  });

  describe("MUL", () => {
    it("mul with overflow", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff02",
      ));
  });

  describe("ISZERO", () => {
    it("work with zero", () => compareWithReferentialImpl("600015"));
    it("work with not zero", () => compareWithReferentialImpl("60f015"));
  });
});
