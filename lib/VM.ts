import { BN } from "bn.js";

import { Stack } from "./utils/Stack";
import { DeepReadonly } from "../@types/std";
import { decodeOpcode } from "./decodeBytecode";
import { PeekableIterator } from "./utils/PeekableIterator";

/**
 * Blockchain class:
 *  - globalstate:
 *      - address => (value, code, storage)
 *  - runTx { to?, value, data? } "to" or "data" has to be provided
 * VM class becomes a function?:
 *  - CODE becomes part of environment - immutable [DONE]
 *  - calls EVMJS's run code, implemented by adding optional return? to state  [DONE]
 * -
 *  - RETURN will return from getCode [DONE]
 *  -
 *
 */

export interface IMachineState {
  pc: number;
  stack: Stack<BN>;
  memory: number[];
  stopped: boolean;
  return?: ReadonlyArray<number>;
}

export type IEnvironment = DeepReadonly<{
  value: BN;
  data: number[];
  code: number[];
}>;

const initialState: IMachineState = {
  pc: 0,
  stack: new Stack(),
  memory: [],
  stopped: false,
};

const initialEnvironment: IEnvironment = {
  value: new BN(0),
  code: [],
  data: [],
};

export class VM {
  private environment: IEnvironment = initialEnvironment;
  private codeIterator?: PeekableIterator<number>;

  constructor(public state = deepCloneState(initialState)) {}

  private step(): void {
    if (this.state.stopped) {
      throw new Error("Machine stopped!");
    }
    if (!this.environment.code || !this.codeIterator) {
      throw new Error("No code to execute");
    }
    if (!this.environment) {
      throw new Error("No environment to execute");
    }

    const newState = deepCloneState(this.state);

    if (this.state.pc >= this.environment.code.length) {
      newState.stopped = true;
      this.state = newState;
      return;
    }

    this.codeIterator.index = this.state.pc;
    const opcode = decodeOpcode(this.codeIterator);

    // opcodes mutate states so we deep clone it first
    try {
      opcode.run(newState, this.environment);
    } catch (e) {
      throw new Error(`Error while running ${opcode.type} at position ${this.state.pc}: ${e.message}`);
    }
    this.state = newState;
  }

  runCode(environment: Partial<IEnvironment> = initialEnvironment): { state: IMachineState } {
    this.environment = { ...initialEnvironment, ...environment, value: environment.value || initialEnvironment.value };
    this.codeIterator = new PeekableIterator(this.environment.code);
    this.state.stopped = false;
    this.state.pc = 0;

    while (!this.state.stopped) {
      this.step();
    }

    return {
      state: this.state,
    };
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
