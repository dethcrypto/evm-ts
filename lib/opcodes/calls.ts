import { VM } from "../VM";
import { Opcode } from "./common";
import { IMachineState, IEnvironment } from "../types";
import { arrayCopy, sliceAndEnsureLength } from "../utils/arrays";
import { BN } from "bn.js";

export class CallOpcode extends Opcode {
  static id = 0xf1;
  static type = "CALL";

  run(state: IMachineState, env: IEnvironment, vm: VM): void {
    const _gas = state.stack.pop();
    const addr = state.stack.pop();
    const value = state.stack.pop();
    const inOffset = state.stack.pop().toNumber();
    const inSize = state.stack.pop().toNumber();
    const retOffset = state.stack.pop().toNumber();
    const retSize = state.stack.pop().toNumber();

    const account = vm.blockchain.getAddress(addr.toString(16));
    const data = state.memory.slice(inOffset, inOffset + inSize);

    let callState: IMachineState;
    try {
      const runCodeResult = vm.runCode({ account, value, data, depth: env.depth + 1 });
      callState = runCodeResult.state;

      state.stack.push(new BN(1));

      const returnValue = sliceAndEnsureLength(callState.return || [], 0, retSize, 0);
      const newMemory = arrayCopy(state.memory, returnValue, retOffset);

      state.lastReturned = callState.return || [];
      state.memory = newMemory;
    } catch (e) {
      state.stack.push(new BN(0));
    }

    state.pc += 1;
  }
}
