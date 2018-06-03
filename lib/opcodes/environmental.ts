import { Opcode } from "./common";
import { Environment, IMachineState } from "../bytecode-runner";
import { getIndex, bitsToNumber } from "../utils";

export class LoadCallData extends Opcode {
  static id = 0x35;
  static type = "CALLDATALOAD";

  run(environment: Environment, state: IMachineState): IMachineState {
    const readIndex = getIndex(state.stack, -1);
    const data = bitsToNumber(environment.slice(readIndex, readIndex + 32));

    return {
      ...state,
      stack: [...state.stack.slice(0, -1), data],
    };
  }
}
