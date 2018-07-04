import { Opcode, notImplementedError } from "./common";
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

  run(_state: IMachineState): void {
    notImplementedError();
  }
}

export class DivOpcode extends Opcode {
  static id = 0x04;
  static type = "DIV";

  run(_state: IMachineState): void {
    notImplementedError();
  }
}

export class IsZeroOpcode extends Opcode {
  static id = 0x15;
  static type = "ISZERO";

  run(state: IMachineState): void {
    const arg1 = state.stack.pop();

    const result = arg1.isZero() ? new BN(1) : new BN(0);

    state.pc += 1;
    state.stack.push(result);
  }
}

export class AndOpcode extends Opcode {
  static id = 0x16;
  static type = "AND";

  run(_state: IMachineState): void {
    notImplementedError();
  }
}

export class EqOpcode extends Opcode {
  static id = 0x14;
  static type = "EQ";

  run(_state: IMachineState): void {
    notImplementedError();
  }
}
