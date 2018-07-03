import { BN } from "bn.js";

import { Stack } from "./utils/Stack";
import { DeepReadonly } from "../@types/std";
import { IProgram } from "./decodeBytecode";

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
    public program: IProgram,
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

    const instructionIndex = this.program.sourceMap[this.state.pc];

    if (instructionIndex === undefined) {
      this.state = {
        ...this.state,
        stopped: true,
      };
      return;
    }
    const instruction = this.program.opcodes[instructionIndex];

    // opcodes mutate states so we deep clone it first
    const newState = deepCloneState(this.state);
    try {
      instruction.run(newState, this.environment);
    } catch (e) {
      throw new Error(`Error while running bytecode at ${this.state.pc}: ${e.message}`);
    }
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