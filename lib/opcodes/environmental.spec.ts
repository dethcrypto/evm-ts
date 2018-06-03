import { expect } from "chai";

import { LoadCallData } from "./environmental";
import { IMachineState } from "../bytecode-runner";

describe("LoadCallData", () => {
  it.skip("LoadCallData should load data from environment", () => {
    const loadCallData = new LoadCallData();
    const env = Array.from(Array(5)).map(() => false);
    env[30] = true;
    env[31] = true;
    const state = {
      stack: [0],
      pc: 0,
      memory: [0],
      stopped: false,
    };

    const expected: IMachineState = {
      stack: [3],
      pc: 0,
      memory: [0],
      stopped: false,
    };

    const actual = loadCallData.run(env, state);

    expect(actual).to.be.deep.eq(expected);
  });
});
