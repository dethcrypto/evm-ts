import { keccak256 } from "ethereumjs-util";
import { Opcode, notImplementedError } from "./common";
import { BN } from "bn.js";
import { MachineState } from "../types";
import { sliceAndEnsureLength, arrayCopy } from "../utils/arrays";

export class StopOpcode extends Opcode {
  static id = 0x00;
  static type = "STOP";

  run(state: MachineState): void {
    state.stopped = true;
  }
}

export class RevertOpcode extends Opcode {
  static id = 0xfd;
  static type = "REVERT";

  run(state: MachineState): void {
    state.stopped = true;
    state.reverted = true;
  }
}

export class ReturnOpcode extends Opcode {
  static id = 0xf3;
  static type = "RETURN";

  run(state: MachineState): void {
    const offset = state.stack.pop().toNumber();
    const size = state.stack.pop().toNumber();

    const ret = state.memory.slice(offset, offset + size);

    state.return = ret;
    state.stopped = true;
  }
}

export class ReturnDataSizeOpcode extends Opcode {
  static id = 0x3d;
  static type = "RETURNDATASIZE";

  run(state: MachineState): void {
    const lastReturnSize = state.lastReturned.length;

    state.stack.push(new BN(lastReturnSize));
    state.pc += 1;
  }
}

export class ReturnDataCopyOpcode extends Opcode {
  static id = 0x3e;
  static type = "RETURNDATACOPY";

  run(state: MachineState): void {
    const memOffset = state.stack.pop().toNumber();
    const offset = state.stack.pop().toNumber();
    const length = state.stack.pop().toNumber();

    const result = sliceAndEnsureLength(state.lastReturned, offset, length, 0); // @todo it should throw when reaching out of array
    state.memory = arrayCopy(state.memory, result, memOffset);
    state.pc += 1;
  }
}

export class BlockHashOpcode extends Opcode {
  static id = 0x40;
  static type = "BLOCKHASH";

  run(_state: MachineState): void {
    notImplementedError();
  }
}

export class Sha3Opcode extends Opcode {
  static id = 0x20;
  static type = "SHA3";

  run(state: MachineState): void {
    const memoryOffset = state.stack.pop().toNumber();
    const memorySize = state.stack.pop().toNumber();

    const data = state.memory.slice(memoryOffset, memoryOffset + memorySize);

    const result = keccak256(data);

    state.stack.push(new BN(result));
    state.pc += 1;
  }
}
