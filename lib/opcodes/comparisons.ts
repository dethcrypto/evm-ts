import { IMachineState } from "../VM";
import { Opcode } from "./common";
import { BN } from "bn.js";

export class LessThanOpcode extends Opcode {
  static id = 0x10;
  static type = "LT";

  run(state: IMachineState): void {
    const left = state.stack.pop();
    const right = state.stack.pop();

    const result = left.lt(right);

    state.stack.push(result ? new BN(0) : new BN(1));
  }
}
