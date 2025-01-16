// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleERC20 {
    // Variables
    string public name = "Simple Token";
    string public symbol = "SIM";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public buyRate = 1000; // Number of SIM tokens per 1 ETH when buying
    uint256 public sellRate = 1100; // Number of SIM tokens to sell for 1 ETH
    address public owner; // The creator of the contract

    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Burn(address indexed burner, uint256 value); // Event for burning tokens

    // Constructor
    constructor(uint256 _initialSupply) {
        owner = msg.sender; // Set the deployer as the owner
        totalSupply = _initialSupply * (10 ** uint256(decimals));
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Transfer function
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Approve function
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // TransferFrom function
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // Payable function to buy tokens
    function buyTokens() public payable {
        require(msg.value > 0, "Must send some Ether");

        uint256 tokensToBuy = msg.value * buyRate; // Calculate the number of tokens to transfer
        require(balanceOf[address(this)] >= tokensToBuy, "Not enough tokens in the contract");

        balanceOf[address(this)] -= tokensToBuy;
        balanceOf[msg.sender] += tokensToBuy;

        emit Transfer(address(this), msg.sender, tokensToBuy);
    }

    // Function to sell tokens for ETH
    function sellTokens(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero");
        require(balanceOf[msg.sender] >= _amount, "Insufficient token balance");

        uint256 etherToTransfer = _amount / sellRate; // Calculate Ether to send
        require(address(this).balance >= etherToTransfer, "Insufficient Ether in contract");

        balanceOf[msg.sender] -= _amount;
        balanceOf[address(this)] += _amount;

        payable(msg.sender).transfer(etherToTransfer); // Transfer Ether to the seller

        emit Transfer(msg.sender, address(this), _amount);
    }

    // Function to withdraw Ether from the contract (restricted to owner)
    function withdrawEther() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No Ether to withdraw");
        payable(msg.sender).transfer(balance);
    }

    // Burn function
    function burn(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero");
        require(balanceOf[msg.sender] >= _amount, "Insufficient token balance");

        balanceOf[msg.sender] -= _amount; // Reduce the sender's balance
        totalSupply -= _amount; // Decrease the total supply

        emit Burn(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount); // Emit a transfer to the zero address
    }
}
