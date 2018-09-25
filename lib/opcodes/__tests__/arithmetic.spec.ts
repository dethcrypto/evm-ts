import { compareWithReferentialImpl } from "test/helpers/compareWithReferentialImpl";

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

  describe("SUB", () => {
    it("SUB with overflow", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03",
      ));

    it.skip("SUB with minus sign");
  });

  describe("DIV", () => {
    it("div with overflow", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04",
      ));
  });

  describe("ISZERO", () => {
    it("work with zero", () => compareWithReferentialImpl("600015"));
    it("work with not zero", () => compareWithReferentialImpl("60f015"));
  });

  describe("AND", () => {
    it("and", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff16",
      ));
  });

  describe("EQ", () => {
    it("eq", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14",
      ));

    it("eq2", () => compareWithReferentialImpl("6001600214"));
  });
});
