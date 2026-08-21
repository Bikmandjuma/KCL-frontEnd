// Mirrors backend/utils/idHash.js exactly, so the frontend can build
// obfuscated /product/:hash links without an extra round-trip to the API.
// NOTE: this is obfuscation, not cryptographic security.
const MOD = 4294967296n
const MULT = 2654435761n
const MULT_INV = 244002641n
const XOR_KEY = 92617n

const toBase64Url = (str) => btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const fromBase64Url = (str) => {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - (str.length % 4)) % 4, '=')
    return atob(padded)
}

export const encodeId = (id) => {
    const n = BigInt(id)
    if (n < 0n) return null
    const scrambled = ((n * MULT) % MOD) ^ XOR_KEY
    return toBase64Url(scrambled.toString())
}

export const decodeId = (hash) => {
    try {
        const scrambled = BigInt(fromBase64Url(hash))
        const unxored = scrambled ^ XOR_KEY
        const n = (unxored * MULT_INV) % MOD
        return Number(n)
    } catch (e) {
        return null
    }
}
