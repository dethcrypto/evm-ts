import { Opcode, notImplementedError } from "./common";
import { IMachineState } from "../VM";

export class StopOpcode extends Opcode {
  static id = 0x00;
  static type = "STOP";

  run(state: IMachineState): void {
    state.stopped = true;
  }
}

export class RevertOpcode extends Opcode {
  static id = 0xfd;
  static type = "REVERT";

  run(state: IMachineState): void {
    state.stopped = true;
    // @todo: proper impl
  }
}

export class ReturnOpcode extends Opcode {
  static id = 0xf3;
  static type = "RETURN";

  run(state: IMachineState): void {
    state.stopped = true;
    // @todo: proper impl
  }
}

export class BlockHashOpcode extends Opcode {
  static id = 0x40;
  static type = "BLOCKHASH";

  run(state: IMachineState): void {
    notImplementedError();
  }
}

export class Sha3Opcode extends Opcode {
  static id = 0x20;
  static type = "SHA3";

  run(state: IMachineState): void {
    notImplementedError();
  }
}

export class UnknownOpcode extends Opcode {
  static id = 0xd5;
  static type = "UNKNOWN";

  run(state: IMachineState): void {
    notImplementedError();
  }
}
export class Unknown2Opcode extends Opcode {
  static id = 0xf6;
  static type = "UNKNOWN";

  run(state: IMachineState): void {
    notImplementedError();
  }
}
export class Unknown3Opcode extends Opcode {
  static id = 0xce;
  static type = "UNKNOWN";

  run(state: IMachineState): void {
    notImplementedError();
  }
}
export class Unknown4Opcode extends Opcode {
  static id = 0xf;
  static type = "UNKNOWN";

  run(state: IMachineState): void {
    notImplementedError();
  }
}
export class Unknown5Opcode extends Opcode {
  static id = 0x2e;
  static type = "UNKNOWN";

  run(state: IMachineState): void {
    notImplementedError();
  }
}
