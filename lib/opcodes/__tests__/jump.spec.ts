import { compareWithReferentialImpl } from "../../__tests__/helpers/compareWithReferentialImpl";

describe("jump opcodes", () => {
  describe("JUMP", () => {
    it("should jump", () => compareWithReferentialImpl("60055600005b60ff"));

    it.skip("should not jump for not valid destination", () => compareWithReferentialImpl("600556000060ff"));
  });

  describe("JUMPI", () => {
    it("should jump when condition is met", () => compareWithReferentialImpl("600160075700005b60ff"));
    it("should not jump when condition is not met", () => compareWithReferentialImpl("600060075700005b60ff"));
  });
});
