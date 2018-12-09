import { Opcode, WORD_SIZE } from "./common";
import { BN } from "bn.js";
import { MachineState } from "../types";

export class LessThanOpcode extends Opcode {
  static id = 0x10;
  static type = "LT";

  run(state: MachineState): void {
    const left = state.stack.pop();
    const right = state.stack.pop();

    const result = left.lt(right);

    state.stack.push(result ? new BN(1) : new BN(0));
    state.pc += 1;
  }
}

export class GreaterThanOpcode extends Opcode {
  static id = 0x11;
  static type = "GT";

  run(state: MachineState): void {
    const left = state.stack.pop();
    const right = state.stack.pop();

    const result = left.gt(right);

    state.stack.push(result ? new BN(1) : new BN(0));
    state.pc += 1;
  }
}

export class OrOpcode extends Opcode {
  static id = 0x17;
  static type = "OR";

  run(state: MachineState): void {
    const left = state.stack.pop();
    const right = state.stack.pop();

    const result = left.or(right);

    state.stack.push(result);
    state.pc += 1;
  }
}

export class NotOpcode extends Opcode {
  static id = 0x19;
  static type = "NOT";

  run(state: MachineState): void {
    const arg = state.stack.pop();

    const result = arg.notn(WORD_SIZE);

    state.stack.push(result);
    state.pc += 1;
  }
}
