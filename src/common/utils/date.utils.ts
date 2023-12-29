export function dateDifferenceInDays(a, b) {
  // convert both date in Date Object
  a = new Date(a)
  b = new Date(b)

  a.setUTCHours(0, 0, 0, 0)
  b.setUTCHours(0, 0, 0, 0)
  return Math.ceil((a - b) / (1000 * 60 * 60 * 24))
}

export function getDateArray(start, end) {
  var arr = new Array()
  var dt = new Date(start)
  while (dt <= end) {
    arr.push(new Date(dt))
    dt.setDate(dt.getDate() + 1)
  }
  return arr
}

//written in core java script
export function getTimeFromToday(targetDate) {
  // convert target date to UTC
  const utcTargetDate = new Date(targetDate).toUTCString()

  // get current UTC date
  const now = new Date()

  // calculate the difference in milliseconds
  const diff = +new Date(utcTargetDate) - +now

  // convert milliseconds to days, hours, minutes, and seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  // return time difference as an object
  return { days, hours, minutes, seconds }
}

//written in core type script
export function getTimeDiff(targetDateStr: string): any {
  const today: Date = new Date() // get today's date
  const targetDate: Date = new Date(targetDateStr) // specify the target date

  const timeDiff: number = targetDate.getTime() - today.getTime() // calculate the time difference in milliseconds
  const daysDiff: number = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) // convert to days and round down
  const hoursDiff: number = Math.floor((timeDiff / (1000 * 60 * 60)) % 24) // convert remaining time to hours and round down
  const minutesDiff: number = Math.floor((timeDiff / (1000 * 60)) % 60) // convert remaining time to minutes and round down
  const secondsDiff: number = Math.floor((timeDiff / 1000) % 60) // convert remaining time to seconds and round down

  const timeString: string = `${daysDiff} days, ${hoursDiff} hours, ${minutesDiff} minutes, ${secondsDiff} seconds` // create formatted time string

  const timeObject = {
    days: daysDiff,
    hours: hoursDiff,
    minutes: minutesDiff,
    seconds: secondsDiff,
    timeString: timeString,
  } // create object with time values and formatted string

  return timeObject // return the time object
}

export function attachTimeToDate(date: Date, time: string, timezoneOffsetInMinutes: number): Date {
  const [hoursMinutes, meridian] = time.split(' ')
  const [hours, minutes] = hoursMinutes.split(':')
  let hourse24 = parseInt(hours)
  if (meridian === 'PM' && +hours !== 12) {
    hourse24 += 12
  }
  if (meridian === 'AM' && +hours === 12) {
    hourse24 = 0
  }

  const dateTime = new Date(date.setUTCHours(hourse24, +minutes, 0, 0))

  const timezoneOffsetInMilliseconds = timezoneOffsetInMinutes * 60 * 1000
  const UTCDateTime = new Date(dateTime.getTime() + timezoneOffsetInMilliseconds)

  return UTCDateTime
}

export function detachTimeFromDate(dateString: string): string {
  if (!dateString) {
    return ''
  }
  const date = new Date(dateString)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()

  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const time = `${formattedHours}:${formattedMinutes} ${period}`
  return time
}

export function leftTimeDifference(UTCPickupTime: Date): string {
  const currentTime = new Date()
  const timeDifference = new Date(UTCPickupTime).getTime() - currentTime.getTime()

  const oneSecond = 1000 // milliseconds
  const oneMinute = 60 * oneSecond
  const oneHour = 60 * oneMinute
  const oneDay = 24 * oneHour

  const days = Math.floor(timeDifference / oneDay)
  const hours = Math.floor((timeDifference % oneDay) / oneHour)
  const minutes = Math.floor((timeDifference % oneHour) / oneMinute)
  const seconds = Math.floor((timeDifference % oneMinute) / oneSecond)

  const timeString = `${days} Days, ${hours} Hours, ${minutes} minutes, ${seconds} seconds`
  return timeString
}
