import {Opcode} from "./opcodes";

export interface MachineState {
    pc: number;
    stack: number[];
    memory: number[];
    stopped: boolean;
}

export default class BytecodeRunner {
    public state: MachineState;

    constructor(public program: Opcode[]) {
        this.state = {
            pc: 0,
            stack: [],
            memory: [],
            stopped: false,
        }
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

        const newState = instruction.run({...this.state});

        this.state = newState;
    }

    run() {
        while (!this.state.stopped) {
            this.step();
        }
    }
}