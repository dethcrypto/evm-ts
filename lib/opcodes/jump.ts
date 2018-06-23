import { Opcode } from "./common";
import { IMachineState } from "../VM";

export class JumpOpcode extends Opcode {
  static id = 0x56;
  static type = "JUMP";

  run(state: IMachineState): void {
    const jumpDestination = state.stack.pop();

    // @todo: validation of jump destination is missing here
    state.pc = jumpDestination.toNumber();
  }
}

export class JumpIOpcode extends Opcode {
  static id = 0x57;
  static type = "JUMPI";

  run(state: IMachineState): void {
    const jumpDestination = state.stack.pop();
    const jumpCondition = state.stack.pop();

    const jump = !jumpCondition.isZero();

    if (jump) {
      // @todo: validation of jump destination is missing here
      state.pc = jumpDestination.toNumber();
    } else {
      state.pc += 1;
    }
  }
}

export class JumpDestOpcode extends Opcode {
  static id = 0x5b;
  static type = "JUMPDEST";

  run(state: IMachineState): void {
    state.pc += 1;
  }
}
