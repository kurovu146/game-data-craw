export interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(item: T): boolean;
    size(): number;
    value(): T | null;
}