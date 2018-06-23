import { IMachineState } from "../VM";
import { Opcode } from "./common";
import { arrayCopy } from "../utils/arrays";

/**
 * Stores full word in memory.
 */
export class MStoreOpcode extends Opcode {
  static id = 0x52;
  static type = "MSTORE";

  run(state: IMachineState): void {
    const address = state.stack.pop().toNumber();

    const value = state.stack.pop();
    const valueEncoded = value.toArray("be", 32);

    const newMemory = arrayCopy(state.memory, valueEncoded, address);

    state.memory = newMemory;
    state.pc += 1;
  }
}
