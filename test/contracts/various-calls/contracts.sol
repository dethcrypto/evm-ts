pragma solidity ^0.4.17;

// this example shows CALL, DELEGATECALL and CALLCODE differences

contract Caller {
  uint public n;
  address public sender;
  Code public code;

  constructor(Code _code) public {
    code = _code;
  }

  function callSetN(uint _n, bool _revert) public returns (bool) {
    return address(code).call(bytes4(keccak256("setN(uint256,bool)")), _n, _revert); // Code's storage is set, Caller is not modified 
  }

  function callcodeSetN(uint _n, bool _revert) public returns (bool) {
    return address(code).callcode(bytes4(keccak256("setN(uint256,bool)")), _n, _revert); // Code's storage is set, Caller is not modified 
  }

  function delegatecallSetN(uint _n, bool _revert) public returns (bool) {
    return address(code).delegatecall(bytes4(keccak256("setN(uint256,bool)")), _n, _revert); // Code's storage is set, Caller is not modified 
  }

  // this is mostly useful for testing reverts
  function solCallSetN(uint _n, bool _revert) public {
    sender = msg.sender;
    code.setN(_n, _revert);
  }

  // tests mutual access during call
  function trampoline(uint _n, bool _revert) public {
    n += _n;
    code.setNFromCaller(this, _revert);
  }
}

contract Code {
  uint public n;
  address public sender;

  function setN(uint _n, bool _revert) public {
    n = _n;
    sender = msg.sender;
    // msg.sender is D if invoked by D's callcodeSetN. None of E's storage is updated
    // msg.sender is C if invoked by C.foo(). None of E's storage is updated

    // the value of "this" is D, when invoked by either D's callcodeSetN or C.foo()

    if (_revert) {
      revert();
    }
  }

  function setNFromCaller(Caller caller, bool _revert) public {
    n = caller.n();
    
    if (_revert) {
      revert();
    }
  }
}