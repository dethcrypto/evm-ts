import { BN } from "bn.js";

import { Opcode } from "./opcodes/common";

export interface IMachineState {
  pc: number;
  stack: BN[];
  memory: number[];
  stopped: boolean;
}
export type Environment = boolean[];

const initialState = {
  pc: 0,
  stack: [],
  memory: [],
  stopped: false,
};

export class BytecodeRunner {
  constructor(
    public program: Opcode[],
    public environment: Environment = [],
    public state = deepCloneState(initialState),
  ) {}

  step(): void {
    if (this.state.stopped) {
      throw new Error("Machine stopped!");
    }

    const instruction = this.program[this.state.pc];

    if (!instruction) {
      this.state = {
        ...this.state,
        stopped: true,
      };
      return;
    }

    // opcodes mutate states so we deep clone it first
    const newState = deepCloneState(this.state);
    instruction.run(this.environment, newState);
    this.state = newState;
  }

  run(): void {
    while (!this.state.stopped) {
      this.step();
    }
  }
}

function deepCloneState(state: IMachineState): IMachineState {
  return {
    pc: state.pc,
    stopped: state.stopped,
    stack: [...state.stack],
    memory: [...state.memory],
  };
}
