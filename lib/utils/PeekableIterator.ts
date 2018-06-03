export class PeekableIterator<T> {
  private index = 0;
  constructor(private array: Array<T>) {}

  public peek(): T {
    if (this.index >= this.array.length) {
      throw new Error("Index out of bounds.");
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
