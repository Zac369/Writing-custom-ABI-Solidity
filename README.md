# Writing custom ABI for a super secret contract

Custom ABI encoding by taking 2 numbers, converting them to binary then intertwining the bits(one bit from a, one bit from b, one bit from a, etc).

Solution uses bit shifting to decode the tx.data
