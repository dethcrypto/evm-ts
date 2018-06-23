import { expect } from "chai";

import { arrayCopy } from "../arrays";

describe("array utils", () => {
  describe("arrayCopy", () => {
    it("should work", () => {
      const A = Object.freeze([1, 2, 3, 4]);
      const B = [11, 22, 33, 44];

      const result = arrayCopy(A, B, 2);

      expect(result).to.be.deep.eq([1, 2, 11, 22, 33, 44]);
    });
  });
});
