import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";
import { BN } from "bn.js";
import { byteStringToNumberArray } from "../../utils/bytes";

describe("environmental opcodes", () => {
  describe("CALLDATALOAD", () => {
    it("read from 0", () =>
      compareWithReferentialImpl("600035", {
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      }));

    it("read from non 0", () =>
      compareWithReferentialImpl("600135", {
        data: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      }));

    it("real world data", () =>
      compareWithReferentialImpl("60ff35", {
        data: byteStringToNumberArray("f8a8fd6d"),
      }));
  });

  describe("CALLVALUE", () => {
    it("zero value", () => compareWithReferentialImpl("34"));
    it("non zero value", () => compareWithReferentialImpl("34", { value: new BN(123) }));
  });
});
