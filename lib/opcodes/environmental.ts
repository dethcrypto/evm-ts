import { BN } from "bn.js";

import { Opcode } from "./common";
import { sliceAndEnsureLength } from "../utils/arrays";
import { MachineState, Environment } from "../types";
import { VM } from "../VM";

export class LoadCallData extends Opcode {
  static id = 0x35;
  static type = "CALLDATALOAD";
  static bytesToRead = 32;

  run(state: MachineState, env: Environment): void {
    const readIndex = state.stack.pop().toNumber();

    const data = sliceAndEnsureLength(env.data, readIndex, LoadCallData.bytesToRead, 0);
    const dataAsNumber = new BN(data);

    state.stack.push(dataAsNumber);
    state.pc += 1;
  }
}

export class CallValueOpcode extends Opcode {
  static id = 0x34;
  static type = "CALLVALUE";

  run(state: MachineState, env: Environment): void {
    state.stack.push(env.value || new BN(0));
    state.pc += 1;
  }
}

export class CallDataSizeOpcode extends Opcode {
  static id = 0x36;
  static type = "CALLDATASIZE";

  run(state: MachineState, env: Environment): void {
    const size = new BN(env.data.length);

    state.stack.push(size);
    state.pc += 1;
  }
}

export class ExtCodeSizeOpcode extends Opcode {
  static id = 0x3b;
  static type = "EXTCODESIZE";

  run(state: MachineState, _env: Environment, vm: VM): void {
    const addr = state.stack.pop();

    const account = vm.blockchain.getAddress(addr.toString(16));

    const accountCodeSize = account.code.length;

    state.stack.push(new BN(accountCodeSize));
    state.pc += 1;
  }
}

export class GasOpcode extends Opcode {
  static id = 0x5a;
  static type = "GAS";

  run(state: MachineState): void {
    // @todo hardcoded value since we dont do any gas calculation for now
    if (process.env.NODE_ENV === "test") {
      const gasValue = (global as any).getStackValueFromJsEVM();

      state.stack.push(new BN(gasValue));
    } else {
      state.stack.push(new BN(100000));
    }
    state.pc += 1;
  }
}

export class CallerOpcode extends Opcode {
  static id = 0x33;
  static type = "CALLER";

  run(state: MachineState, env: Environment): void {
    const address = new BN(env.caller, 16);

    state.stack.push(address);
    state.pc += 1;
  }
}

export class AddressOpcode extends Opcode {
  static id = 0x30;
  static type = "ADDRESS";

  run(state: MachineState, env: Environment): void {
    const address = new BN(env.account, 16);

    state.stack.push(address);
    state.pc += 1;
  }
}
