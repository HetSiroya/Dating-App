function generateNumericOTP(): string {
  const length = 6;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return String(otp);
}

// Example usage:
const otp = generateNumericOTP();
// console.log(otp);

export default generateNumericOTP;
