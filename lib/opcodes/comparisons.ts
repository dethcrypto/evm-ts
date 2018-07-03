import { IMachineState, IEnvironment } from "../VM";
import { Opcode, notImplementedError } from "./common";

export class LessThanOpcode extends Opcode {
  static id = 0x10;
  static type = "LT";

  run(state: IMachineState, env: IEnvironment): void {
    notImplementedError()
  }
}
