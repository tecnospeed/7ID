const crypto = require('crypto')

const ENCODE_MAP = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7'
]

const generate = (length = 10) => {
  let hex = crypto.randomBytes(length).toString('hex')

  let blocks = [0, 0, 0, 0, 0, 0, 0, 0]

  let v1
  let v2
  let v3
  let v4
  let v5

  let loopIndex = 0
  let start = 0
  let index

  let result = ''
  let finish = false

  do {
    blocks[0] = blocks[5]
    blocks[1] = blocks[6]
    blocks[2] = blocks[7]

    for (index = start; loopIndex < hex.length && index < 5; ++loopIndex) {
      let charCode = hex.charCodeAt(loopIndex)

      if (charCode < 0x80) {
        blocks[index++] = charCode
        continue
      }

      if (charCode < 0x800) {
        blocks[index++] = 0xc0 | (charCode >> 6)
        blocks[index++] = 0x80 | (charCode & 0x3f)
        continue
      }

      if (charCode < 0xd800 || charCode >= 0xe000) {
        blocks[index++] = 0xe0 | (charCode >> 12)
        blocks[index++] = 0x80 | ((charCode >> 6) & 0x3f)
        blocks[index++] = 0x80 | (charCode & 0x3f)
        continue
      }

      charCode =
        0x10000 +
        (((charCode & 0x3ff) << 10) | (hex.charCodeAt(++loopIndex) & 0x3ff))

      blocks[index++] = 0xf0 | (charCode >> 18)
      blocks[index++] = 0x80 | ((charCode >> 12) & 0x3f)
      blocks[index++] = 0x80 | ((charCode >> 6) & 0x3f)
      blocks[index++] = 0x80 | (charCode & 0x3f)
    }

    start = index - 5
    if (loopIndex === hex.length) ++loopIndex

    if (loopIndex > hex.length && index < 6) finish = true

    v1 = blocks[0]
    if (index > 4) {
      v2 = blocks[1]
      v3 = blocks[2]
      v4 = blocks[3]
      v5 = blocks[4]
      result +=
        ENCODE_MAP[v1 >>> 3] +
        ENCODE_MAP[((v1 << 2) | (v2 >>> 6)) & 31] +
        ENCODE_MAP[(v2 >>> 1) & 31] +
        ENCODE_MAP[((v2 << 4) | (v3 >>> 4)) & 31] +
        ENCODE_MAP[((v3 << 1) | (v4 >>> 7)) & 31] +
        ENCODE_MAP[(v4 >>> 2) & 31] +
        ENCODE_MAP[((v4 << 3) | (v5 >>> 5)) & 31] +
        ENCODE_MAP[v5 & 31]
      continue
    }

    if (index === 1) {
      result += ENCODE_MAP[v1 >>> 3] + ENCODE_MAP[(v1 << 2) & 31]
      continue
    }

    if (index === 2) {
      v2 = blocks[1]
      result +=
        ENCODE_MAP[v1 >>> 3] +
        ENCODE_MAP[((v1 << 2) | (v2 >>> 6)) & 31] +
        ENCODE_MAP[(v2 >>> 1) & 31] +
        ENCODE_MAP[(v2 << 4) & 31]
      continue
    }

    if (index === 3) {
      v2 = blocks[1]
      v3 = blocks[2]
      result +=
        ENCODE_MAP[v1 >>> 3] +
        ENCODE_MAP[((v1 << 2) | (v2 >>> 6)) & 31] +
        ENCODE_MAP[(v2 >>> 1) & 31] +
        ENCODE_MAP[((v2 << 4) | (v3 >>> 4)) & 31] +
        ENCODE_MAP[(v3 << 1) & 31]
      continue
    }

    v2 = blocks[1]
    v3 = blocks[2]
    v4 = blocks[3]
    result +=
      ENCODE_MAP[v1 >>> 3] +
      ENCODE_MAP[((v1 << 2) | (v2 >>> 6)) & 31] +
      ENCODE_MAP[(v2 >>> 1) & 31] +
      ENCODE_MAP[((v2 << 4) | (v3 >>> 4)) & 31] +
      ENCODE_MAP[((v3 << 1) | (v4 >>> 7)) & 31] +
      ENCODE_MAP[(v4 >>> 2) & 31] +
      ENCODE_MAP[(v4 << 3) & 31]
  } while (!finish)

  return result
}

module.exports = { generate }
