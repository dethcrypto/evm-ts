import { BN } from "bn.js";

import { Opcode } from "./common";
import { MAX_UINT_256 } from "../utils/bytes";
import { IMachineState } from "../types";

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
  static type = "MUL";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.mul(arg2).mod(MAX_UINT_256);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class SubOpcode extends Opcode {
  static id = 0x03;
  static type = "SUB";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.sub(arg2).mod(MAX_UINT_256);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class DivOpcode extends Opcode {
  static id = 0x04;
  static type = "DIV";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.div(arg2).mod(MAX_UINT_256);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class ExpOpcode extends Opcode {
  static id = 0x0a;
  static type = "EXP";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.pow(arg2).mod(MAX_UINT_256);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class IsZeroOpcode extends Opcode {
  static id = 0x15;
  static type = "ISZERO";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();

    const result = arg1.isZero() ? new BN(1) : new BN(0);

    state.stack.push(result);
    state.pc += 1;
  }
}

export class AndOpcode extends Opcode {
  static id = 0x16;
  static type = "AND";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.and(arg2);

    state.stack.push(result);
    state.pc += 1;
  }
}

export class EqOpcode extends Opcode {
  static id = 0x14;
  static type = "EQ";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();
    const arg2 = state.stack.pop();

    const result = arg1.eq(arg2);

    state.stack.push(result ? new BN(1) : new BN(0));
    state.pc += 1;
  }
}
