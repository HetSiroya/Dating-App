export function generatePassword(
  length: number = 12,
  options: {
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
  } = {}
): string {
  let charset = "";
  if (options.uppercase !== false) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.lowercase !== false) charset += "abcdefghijklmnopqrstuvwxyz";
  if (options.numbers) charset += "0123456789";
  if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
