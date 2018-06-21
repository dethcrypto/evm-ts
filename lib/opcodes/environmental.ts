/* tslint:disable */
import { Opcode } from "./common";
import { Environment, IMachineState } from "../BytecodeRunner";

export class LoadCallData extends Opcode {
  static id = 0x35;
  static type = "CALLDATALOAD";

  run(_environment: Environment, _state: IMachineState): IMachineState {
    // const readIndex = getIndex(state.stack, -1);
    // const data = bitsToNumber(environment.slice(readIndex, readIndex + 32));

    // return {
    //   ...state,
    //   stack: [...state.stack.slice(0, -1), data],
    // };

    throw new Error("Not implemented yet!");
  }
}
