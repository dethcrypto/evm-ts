import { IMachineState } from "../VM";
import { Opcode } from "./common";

/**
 * Stores full word in memory.
 */
export class SStoreOpcode extends Opcode {
  static id = 0x55;
  static type = "SSTORE";

  run(state: IMachineState): void {
    throw new Error("Not implemented yet");
  }
}
