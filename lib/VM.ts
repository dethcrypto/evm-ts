import { BN } from "bn.js";
import StrictEventEmitter from "strict-event-emitter-types";

import { Stack } from "./utils/Stack";
import { DeepReadonly, TDictionary } from "../@types/std";
import { decodeOpcode } from "./decodeBytecode";
import { PeekableIterator } from "./utils/PeekableIterator";
import { EventEmitter } from "events";
import { Opcode } from "./opcodes/common";

export type TStorage = TDictionary<string>;

export interface IMachineState {
  pc: number;
  stack: Stack<BN>;
  memory: number[];
  storage: TStorage;
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
  storage: {},
  stopped: false,
};

const initialEnvironment: IEnvironment = {
  value: new BN(0),
  code: [],
  data: [],
};

export interface IStepContext {
  previousState: IMachineState;
  currentOpcode: Opcode;
}

interface IVmEvents {
  step: IStepContext;
}

const VmEventsEmitter: { new (): StrictEventEmitter<EventEmitter, IVmEvents> } = EventEmitter as any;

export class VM extends VmEventsEmitter {
  private environment: IEnvironment = initialEnvironment;
  private codeIterator?: PeekableIterator<number>;

  constructor(public state = deepCloneState(initialState)) {
    super();
  }

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

    // opcodes mutate states so we deep clone it first
    const newState = deepCloneState(this.state);

    if (this.state.pc >= this.environment.code.length) {
      newState.stopped = true;
      this.state = newState;
      return;
    }

    this.codeIterator.index = this.state.pc;
    const opcode = decodeOpcode(this.codeIterator);

    this.emit("step", { currentOpcode: opcode, previousState: this.state });

    try {
      opcode.run(newState, this.environment);
    } catch (e) {
      throw new Error(`Error while running ${opcode.type} at position ${this.state.pc}: ${e.message}`);
    }
    this.state = newState;
  }

  runCode(environment: Partial<IEnvironment> = initialEnvironment, storage?: TStorage): { state: IMachineState } {
    this.environment = { ...initialEnvironment, ...environment, value: environment.value || initialEnvironment.value };
    this.codeIterator = new PeekableIterator(this.environment.code);
    this.state = deepCloneState(initialState);
    if (storage) {
      this.state.storage = storage;
    }

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
    storage: { ...state.storage },
  };
}
