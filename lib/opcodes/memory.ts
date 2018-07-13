import { IMachineState, IEnvironment } from "../VM";
import { Opcode } from "./common";
import { arrayCopy } from "../utils/arrays";
import { BN } from "bn.js";

/**
 * Stores full word in memory.
 */
export class MStoreOpcode extends Opcode {
  static id = 0x52;
  static type = "MSTORE";

  run(state: IMachineState): void {
    const address = state.stack.pop().toNumber();

    const value = state.stack.pop();
    const valueEncoded = value.toArray("be", 32); // @todo this will probably overflow

    const newMemory = arrayCopy(state.memory, valueEncoded, address);

    state.memory = newMemory;
    state.pc += 1;
  }
}

/**
 * Loads full word from memory.
 */
export class MLoadOpcode extends Opcode {
  static id = 0x51;
  static type = "MLOAD";

  run(state: IMachineState): void {
    const address = state.stack.pop().toNumber();
    const valueRaw = state.memory.slice(address, address + 32);

    const value = new BN(valueRaw, undefined, "be");

    state.stack.push(value);
    state.pc += 1;
  }
}

/**
 * Copy code running in current environment to memory
 */
export class CodeCopyOpcode extends Opcode {
  static id = 0x39;
  static type = "CODECOPY";

  run(state: IMachineState, env: IEnvironment): void {
    const memOffset = state.stack.pop().toNumber();
    const codeOffset = state.stack.pop().toNumber();
    const length = state.stack.pop().toNumber();

    const codeToCopy = env.code.slice(codeOffset, codeOffset + length);

    const newMemory = arrayCopy(state.memory, codeToCopy, memOffset);

    state.memory = newMemory;
    state.pc += 1;
  }
}
