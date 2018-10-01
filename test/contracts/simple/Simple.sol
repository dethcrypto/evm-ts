pragma solidity ^0.4.17;

/** 
Tests:
  - method calls
  - persistent storage
*/
contract Simple {
    uint256 a;
    constructor() public {
      a = 666;
    }

    function test() public returns (uint256) {
      a += 1;
      return 5;
    }
}