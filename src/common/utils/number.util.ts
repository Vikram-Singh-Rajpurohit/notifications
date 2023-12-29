export function generateRefNumber() {
  const timestamp = new Date().getTime() // Get current timestamp
  const random = Math.floor(Math.random() * 90000) + 10000 // Generate random number between 10000 and 99999
  const refNumber = `${timestamp}${random}` // Combine timestamp and random number
  return refNumber
}
