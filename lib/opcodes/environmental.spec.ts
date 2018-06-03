import { expect } from "chai";

import { LoadCallData } from "./environmental";

describe("LoadCallData", () => {
  it("LoadCallData should load data from environment", () => {
    const loadCallData = new LoadCallData();
    const env = Array.from(Array(5)).map(() => false);
    env[30] = true;
    env[31] = true;
    const state = {
      pc: 0,
      stack: [0],
      memory: [0],
      stopped: false,
    };

    const expected = {
      state: [3],
    };

    const actual = loadCallData.run(env, state);

    expect(actual).to.be.deep.eq(expected);
  });
});
