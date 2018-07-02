import { Opcode } from "./common";
import { IMachineState } from "../VM";
import { MAX_UINT_256 } from "../utils/bytes";
import { BN } from "bn.js";

export class AddOpcode extends Opcode {
  static id = 0x01;
  static type = "ADD";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.add(arg2).mod(MAX_UINT_256);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class MulOpcode extends Opcode {
  static id = 0x02;
  static type: "MUL";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.mul(arg2).mod(MAX_UINT_256);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class IsZeroOpcode extends Opcode {
  static id = 0x15;
  static type: "ISZERO";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();

    const result = arg1.isZero() ? new BN(1) : new BN(0);

    state.pc += 1;
    state.stack.push(result);
  }
}
