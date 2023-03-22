
// Needs to return tx.data with 0x in the front
function encode(x, y) {
  // Convert to binary
  let binaryX = x.toString(2);
  let binaryY = y.toString(2);
  // Get the lengths
  const lengthX = binaryX.length;
  const lengthY = binaryY.length;
  // find the larger length and pad both values to that length
  const largerValue = lengthX > lengthY ? lengthX : lengthY
  binaryX = binaryX.padStart(largerValue, '0');
  binaryY = binaryY.padStart(largerValue, '0');

  let outputBinary = "";
  // starting from the leftmost digit take 1 digit from x then 1 digit from y then 1 digit from x, etc.
  for (let i = 0; i < largerValue; i++) {
    outputBinary += binaryX[i];
    outputBinary += binaryY[i];
  }

  // Convert to hex for solidity
  // Need to use BigInt to avoid loss of precision
  let hexValue = parseBigInt(outputBinary, 2).toString(16);

  // Make length even for Solidity
  if (hexValue.length % 2 != 0) {
    hexValue = "0" + hexValue;
  }
  
  return "0x" + hexValue;
}

// https://stackoverflow.com/questions/39334494/converting-large-numbers-from-binary-to-decimal-and-back-in-javascript/55681265#55681265
function parseBigInt(str, base=10) {
  base = BigInt(base)
  var bigint = BigInt(0)
  for (var i = 0; i < str.length; i++) {
    var code = str[str.length-1-i].charCodeAt(0) - 48; if(code >= 10) code -= 39
    bigint += base**BigInt(i) * BigInt(code)
  }
  return bigint
}

exports.encode = encode;