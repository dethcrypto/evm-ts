import test from 'ava';
import { expect } from 'chai';

import { LoadCallData } from '../../lib/opcodes/environmental'

test('LoadCallData should load data from environment', () => {
    const loadCallData = new LoadCallData();
    const env = Array.from(Array(5)).map(() => 0);
    env[30] = 1;
    env[31] = 1;
    const state = {
        stack : [0]
    };

    const expected = {
        state: [3]
    };

    const actual = loadCallData.run(env, state);

    expect(actual).to.be.deep.eq(expected);
});