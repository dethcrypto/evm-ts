/**
 * Like array but it will throw an error when popping empty element
 */
export class Stack<T> extends Array<T> {
  constructor(items: T[] = []) {
    super(...items);
  }

  public pop(): T {
    if (this.length === 0) {
      throw new Error("Cannot pop empty stack!");
    }

    return Array.prototype.pop.apply(this);
  }
}
