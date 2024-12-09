// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function times<T = any>(n: number, cb: (i: number) => T) {
    return Array.from({ length: n }, (_, i) => cb(i));
}
