import { Opcode } from "./common";
import { MachineState } from "../types";

export class PopOpcode extends Opcode {
  static id = 0x50;
  static type = "POP";

  run(state: MachineState): void {
    state.stack.pop();
    state.pc += 1;
  }
}
