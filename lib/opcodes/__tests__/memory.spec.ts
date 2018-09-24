import { compareWithReferentialImpl } from "test/helpers/compareWithReferentialImpl";

describe("memory opcodes", () => {
  describe("MSTORE", () => {
    it("simple", () => compareWithReferentialImpl("6060600052"));

    it("with more than 1 word size data", () =>
      compareWithReferentialImpl("7f4e616d655265670000000000000000f0000b0000000000000000000000000000606052"));
  });

  describe("MLOAD", () => {
    it("simple", () => compareWithReferentialImpl("6060600052600051"));
  });
});
