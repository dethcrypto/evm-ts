import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";

describe("SWAP", () => {
  it("should swap 1st data", () => compareWithReferentialImpl("6001600290"));
  it("should swap 2nd stack element", () => compareWithReferentialImpl("60016002600391"));
});
