import { compareWithReferentialImpl } from "./helpers/compareWithReferentialImpl";

describe("EMV-TS", () => {
  it("should work", () => compareWithReferentialImpl("60606040523415600e"));

  it.skip("should work with more complicated bytecode", () =>
    compareWithReferentialImpl(
      "60606040523415600e57600080fd5b5b60016000819055505b5b60368060266000396000f30060606040525b600080fd00a165627a7a72305820af3193f6fd31031a0e0d2de1ad2c27352b1ce081b4f3c92b5650ca4dd542bb770029",
    ));
});
