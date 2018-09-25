import { compareWithReferentialImpl } from "test/helpers/compareWithReferentialImpl";

describe("PUSH", () => {
  it("should push simple data", () =>
    compareWithReferentialImpl("7f4e616d6552656700000000000000000000000000000000000000000000000000"));
});
