import { decodeBytecode } from "./decodeBytecode";
import { BytecodeRunner, IMachineState } from "./BytecodeRunner";

export function runEvm(bytecode: string): IMachineState {
  const opcodes = decodeBytecode(bytecode);

  const bytecodeRunner = new BytecodeRunner(opcodes);

  bytecodeRunner.run();

  return bytecodeRunner.state;
}
