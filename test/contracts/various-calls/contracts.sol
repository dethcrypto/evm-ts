pragma solidity ^0.4.17;

// this example shows CALL, DELEGATECALL and CALLCODE differences

contract Caller {
  uint public n;
  address public sender;
  Code public code;

  constructor(Code _code) public {
    code = _code;
  }

  function callSetN(uint _n) public returns (bool) {
    return address(code).call(bytes4(keccak256("setN(uint256)")), _n); // E's storage is set, D is not modified 
  }

  function callcodeSetN(uint _n) public returns (bool) {
    return address(code).callcode(bytes4(keccak256("setN(uint256)")), _n); // D's storage is set, E is not modified 
  }

  function delegatecallSetN(uint _n) public returns (bool) {
    return address(code).delegatecall(bytes4(keccak256("setN(uint256)")), _n); // D's storage is set, E is not modified 
  }
}

contract Code {
  uint public n;
  address public sender;

  function setN(uint _n) public {
    n = _n;
    sender = msg.sender;
    // msg.sender is D if invoked by D's callcodeSetN. None of E's storage is updated
    // msg.sender is C if invoked by C.foo(). None of E's storage is updated

    // the value of "this" is D, when invoked by either D's callcodeSetN or C.foo()
  }
}