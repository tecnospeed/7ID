# 7ID

Random base32 ([RFC 4648](https://tools.ietf.org/html/rfc4648) without _padding_) string generator for unique ID usage.

This library includes the function `generate()`,
which accepts a number of bytes to be used by `crypto` on it's function `randomBytes()`.

The proportion of characters generated and the length of bytes requested is 5/16 (0.3125).
Each 5 bytes, 16 characters are generated. 10 bytes output is a string of 32 characters.

## Collision probability

The [probability](https://en.wikipedia.org/wiki/Birthday_problem#Probability_table) depends on the bytes length informed.

On a practical test of collision, the genetions that colided was:

|Generations|
|--------|
|16690357|
|20813326|
|30091557|
|30288983|
|40839999|
|43867276|
|44935582|
|(…)|

## Usage

## Example
```javascript
const thitySixID = require('7id')

let result = thitySixID.generate(6)

console.log(result)
```

### Output example
```javascript
'G42WCY3CMVSTOOLGGIYQ'
```
