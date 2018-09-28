pragma solidity ^0.4.17;

contract Counter {
    uint256 counter;
    constructor() public {
      counter = 0;
    }

    function trigger() public {
      counter += 1;
    }

    function triggerAndReturn() public returns(uint256) {
      counter += 1;
      return counter;
    }
}