import { compareWithReferentialImpl } from "test/helpers/compareWithReferentialImpl";

describe("comparison opcodes", () => {
  describe("LT", () => {
    it("work comparing smaller with bigger", () =>
      compareWithReferentialImpl(
        "7f4e616d65526567000000000000000000000000000000000000000000000000007fff616d655265670000000000000000000000000000000000000000000000000010",
      ));

    it("work comparing bigger with smaller", () =>
      compareWithReferentialImpl(
        "7fff616d65526567000000000000000000000000000000000000000000000000007f4e616d655265670000000000000000000000000000000000000000000000000010",
      ));
    it("work comparing equal", () =>
      compareWithReferentialImpl(
        "7f4e616d65526567000000000000000000000000000000000000000000000000007f4e616d655265670000000000000000000000000000000000000000000000000010",
      ));
  });

  describe("NOT", () => {
    it("should work", () => compareWithReferentialImpl("600519"));
  });

  describe("OR", () => {
    it("should work", () => compareWithReferentialImpl("6001600217"));
  });
});
