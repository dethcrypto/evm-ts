import { compareWithReferentialImpl } from "./integration/referential-implementation-utils";

describe("runEvm", () => {
  it("should work", async () => {
    const code = "7f4e616d6552656700000000000000000000000000000000000000000000000000";

    await compareWithReferentialImpl(code);
  });
});
