/**
 * Array iterator which allows for read (peeking) first element multiple times. ES6's iterator can't provide that behaviour.
 *
 * Right after creation using iterator.peek() will result in error since iterator is not yet initialized. You need to move it to the first item with iterator.next()
 * This allows for writing nicer loops — while(iterator.hasNext()) { ... }
 *
 * Related: rust's std::iter::Peekable
 */
export class PeekableIterator<T> {
  public index = -1;
  constructor(private array: Array<T>) {}

  public peek(): T {
    if (this.index < 0 || this.index >= this.array.length) {
      throw new IndexOutOfBounds(this.index);
    }

    return this.array[this.index];
  }

  public take(n: number): T[] {
    const acc = [];

    for (let i = 0; i < n; i++) {
      acc.push(this.peek());
      this.next();
    }

    return acc;
  }

  public next(): void {
    this.index++;
  }

  public hasNext(): boolean {
    return this.index + 1 < this.array.length;
  }
}

export class IndexOutOfBounds extends Error {
  constructor(public readonly index: number) {
    super(`Index out of bounds: ${index}`);
  }
}
