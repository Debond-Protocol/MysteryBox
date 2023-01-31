pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MysteryBoxToken is ERC20, Ownable {
  using ECDSA for bytes32;

  uint256 public startingTime;
  uint256 public endingTime;
  uint256 public duration;
  bool public saleOn;
  mapping(address => bool) public discountClaimed;
  bool hasStarted;

  constructor(
    string memory name_,
    string memory symbol_,
    uint256 _duration
  ) ERC20(name_, symbol_) {
    //        startingTime = block.timestamp;
    duration = _duration;
  }

  /**
   * @notice this function is only called once
   */
  function startTime() external onlyOwner {
    require(!hasStarted);
    startingTime = block.timestamp;
    endingTime = block.timestamp + duration;
    hasStarted = true;
  }

  modifier isDiscountAuthorized(uint256 discount, bytes memory signature) {
    require(verifySignature(discount, signature) == owner(), "caller not authorized to get discount");
    _;
  }

  function verifySignature(uint256 discount, bytes memory signature) internal view returns (address) {
    return keccak256(abi.encodePacked(address(this), msg.sender, discount)).toEthSignedMessageHash().recover(signature);
  }

  function decimals() public view virtual override returns (uint8) {
    return 0;
  }

  //@YU: This function gives the price now
  function getMintingPrice() public view virtual returns (uint256) {
    if (startingTime == 0) {
      return 2e17;
    }
    //The percentage of time passed
    uint256 percentageTimePassed = ((block.timestamp - startingTime) * 100) / duration;
    return 2e17 + (3e17 * percentageTimePassed) / 100;
  }

  //front end get minting price () first then put the price in to payable parameter
  function mint(uint256 amount) external payable {
    require(saleOn, "Sale is off");
    require(msg.value >= amount * getMintingPrice());
    //after the transfer of eth mint token.
    _mint(msg.sender, amount); //todo done here
  }

  function mintDiscount(uint256 _discount, bytes memory _signature) external payable isDiscountAuthorized(_discount, _signature) {
    require(saleOn == true, "Sale is Off");
    if (endingTime != 0) {
      require(block.timestamp < endingTime, "Sale has expired");
    }
    require(!discountClaimed[msg.sender], "caller already used his discount");
    require(_discount > 0 && _discount < 100, "discount must be between 0 and 100");
    require(msg.value >= (getMintingPrice() * (100 - _discount)) / 100, "missing ETH");
    _mint(msg.sender, 1);
    discountClaimed[msg.sender] = true;
  }

  function setSaleOn() external onlyOwner {
    require(saleOn == false, "Sale already On.");
    saleOn = true;
  }

  function setSaleOff() external onlyOwner {
    require(saleOn == true, "Sale already Off.");
    saleOn = false;
  }

  function withdrawToOwner() external onlyOwner {
    uint256 _amount = address(this).balance;
    require(_amount > 0, "No ETH to Withdraw");
    payable(_msgSender()).transfer(_amount);
  }
}
