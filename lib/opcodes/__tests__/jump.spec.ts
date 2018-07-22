import {
  compareWithReferentialImpl,
  compareInvalidCodeWithReferentialImpl,
} from "../../__tests__/helpers/compareWithReferentialImpl";

describe("jump opcodes", () => {
  describe("JUMP", () => {
    it("should jump", () => compareWithReferentialImpl("60055600005b60ff"));

    it("should not jump to invalid destination", () =>
      compareInvalidCodeWithReferentialImpl(
        "600556000060ff",
        "invalid JUMP at 22acee2975b854d08bac37689ad94c3b568535a82e0d2ac7b688a36a402e3b26/0000000000000000000000000000000000000000000000000000000000000000:2",
        "Trying to jump to 5 which is not JUMPDEST opcode",
      ));
  });

  describe("JUMPI", () => {
    it("should jump when condition is met", () => compareWithReferentialImpl("600160075700005b60ff"));
    it("should not jump when condition is not met", () => compareWithReferentialImpl("600060075700005b60ff"));
  });
});
