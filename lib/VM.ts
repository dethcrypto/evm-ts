import { BN } from "bn.js";

import { Opcode } from "./opcodes/common";
import { Stack } from "./utils/Stack";
import { DeepReadonly } from "../@types/std";

export interface IMachineState {
  pc: number;
  stack: Stack<BN>;
  memory: number[];
  stopped: boolean;
}

export type IEnvironment = DeepReadonly<{
  value: BN;
}>;

const initialState: IMachineState = {
  pc: 0,
  stack: new Stack(),
  memory: [],
  stopped: false,
};

const initialEnvironment = {
  value: new BN(0),
};

export class VM {
  public readonly environment: IEnvironment;

  constructor(
    public program: Opcode[],
    environment: Partial<IEnvironment> = initialEnvironment,
    public state = deepCloneState(initialState),
  ) {
    this.environment = {
      ...initialEnvironment,
      ...environment,
    };
  }

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
    instruction.run(newState, this.environment);
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
    stack: new Stack(state.stack),
    memory: [...state.memory],
  };
}
