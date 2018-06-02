import { Environment, IMachineState } from "../bytecode-runner";
import { Opcode } from "./base";

export class MStoreOpcode extends Opcode {
  static id = 0x52;
  static type = "MSTORE";

  run(_env: Environment, _state: IMachineState): IMachineState {
    throw new Error("Unimplemented!");
  }
}
