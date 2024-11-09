export function times<T>(n: number, func: (i: number) => T) {
	const arr = [];
	for (let i = 0; i < n; i++) {
		arr.push(func(i));
	}
	return arr;
}
