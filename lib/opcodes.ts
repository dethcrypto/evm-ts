import {MachineState} from "./bytecode-runner";
import {getIndex} from "./utils";

export abstract class Opcode {
    public id: number;
    public type: string;

    constructor() {
        this.id = (this.constructor as any).id;
        this.type = (this.constructor as any).type;
    }

    abstract run(state: MachineState): MachineState;
}

export class StopOpcode extends Opcode {
    static id = 0x00;
    static type = 'STOP';

    run(state: MachineState): MachineState {
        return {
            ...state,
            stopped: true,
        }
    }
}

export class AddOpcode extends Opcode {
    static id = 0x01;
    static type = 'ADD';

    run(state: MachineState): MachineState {
        const arg1 = getIndex(state.stack, -1);
        const arg2 = getIndex(state.stack, -2);

        if (arg1 === null || arg1 === undefined) {
            throw new Error("Error while adding. Arg1 is undefined!")
        }

        if (arg2 === null || arg2 === undefined) {
            throw new Error("Error while adding. Arg2 is undefined!")
        }

        const result = arg1 + arg2;

        return {
            ...state,
            pc: state.pc + 1,
            stack: [...state.stack.slice(0, -2), result],
        };
    }
}

export class MulOpcode extends Opcode {
    static id = 0x02;
    static type: 'MUL';

    run(state: MachineState): MachineState {
        // @todo use something nice to handle work with immutable data structures
        const arg1 = state.stack.pop();
        const arg2 = state.stack.pop();

        if (arg1 === null || arg1 === undefined) {
            throw new Error("Error while adding. Arg1 is undefined!")
        }

        if (arg2 === null || arg2 === undefined) {
            throw new Error("Error while adding. Arg2 is undefined!")
        }

        const result = arg1 * arg2;

        state.stack.push(result);
        state.pc++;

        return state;
    }
}

export class PushOpcode extends Opcode {
    static id = 0x60;
    static type = 'PUSH1';

    constructor(public arg: number) {
        super();

        // @todo handle undefined cases with helpers (lodash?, require?)
        if (arg === undefined) {
            throw new Error("Argument to PUSH opcode is missing!")
        }
    }

    run(state: MachineState): MachineState {
        return {
            ...state,
            stack: [...state.stack, this.arg],
            pc: state.pc + 1
        };
    }
}

export class MStoreOpcode extends Opcode {
    static id = 0x52;
    static type = 'MSTORE';

    run(state: MachineState): MachineState {
        throw new Error("Unimplemented!");
    }
}
