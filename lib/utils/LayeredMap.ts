import { Dictionary } from "lodash";

export class LayeredMap<T> {
  private state: "opened" | "closed" = "opened"; // closes when it was reverted or commited
  private items: Dictionary<T> = {};

  constructor(private previousLayer?: LayeredMap<T>) {}

  get(key: string): T | undefined {
    if (this.state !== "opened") {
      throw new Error("Cannot read closed layered map");
    }

    if (key in this.items) {
      return this.items[key];
    } else if (this.previousLayer) {
      return this.previousLayer.get(key);
    } else {
      return undefined;
    }
  }

  getOrDefault(key: string, def: T): T {
    const value = this.get(key);
    if (value !== undefined) {
      return value;
    } else {
      return def;
    }
  }

  set(key: string, value: T): void {
    if (this.state !== "opened") {
      throw new Error("Cannot modify closed layered map");
    }

    this.items[key] = value;
  }

  checkpoint(): LayeredMap<T> {
    return new LayeredMap(this);
  }

  revert(): void {
    this.state = "closed";
  }

  commit(): LayeredMap<T> {
    // what should happen when committing root layer?
    if (!this.previousLayer) {
      return this;
    }

    this.state = "closed";

    Object.keys(this.items).forEach(key => {
      const value = this.items[key];

      this.previousLayer!.set(key, value);
    });

    return this.previousLayer;
  }

  clone(): LayeredMap<T> {
    const clone = new LayeredMap<T>();
    clone.items = { ...this.items };
    clone.previousLayer = this.previousLayer;
    clone.state = this.state;

    return clone;
  }

  dump(): Dictionary<T> {
    const items = this.previousLayer ? this.previousLayer.dump() : {};

    return {
      ...items,
      ...this.items,
    };
  }
}
