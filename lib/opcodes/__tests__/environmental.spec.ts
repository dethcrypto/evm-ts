import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";
import { BN } from "bn.js";

describe("environmental opcodes", () => {
  describe("CALLDATALOAD", () => {
    it("zero value", () =>
      compareWithReferentialImpl("600035", {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      }));
  });

  describe("CALLVALUE", () => {
    it("zero value", () => compareWithReferentialImpl("34"));
    it("non zero value", () => compareWithReferentialImpl("34", { value: new BN(123) }));
  });
});
