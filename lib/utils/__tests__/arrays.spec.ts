import { expect } from "chai";

import { arrayCopy, getIndex, sliceAndEnsureLength } from "../arrays";

describe("array utils", () => {
  describe("getIndex", () => {
    const array = [1, 2, 3];

    it("should work", () => {
      expect(getIndex(array, 0)).to.be.eq(1);
      expect(getIndex(array, -1)).to.be.eq(3);
      expect(getIndex(array, -2)).to.be.eq(2);
      expect(getIndex(array, -5)).to.be.eq(undefined);
    });
  });

  describe("arrayCopy", () => {
    it("should work", () => {
      const A = Object.freeze([1, 2, 3, 4]);
      const B = [11, 22, 33, 44];

      const result = arrayCopy(A, B, 2);

      expect(result).to.be.deep.eq([1, 2, 11, 22, 33, 44]);
    });
  });

  describe("sliceAndEnsureLength", () => {
    it("should work", () => {
      const array = [1, 2, 3];

      const actual = sliceAndEnsureLength(array, 2, 3, 0);

      expect(actual).to.be.deep.eq([3, 0, 0]);
    });
  });
});
