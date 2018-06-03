import { expect } from "chai";

import BytecodeRunner, { Environment, IMachineState } from "../bytecode-runner";
import * as opcodes from "../opcodes";
import { Opcode } from "../opcodes/common";

describe("BytecodeRunner", () => {
  it("should run simple program", () => {
    const input = [new opcodes.PushOpcode(1, [1]), new opcodes.PushOpcode(1, [2]), new opcodes.AddOpcode()];
    const expectedState = {
      pc: 3,
      stopped: true,
      stack: [3],
      memory: [],
    };

    const bytecodeRunner = new BytecodeRunner(input);
    bytecodeRunner.run();
    expect(bytecodeRunner.state).to.deep.eq(expectedState);
  });

  it("should not allow to mutate state by opcodes", () => {
    class StateMutatingOpcode extends Opcode {
      run(_environment: Environment, state: IMachineState): IMachineState {
        state.stack.push(6);
        return Object.assign(state, {
          pc: state.pc + 1,
        });
      }
    }

    const input = [new StateMutatingOpcode()];
    const expected = "Cannot add property 0, object is not extensible";

    const bytecodeRunner = new BytecodeRunner(input);
    expect(() => bytecodeRunner.run()).to.throw(Error, expected);
  });
});
