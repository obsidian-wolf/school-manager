export function formatCurrency(value: number | undefined) {
	// transform 1234567.12 to 1,234,567
	return `$${value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}
