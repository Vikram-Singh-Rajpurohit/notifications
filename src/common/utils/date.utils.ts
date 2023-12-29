export function dateDifferenceInDays(a: any, b: any) {
  // creating two new date varibales to stop any kind of object key mutation in passing parameters
  const dateA = new Date(a)
  const dateB = new Date(b)

  dateA.setUTCHours(0, 0, 0, 0)
  dateB.setUTCHours(0, 0, 0, 0)
  const difference = Math.ceil((+dateA - +dateB) / (1000 * 60 * 60 * 24))
  return difference
}

export function formatDateFromDateString(dateString: string | number | Date) {
  const date = new Date(dateString)

  // Get the month, day, and year
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const year = date.getUTCFullYear()

  // Format the date string like "07-20-2023"
  const formattedDate = `${month}-${day}-${year}`

  return formattedDate
}
