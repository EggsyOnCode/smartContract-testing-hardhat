// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract TokenTransfer {
    //data strucutres
    address public owner;
    uint private count_tx = 0;
    struct ToGet {
        address receiver;
        address payer;
        uint amt;
    }
    mapping(uint => ToGet) public ledger;

    //constructor
    constructor() {
        owner = msg.sender;
    }

    //modifiers
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the owner is authorized to execute the payment"
        );
        _;
    }

    //functions

    function transfer(
        address payable _to,
        uint amt
    ) external payable onlyOwner returns (bool) {
        (bool success, ) = _to.call{value: amt}("");
        if (success) {
            ToGet memory newToGet = ToGet(_to, msg.sender, amt);
            ledger[count_tx++] = newToGet;
            return true;
        } else {
            return false;
        }
    }
}
