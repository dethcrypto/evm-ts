import { Opcode } from "./common";
import { BN } from "bn.js";
import { IMachineState } from "../types";

/**
 * Stores full word in storage.
 */
export class SStoreOpcode extends Opcode {
  static id = 0x55;
  static type = "SSTORE";

  run(state: IMachineState): void {
    const location = state.stack.pop().toString(16);
    const value = state.stack.pop().toString(16);

    state.storage.set(location, value);
    state.pc += 1;
  }
}

/**
 * Loads full word from storage.
 */
export class SLoadOpcode extends Opcode {
  static id = 0x54;
  static type = "SLOAD";

  run(state: IMachineState): void {
    const location = state.stack.pop().toString(16);
    const value = state.storage.getOrDefault(location, "");

    state.stack.push(new BN(value, 16));
    state.pc += 1;
  }
}
