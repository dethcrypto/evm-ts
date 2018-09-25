import { expect } from "chai";

import { compareWithReferentialImpl, runEvm } from "test/helpers/compareWithReferentialImpl";

describe("DUP", () => {
  it("should work", () => compareWithReferentialImpl("60ff600081"));
  it("should fail on accessing not existing stack element", () => {
    expect(() => runEvm("81")).to.throw(
      "Error while running DUP2 at position 0: Tried to duplicate 2 element but stack has only 0 elements",
    );
  });
});
