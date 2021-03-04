import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export const relativeTimeString = (datetime) => dayjs().to(dayjs(datetime))
