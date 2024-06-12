// utils/index.js
export default function ifequal(a, b, options) {
  if (String(a) === String(b)) {
    return options.fn(this);
  }
  return options.inverse(this);
}
