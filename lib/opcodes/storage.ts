import { Opcode } from "./common";
import { BN } from "bn.js";
import { IMachineState, IEnvironment } from "../types";
import { VM } from "../VM";

/**
 * Stores full word in storage.
 */
export class SStoreOpcode extends Opcode {
  static id = 0x55;
  static type = "SSTORE";

  run(state: IMachineState, env: IEnvironment, vm: VM): void {
    const location = state.stack.pop().toString(16);
    const value = state.stack.pop().toString(16);

    // @todo use here updateAddress
    const account = vm.blockchain.getAddress(env.account);
    vm.blockchain.setAddress(env.account, {
      ...account,
      storage: {
        ...account.storage,
        [location]: value,
      },
    });
    state.pc += 1;
  }
}

/**
 * Loads full word from storage.
 */
export class SLoadOpcode extends Opcode {
  static id = 0x54;
  static type = "SLOAD";

  run(state: IMachineState, env: IEnvironment, vm: VM): void {
    const location = state.stack.pop().toString(16);
    const account = vm.blockchain.getAddress(env.account);
    const value = account.storage[location] || "0";

    state.stack.push(new BN(value, 16));
    state.pc += 1;
  }
}
