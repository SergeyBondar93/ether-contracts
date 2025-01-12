// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 private count;

    // Define events
    event Incremented(address indexed caller, uint256 newCount);
    event Decremented(address indexed caller, uint256 newCount);

    constructor() {
        count = 0;
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function increment() public {
        count += 1;
        emit Incremented(msg.sender, count); // Emit event
    }

    function decrement() public {
        require(count > 0, "Counter: count cannot go below zero");
        count -= 1;
        emit Decremented(msg.sender, count); // Emit event
    }
}
