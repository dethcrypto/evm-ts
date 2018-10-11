import StrictEventEmitter from "strict-event-emitter-types";

import { Stack } from "./utils/Stack";
import { decodeOpcode } from "./decodeBytecode";
import { PeekableIterator } from "./utils/PeekableIterator";
import { EventEmitter } from "events";
import { merge } from "lodash";
import { IEnvironment, IMachineState, IVmEvents, IBlockchain } from "./types";
import { LayeredMap } from "./utils/LayeredMap";

const initialState: IMachineState = {
  pc: 0,
  stopped: false,
  reverted: false,
  stack: new Stack(),
  memory: [],
  storage: new LayeredMap(),
  lastReturned: [],
};

const VmEventsEmitter: { new (): StrictEventEmitter<EventEmitter, IVmEvents> } = EventEmitter as any;

export class VM extends VmEventsEmitter {
  constructor(public blockchain: IBlockchain) {
    super();
  }

  runCode(environment: IEnvironment): { state: IMachineState } {
    const account = environment.account;
    const code = environment.code;

    const codeIterator = new PeekableIterator(code);
    let state = merge({}, deepCloneState(initialState), { storage: account.storage });

    while (!state.stopped) {
      // opcodes mutate states so we deep clone it first
      const newState = deepCloneState(state);

      const isFinished = state.pc >= code.length;
      if (isFinished) {
        newState.stopped = true;
        state = newState;
        break;
      }

      codeIterator.index = state.pc;
      const opcode = decodeOpcode(codeIterator);

      this.emit("step", { currentOpcode: opcode, previousState: state, previousEnv: environment, vm: this });

      try {
        opcode.run(newState, environment, this);
      } catch (e) {
        // just for debugging purposes
        // @todo we can do better by wrapping any errors in listeners and pushing them forward
        if (environment.depth !== 0 || e.showDiff) {
          throw e;
        }
        throw new Error(`Error while running ${opcode.type} at position ${state.pc}: ${e.message}`);
      }
      state = newState;
    }

    // finally update storage
    account.storage = state.storage;

    return {
      state,
    };
  }
}

function deepCloneState(state: IMachineState): IMachineState {
  return {
    pc: state.pc,
    stopped: state.stopped,
    reverted: state.reverted,
    stack: new Stack(state.stack),
    memory: [...state.memory],
    storage: state.storage.clone(),
    lastReturned: [...state.lastReturned],
  };
}
