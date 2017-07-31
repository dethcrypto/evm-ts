import {Environment, MachineState} from "../bytecode-runner";
import {Opcode} from "./base";

export class MStoreOpcode extends Opcode {
    static id = 0x52;
    static type = 'MSTORE';

    run(env: Environment, state: MachineState): MachineState {
        throw new Error("Unimplemented!");
    }
}
