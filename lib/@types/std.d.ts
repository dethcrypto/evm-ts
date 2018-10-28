import { BN } from "bn.js";

// @todo: maybe we can extend DeepReadonly from ts-essentials to cover passing custom types to omit
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends BN ? BN : DeepReadonly<T[P]>
};
