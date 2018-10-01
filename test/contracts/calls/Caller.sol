pragma solidity ^0.4.17;

import "./Counter.sol";

contract Caller {
    Counter counter;
    uint256 returnVal;
    constructor(Counter _counter) public {
      counter = _counter;
      returnVal = 0;
    }

    function performCall() public {
      // tests CALL without return value
      counter.trigger();
    }

    function performCallAndSaveReturn() public {
      // tests CALL with return value
      returnVal = counter.triggerAndReturn();
    }
}