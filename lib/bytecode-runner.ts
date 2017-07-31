import * as deepFreeze from 'deep-freeze'
import {Opcode} from "./opcodes/base";

const freeze: any = deepFreeze;  // @todo shitty typings

export interface MachineState {
    pc: number;
    stack: number[];
    memory: number[];
    stopped: boolean;
}

export type Environment = boolean[];

export default class BytecodeRunner {
    private _state: MachineState;
    get state(): MachineState {
        return this._state;
    }
    set state(state: MachineState) {
        this._state = freeze(state);
    }

    private environment: Environment;

    constructor(public program: Opcode[], env: Environment = []) {
        this.state = {
            pc: 0,
            stack: [],
            memory: [],
            stopped: false,
        }

        this.environment = freeze(env);
    }

    step() {
        if (this.state.stopped) {
            throw new Error("Machine stopped!");
        }

        const instruction = this.program[this.state.pc];

        if (!instruction) {
            this.state = {
                ...this.state,
                stopped: true
            };
            return;
        }

        this.state = instruction.run(this.environment, this.state);
    }

    run() {
        while (!this.state.stopped) {
            this.step();
        }
    }
}