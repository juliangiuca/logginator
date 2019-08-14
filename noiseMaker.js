const fs = require('fs');
const gigs_per_hour = process.env.GIGS_PER_HOUR || 1
const destination = process.env.DESTINATION || './destination'
let mbs_an_hour = gigs_per_hour * 1000

const dateIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

fs.readdirSync('./fixtures').forEach((file) => {
  let log = fs.readFileSync(`./fixtures/${file}`, 'utf-8')
  let logs = log.split('\n')

  let bytes = Buffer.byteLength(log, 'utf8')
  let megabytes = bytes * 1e-6;

  let repetition_an_hour   = mbs_an_hour / megabytes
  let repetitions_a_minute = repetition_an_hour / 60
  let repetitions_a_second = repetitions_a_minute / 60
  let repetitions_200_ms   = repetitions_a_second / 5
  let logs_lines_per_interval    = Math.floor(logs.length * repetitions_200_ms)

  console.log(`length ${file} is ${logs.length} lines long, ${bytes} bytes, and we will display ${logs_lines_per_interval} log lines per 200ms`)

  let counter = 0;

  setInterval(() => {
    let section = counter * logs_lines_per_interval;
    for (let i=section; i<logs_lines_per_interval; i++) {
      let tempLogLine = logs[i % logs.length]
      let re = /\[([\w:/]+\s[+\-]\d{4})\]/
      let date = new Date();

      let day   = date.getDate();
      let month = dateIndex[date.getMonth()]
      let year  = date.getFullYear()

      let hours = date.getHours()
      if (hours < 10) hours = `0${hours}`

      let minutes = date.getMinutes();
      if (minutes < 10) minutes = `0${minutes}`

      let seconds = date.getSeconds()
      if (seconds < 10) seconds = `0${seconds}`

      let time = `${hours}:${minutes}:${seconds}`

      tempLogLine = tempLogLine.replace(re, `[${day}/${month}/${year}:${time} +0000]`)

      fs.writeFile(`${destination}/${file}`, tempLogLine, {flag: 'a+'}, (err) => {
        if (err) console.error(`file ${file} has thrown ${err}`)
      })
    }

    counter++;
    if (counter * logs_lines_per_interval >= logs.length) {
      counter = 0;
      console.log(`starting again for ${file}`)
    }

  }, 200)

})

