import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";

describe("storage opcodes", () => {
  describe("SSTORE", () => {
    it("simple", () => compareWithReferentialImpl("60f160005560ff600255"));
  });

  describe("SLOAD", () => {
    it("simple", () => compareWithReferentialImpl("60f160005560ff600255600054"));
  });
});
