import { Opcode } from "./common";
import { Environment, IMachineState } from "../BytecodeRunner";
import { getIndex } from "../utils/arrays";

export class StopOpcode extends Opcode {
  static id = 0x00;
  static type = "STOP";

  run(_env: Environment, state: IMachineState): IMachineState {
    return {
      ...state,
      stopped: true,
    };
  }
}

export class AddOpcode extends Opcode {
  static id = 0x01;
  static type = "ADD";

  run(_env: Environment, state: IMachineState): IMachineState {
    const arg1 = getIndex(state.stack, -1);
    const arg2 = getIndex(state.stack, -2);

    if (arg1 === null || arg1 === undefined) {
      throw new Error("Error while adding. Arg1 is undefined!");
    }

    if (arg2 === null || arg2 === undefined) {
      throw new Error("Error while adding. Arg2 is undefined!");
    }

    const result = arg1.add(arg2);

    return {
      ...state,
      pc: state.pc + 1,
      stack: [...state.stack.slice(0, -2), result],
    };
  }
}

export class MulOpcode extends Opcode {
  static id = 0x02;
  static type: "MUL";

  run(_env: Environment, state: IMachineState): IMachineState {
    // @todo use something nice to handle work with immutable data structures
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    if (arg1 === null || arg1 === undefined) {
      throw new Error("Error while adding. Arg1 is undefined!");
    }

    if (arg2 === null || arg2 === undefined) {
      throw new Error("Error while adding. Arg2 is undefined!");
    }

    const result = arg1.mul(arg2);

    state.stack.push(result);
    state.pc++;

    return state;
  }
}
