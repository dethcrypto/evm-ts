import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";
import { BN } from "bn.js";

describe("environmental opcodes", () => {
  describe("CALLVALUE", () => {
    it("zero value", () => compareWithReferentialImpl("34"));
    it("non zero value", () => compareWithReferentialImpl("34", { value: new BN(123) }));
  });
});
