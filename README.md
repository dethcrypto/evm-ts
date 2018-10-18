<p align="center">
  <h3 align="center">EVM-TS</h3>
  <p align="center">Ethereum Virtual Machine implemented in TypeScript</p>

  <p align="center">
    <a href="https://circleci.com/gh/ethereum-ts/evm-ts"><img alt="Build Status" src="https://circleci.com/gh/ethereum-ts/evm-ts.svg?style=svg"></a>
    <a href='https://coveralls.io/github/ethereum-ts/evm-ts'><img src='https://coveralls.io/repos/github/ethereum-ts/evm-ts/badge.svg' alt='Coverage Status' /></a>
    <a href="https://github.com/prettier/prettier"><img alt="Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

## Project status

- runs simple contracts, checkout [solidity tests](https://github.com/ethereum-ts/evm-ts/tree/master/test/contracts) 🔥
- supports ~110 opcodes 😍
- tests running agains _ethereumjs-vm_ (soon agains _geth_ or _parity_) 🐞
- lacks gas calculation 😓

## EVM short description

- stack based
- word size 256 bytes
- 3 types of storage:
  - stack - a non-persisting word size stack
  - memory - a non-persisting linear memory that can be accessed at a byte level
  - storage - persisting key-value store, keys and values have to be word size

## To read

- [Opcodes list](https://github.com/trailofbits/evm-opcodes)
- [Opcodes translation tool](https://etherscan.io/opcode-tool)
- [Opcodes implementation](https://github.com/ethereum/go-ethereum/blob/master/core/vm/instructions.go)
- [EVM Illustrated](http://takenobu-hs.github.io/downloads/ethereum_evm_illustrated.pdf)
- [EVM Deep Dive](https://blog.qtum.org/diving-into-the-ethereum-vm-6e8d5d2f3c30)
- [Ethereum Yellowpaper](https://ethereum.github.io/yellowpaper/paper.pdf)
