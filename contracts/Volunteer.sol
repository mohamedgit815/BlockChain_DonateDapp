// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./VolunteerInterface.sol";

contract Volunteer is VolunteerInterface{
    /// Variables
    address public owner;
    uint public countId;
    mapping(uint=>address) private foundrs;
    mapping(address=>bool) private successFoundrs;
    
    constructor() {
        owner = msg.sender;
    }

    modifier CheckOwner {

        require(owner == msg.sender , "This is Not Owner");
        _;
    }


    /// Functions 

    function donate() override external payable {
        address _user = msg.sender;
        require(msg.value > 0 ,"the Value is very little");

        if(!successFoundrs[_user]) {
            countId++;
            foundrs[countId] = _user;
            successFoundrs[_user] = true;
        }
    }


    function getBalanceAddress() public view returns(uint) {
        return address(this).balance; 
    }


    function withdraw(uint amount) CheckOwner override external {
        require(amount >= 1000000000000000000 , "The With Draw Amount is a Little" );
        payable(msg.sender).transfer(amount);
    }



}