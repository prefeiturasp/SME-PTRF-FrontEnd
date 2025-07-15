export function getCCMMask(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length > 8) {
    return [
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
    ];
  } else {
    return [/\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/];
  }
}
