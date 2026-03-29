export function isEmail(v="") { return /\S+@\S+\.\S+/.test(v); }
export function isPhone(v="") { return /^\+?[0-9]{7,15}$/.test(v); }
