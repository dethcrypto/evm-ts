import test from 'ava';
import { expect } from 'chai';

import BytecodeRunner from '../lib/bytecode-runner';
import * as opcodes from '../lib/opcodes'

test('BytecodeRunner should run simple program', () => {
    const input = [
        new opcodes.PushOpcode(1),
        new opcodes.PushOpcode(2),
        new opcodes.AddOpcode(),
    ];
    const expectedState = {
        pc: 3,
        stopped: true,
        stack: [3],
        memory: []
    };

    const bytecodeRunner = new BytecodeRunner(input);
    bytecodeRunner.run();
    expect(bytecodeRunner.state).to.deep.eq(expectedState);
});