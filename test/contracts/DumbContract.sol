pragma solidity ^0.4.17;

contract DumbContract {
    uint256 a;
    function C() {
      a = 666;
    }

    function test() public returns (uint256) {
      a += 1;
      return 5;
    }
}