pragma solidity ^0.4.17;

import "./Counter.sol";

contract Caller {
    Counter counter;
    constructor(Counter _counter) public {
      counter = _counter;
    }

    function performCall() public {
      counter.trigger();
    }
}