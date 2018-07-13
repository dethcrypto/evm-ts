import { expect } from "chai";
import { BN } from "bn.js";

import { VM } from "../VM";
import * as opcodes from "../opcodes";

/* tslint:disable */

describe("VM", () => {
  // here we need some nice way to decode input into opcodes
  it.skip("should run simple program", () => {
    const input = [new opcodes.PushOpcode(1, new BN(1)), new opcodes.PushOpcode(1, new BN(2)), new opcodes.AddOpcode()];
    const expectedState = {
      pc: 5,
      stopped: true,
      stack: [new BN(3)],
      memory: [],
    };

    const bytecodeRunner = new VM();
    bytecodeRunner.runCode();
    expect(bytecodeRunner.state).to.deep.eq(expectedState);
  });

  it.skip("should clone state before passing it to opcodes", () => {
    // const initialState: IMachineState = {
    //   pc: 0,
    //   stack: new Stack([new BN(1), new BN(2)]),
    //   memory: [],
    //   stopped: false,
    // };
    // const initialEnv: IEnvironment = { value: new BN(0) };
    // class StateMutatingOpcode extends Opcode {
    //   run(state: IMachineState): void {
    //     state.stack.push(new BN(6));
    //     state.memory.push(1);
    //     state.pc += 1;
    //   }
    // }
    // const input: IProgram = { opcodes: [new StateMutatingOpcode()], sourceMap: { 0: 0 } };
    // const expected = "Cannot add property 0, object is not extensible";
    // const bytecodeRunner = new VM(input, initialEnv, initialState);
    // expect(() => bytecodeRunner.run()).to.not.throw(Error, expected);
    // expect(initialState).to.deep.eq({
    //   pc: 0,
    //   stack: new Stack([new BN(1), new BN(2)]),
    //   memory: [],
    //   stopped: false,
    // });
    // expect(bytecodeRunner.state).to.deep.eq({
    //   stack: [new BN(1), new BN(2), new BN(6)],
    //   memory: [1],
    //   pc: 1,
    //   stopped: true,
    // });
  });
});
