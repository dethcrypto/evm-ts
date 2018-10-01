import { VM } from "../VM";
import { IMachineState, IEnvironment } from "../types";

export abstract class Opcode {
  public id: number;
  public type: string;

  constructor(id?: number, type?: string) {
    // id & type are static member of the class so we rewire these fields to constructor to make debugging easier
    this.id = id || (this.constructor as any).id;
    this.type = type || (this.constructor as any).type;
  }

  // it should mutate input data. VM makes sure to clone them first
  abstract run(state: IMachineState, env: IEnvironment, vm: VM): void;
}

export const WORD_SIZE = 256;

export class DecodeError extends Error {
  constructor(public readonly index: number, public readonly opcode: string) {
    super(`Decoding ${opcode} failed at ${index} byte of the bytecode`);
  }
}

export class UnknownOpcodeError extends Error {
  constructor(public readonly index: number, public readonly opcode: number) {
    super(`Unknown opcode: 0x${opcode.toString(16)} at ${index} byte of the bytecode`);
  }
}

export function notImplementedError(): never {
  throw new Error("Not implemented yet!");
}
