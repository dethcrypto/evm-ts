import { IMachineState } from "../VM";
import { Opcode, notImplementedError } from "./common";

/**
 * Stores full word in storage.
 */
export class SStoreOpcode extends Opcode {
  static id = 0x55;
  static type = "SSTORE";

  run(_state: IMachineState): void {
    notImplementedError();
  }
}

/**
 * Loades full word from storage.
 */
export class SLoadOpcode extends Opcode {
  static id = 0x54;
  static type = "SLOAD";

  run(_state: IMachineState): void {
    notImplementedError();
  }
}
