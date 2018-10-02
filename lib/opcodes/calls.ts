import { VM } from "../VM";
import { Opcode } from "./common";
import { IMachineState, IEnvironment } from "../types";
import { arrayCopy, sliceAndEnsureLength } from "../utils/arrays";
import { BN } from "bn.js";

export class CallOpcode extends Opcode {
  static id = 0xf1;
  static type = "CALL";

  run(state: IMachineState, env: IEnvironment, vm: VM): void {
    //tslint:disable-next-line
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
    // try {
    const runCodeResult = vm.runCode({
      account,
      caller: env.account,
      code: account.code,
      value,
      data,
      depth: env.depth + 1,
    });
    callState = runCodeResult.state;

    state.stack.push(new BN(1));

    const returnValue = sliceAndEnsureLength(callState.return || [], 0, retSize, 0);
    const newMemory = arrayCopy(state.memory, returnValue, retOffset);

    state.lastReturned = callState.return || [];
    state.memory = newMemory;
    // @todo error checking
    // } catch (e) {
    //   console.error(e);
    //   state.stack.push(new BN(0));
    // }

    state.pc += 1;
  }
}

export class DelegateCallOpcode extends Opcode {
  static id = 0xf4;
  static type = "DELEGATECALL";

  run(state: IMachineState, env: IEnvironment, vm: VM): void {
    //tslint:disable-next-line
    const _gas = state.stack.pop();
    const addr = state.stack.pop();
    const inOffset = state.stack.pop().toNumber();
    const inSize = state.stack.pop().toNumber();
    const retOffset = state.stack.pop().toNumber();
    const retSize = state.stack.pop().toNumber();

    const account = vm.blockchain.getAddress(addr.toString(16));
    const data = state.memory.slice(inOffset, inOffset + inSize);

    let callState: IMachineState;
    // try {
    const runCodeResult = vm.runCode({
      account: env.account,
      caller: env.caller,
      code: account.code,
      value: new BN(0),
      data,
      depth: env.depth + 1,
    });
    callState = runCodeResult.state;

    state.stack.push(new BN(1));

    const returnValue = sliceAndEnsureLength(callState.return || [], 0, retSize, 0);
    const newMemory = arrayCopy(state.memory, returnValue, retOffset);

    state.lastReturned = callState.return || [];
    state.memory = newMemory;
    // @todo error checking
    // } catch (e) {
    //   console.error(e);
    //   state.stack.push(new BN(0));
    // }

    state.pc += 1;
  }
}
