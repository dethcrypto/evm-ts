import { compareWithReferentialImpl } from "./integration/referential-implementation-utils";
import { Dictionary } from "lodash";

describe("runEvm", () => {
  describe("should work with", () => {
    const tests: Dictionary<string> = {
      "simple push instruction": "7f4e616d6552656700000000000000000000000000000000000000000000000000",
      "add with overflow":
        "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff01",
    };

    Object.keys(tests).forEach(name => {
      const code = tests[name];

      it(name, () => {
        return compareWithReferentialImpl(code);
      });
    });
  });
});
