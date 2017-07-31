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

test('BytecodeRunner should not allow to mutate state by opcodes', () => {
    class StateMutatingOpcode extends opcodes.Opcode {
        run(state) {
            state.stack.push(6);
            return Object.assign(state, {
                ip: state.ip + 1,
            });
        }
    }

    const input = [
        new StateMutatingOpcode(),
    ];
    const expected = 'Cannot add property 0, object is not extensible';

    const bytecodeRunner = new BytecodeRunner(input);
    expect(() => bytecodeRunner.run()).to.throw(Error, expected);
});