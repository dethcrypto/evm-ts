import { compareWithReferentialImpl } from "./integration/referential-implementation-utils";

describe("runEvm", () => {
  describe("should work with", () => {
    it("simple push instruction", () =>
      compareWithReferentialImpl("7f4e616d6552656700000000000000000000000000000000000000000000000000"));

    it("add with overflow", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01",
      ));

    it("mul with overflow", () =>
      compareWithReferentialImpl(
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff02",
      ));

    it("mstore simple", () => compareWithReferentialImpl("6060600052"));

    it("mstore with more than 1 word size data", () =>
      compareWithReferentialImpl("7f4e616d655265670000000000000000f0000b0000000000000000000000000000606052"));

    it("iszero and callvalue should work", () => compareWithReferentialImpl("60606040523415600e"));
  });
});
