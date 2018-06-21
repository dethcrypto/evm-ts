import { expect } from "chai";
import { BN } from "bn.js";

import { BytecodeRunner, Environment, IMachineState } from "../BytecodeRunner";
import * as opcodes from "../opcodes";
import { Opcode } from "../opcodes/common";
import { Stack } from "../utils/Stack";

describe("BytecodeRunner", () => {
  it("should run simple program", () => {
    const input = [new opcodes.PushOpcode(1, new BN(1)), new opcodes.PushOpcode(1, new BN(2)), new opcodes.AddOpcode()];
    const expectedState = {
      pc: 3,
      stopped: true,
      stack: [new BN(3)],
      memory: [],
    };

    const bytecodeRunner = new BytecodeRunner(input);
    bytecodeRunner.run();
    expect(bytecodeRunner.state).to.deep.eq(expectedState);
  });

  it("should clone state before passing it to opcodes", () => {
    const initialState: IMachineState = {
      pc: 0,
      stack: new Stack([new BN(1), new BN(2)]),
      memory: [],
      stopped: false,
    };

    class StateMutatingOpcode extends Opcode {
      run(_environment: Environment, state: IMachineState): void {
        state.stack.push(new BN(6));
        state.pc += 1;
      }
    }

    const input = [new StateMutatingOpcode()];
    const expected = "Cannot add property 0, object is not extensible";

    const bytecodeRunner = new BytecodeRunner(input, [], initialState);
    expect(() => bytecodeRunner.run()).to.not.throw(Error, expected);
    expect(initialState).to.deep.eq({ ...initialState });
    expect(bytecodeRunner.state).to.deep.eq({
      ...initialState,
      stack: [new BN(1), new BN(2), new BN(6)],
      pc: 1,
      stopped: true,
    });
  });
});
