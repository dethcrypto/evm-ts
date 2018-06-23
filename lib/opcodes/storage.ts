import { Environment, IMachineState } from "../BytecodeRunner";
import { Opcode } from "./common";

export class MStoreOpcode extends Opcode {
  static id = 0x52;
  static type = "MSTORE";

  run(_state: IMachineState): IMachineState {
    throw new Error("Unimplemented!");
  }
}
