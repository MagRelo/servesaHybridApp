pragma solidity ^0.5.0;

contract SimpleStorage {
  address public lastUpdatedBy;
  uint256 public value;

  function saveSender(uint256  _value) public {
    lastUpdatedBy = msg.sender;
    value = _value;  
  }

}
