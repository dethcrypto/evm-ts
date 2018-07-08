import { BN } from "bn.js";

import { Opcode } from "./common";
import { IEnvironment, IMachineState } from "../VM";

export class LoadCallData extends Opcode {
  static id = 0x35;
  static type = "CALLDATALOAD";

  run(state: IMachineState, env: IEnvironment): void {
    const readIndex = state.stack.pop().toNumber();

    const data = env.data.slice(readIndex, readIndex + 32);
    const dataAsNumber = new BN(data);

    state.stack.push(dataAsNumber);
    state.pc += 1;
  }
}

export class CallValueOpcode extends Opcode {
  static id = 0x34;
  static type = "CALLVALUE";

  run(state: IMachineState, env: IEnvironment): void {
    state.stack.push(env.value);
    state.pc += 1;
  }
}

export class CallDataSizeOpcode extends Opcode {
  static id = 0x36;
  static type = "CALLDATASIZE";

  run(state: IMachineState, env: IEnvironment): void {
    const size = new BN(env.data.length);

    state.stack.push(size);
    state.pc += 1;
  }
}
