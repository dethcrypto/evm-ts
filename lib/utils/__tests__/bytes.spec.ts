import { byteStringToNumberArray } from "../bytes";
import { expect } from "chai";

describe("bytes", () => {
  describe("byteStringToNumberArray", () => {
    it("should work", () => {
      const input = "4e616d65526567";

      const actual = [0x4e, 0x61, 0x6d, 0x65, 0x52, 0x65, 0x67];

      expect(byteStringToNumberArray(input)).to.be.deep.eq(actual);
    });
  });
});
