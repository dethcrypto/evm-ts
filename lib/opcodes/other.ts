import { Opcode } from "./common";
import { IMachineState } from "../VM";

export class StopOpcode extends Opcode {
  static id = 0x00;
  static type = "STOP";

  run(state: IMachineState): void {
    state.stopped = true;
  }
}

export class RevertOpcode extends Opcode {
  static id = 0xfd;
  static type = "REVERT";

  run(state: IMachineState): void {
    state.stopped = true;
    // @todo: proper impl
  }
}
