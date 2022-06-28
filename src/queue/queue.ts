import { IQueue } from "./queue.interface";

export class Queue<T> implements IQueue<T> {
    private storage = new Map<T, T>();

    constructor(private capacity: number = Infinity) { }

    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.set(item, item);
    }
    dequeue(item: T): boolean {
        return this.storage.delete(item);
    }
    size(): number {
        return this.storage.size;  
    }
    value(): T | null {
        let value = this.storage.keys();
        return value.next().value;
    }
}