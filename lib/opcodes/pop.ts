import { Opcode } from "./common";
import { IMachineState } from "../types";

export class PopOpcode extends Opcode {
  static id = 0x50;
  static type = "POP";

  run(state: IMachineState): void {
    state.stack.pop();
    state.pc += 1;
  }
}
