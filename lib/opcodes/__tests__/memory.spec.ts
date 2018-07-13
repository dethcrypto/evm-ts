import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";

describe("memory opcodes", () => {
  describe("MSTORE", () => {
    it("simple", () => compareWithReferentialImpl("6060600052"));

    it("with more than 1 word size data", () =>
      compareWithReferentialImpl("7f4e616d655265670000000000000000f0000b0000000000000000000000000000606052"));
  });
});
