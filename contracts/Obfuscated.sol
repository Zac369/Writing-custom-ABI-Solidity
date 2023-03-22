// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Obfuscated {
  fallback(bytes calldata data) external returns (bytes memory) {

    bytes32 bytesX;
    bytes32 bytesY;

    for (uint i = 0; i < data.length; ++i) {
      // for each byte
      for (uint j = 0; j < 8; ++j) {
        // get the bit at index j
        bytes1 singleBit = (data[i] >> j) & 0x01;
        // if j is even and the bit is set
        if (j % 2 == 0 && singleBit == 0x01) {
          // shift 1 to the correct index within the correct nibble then or it to only change that bit
          bytesY |= bytes32(uint(1)) << (j / 2) + 4 * (data.length - i - 1);
        // if j is odd and the bit is set
        } else if (singleBit == 0x01) {
          // shift 1 to the correct index within the correct nibble then or it to only change that bit
          bytesX |= bytes32(uint(1)) << (j / 2) + 4 * (data.length - i - 1);
        }
      }
    }

    uint x = uint(bytesX);
    uint y = uint(bytesY);

    return abi.encodePacked(18 * x * x + 32 * y + 24);
    }
}
