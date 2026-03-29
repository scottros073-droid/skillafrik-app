export function required(value) { return value && value.toString().trim().length > 0; }
export function minLength(value, len=3) { return value && value.toString().trim().length >= len; }
