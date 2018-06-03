import { Environment, IMachineState } from "../bytecode-runner";

export abstract class Opcode {
  public id: number;
  public type: string;

  constructor() {
    // id & type are static member of the class so we rewire these fields to constructor to make debugging easier
    this.id = (this.constructor as any).id;
    this.type = (this.constructor as any).type;
  }

  abstract run(environment: Environment, state: IMachineState): IMachineState;
}
