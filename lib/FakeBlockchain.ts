import { BN } from "bn.js";
import * as invariant from "invariant";
import { Dictionary } from "ts-essentials";
import * as ethUtil from "ethereumjs-util";

import { VM } from "./VM";
import { IAccount, ITransaction, ITransactionResult, IBlockchain } from "./types";
import { isString } from "util";
import { getIndexOrDie } from "./utils/arrays";
import { findLastIndex } from "lodash";

export class FakeBlockchain implements IBlockchain {
  public readonly vm = new VM(this);
  public layeredAccounts: Array<Dictionary<IAccount>> = [{}];

  // @todo i am feeling like we could extract layering to separate mixin / class
  public checkpoint(): void {
    this.layeredAccounts.push({});
  }

  public revert(): void {
    this.layeredAccounts.pop();
  }

  public commit(): void {
    if (this.layeredAccounts.length === 1) {
      return;
    }
    const layerToCommit = this.layeredAccounts.pop();

    const lastIndex = this.layeredAccounts.length - 1;
    this.layeredAccounts[lastIndex] = {
      ...this.layeredAccounts[lastIndex],
      ...layerToCommit,
    };
  }

  public dumpLayers(): Dictionary<IAccount> {
    return this.layeredAccounts.reduce((acc, cur) => ({ ...acc, ...cur }), {} as Dictionary<IAccount>);
  }

  private getTopLayer(): Dictionary<IAccount> {
    return getIndexOrDie(this.layeredAccounts, -1);
  }

  public getAddress(_address: string): IAccount {
    const address = _address.startsWith("0x") ? _address.slice(2) : _address;
    const foundAccountLayer = findLastIndex(this.layeredAccounts, acc => !!acc[address]);

    if (foundAccountLayer === -1) {
      return this.createNewAccount(address);
    }
    return this.layeredAccounts[foundAccountLayer][address];
  }

  // possible new API, `updateAddress`
  public setAddress(_address: string, account: IAccount): void {
    const address = _address.startsWith("0x") ? _address.slice(2) : _address;

    this.getTopLayer()[address] = account;
  }

  private createNewAccount(fromAccount: IAccount): IAccount;
  private createNewAccount(desiredAddress: string): IAccount;
  private createNewAccount(fromAccountOrDesiredAccount: IAccount | string): IAccount {
    let address: string;
    if (isString(fromAccountOrDesiredAccount)) {
      address = fromAccountOrDesiredAccount;
    } else {
      const fromAccount = fromAccountOrDesiredAccount;
      // @todo reimplement ethUtils in TS
      address = ethUtil
        .generateAddress(new BN(fromAccount.address, 16).toArray(), new BN(fromAccount.nonce).toArray())
        .toString("hex");
      this.setAddress(fromAccount.address, {
        ...fromAccount,
        nonce: fromAccount.nonce + 1,
      });
    }

    const account: IAccount = {
      address,
      nonce: 0,
      value: new BN(0),
      code: [],
      storage: {},
    };

    this.getTopLayer()[account.address] = account;

    return account;
  }

  public runTx(tx: ITransaction): ITransactionResult {
    invariant(tx.data || tx.to || tx.value || tx.from, "Tx is empty");

    this.checkpoint();

    const fromAccount = this.getAddress(tx.from);

    const deployingNewContract = !tx.to;

    const account = deployingNewContract ? this.createNewAccount(fromAccount) : this.getAddress(tx.to!);
    invariant(account, `Account ${tx.to} not found!`);

    const codeToExecute = (deployingNewContract ? tx.data : account.code)!;
    const dataToSend = (deployingNewContract ? [] : tx.data)!;

    const result = this.vm.runCode({
      account: account.address,
      caller: fromAccount.address,
      code: codeToExecute,
      data: dataToSend,
      value: tx.value!,
      depth: 0,
    });

    if (deployingNewContract) {
      invariant(result.state.return, "Contract deploy should RETURN code!");

      this.setAddress(account.address, {
        ...this.getAddress(account.address),
        code: result.state.return!,
      });
    }

    if (result.state.reverted) {
      this.revert();

      return {
        account,
        runState: result.state,
      };
    }

    return {
      account,
      runState: result.state,
      accountCreated: deployingNewContract ? "0x" + account.address : undefined,
    };
  }
}
