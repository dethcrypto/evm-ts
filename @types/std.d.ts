import { BN } from "bn.js";

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends BN ? BN : DeepReadonly<T[P]>
};
