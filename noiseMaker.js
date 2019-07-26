const fs = require('fs');
const gigs_an_hour = 1
let mbs_an_hour = gigs_an_hour * 1000

let logs = [];

fs.readdirSync('./fixtures').forEach((file) => {
  let log = fs.readFileSync(`./fixtures/${file}`, 'utf-8')
  let splitLogs = log.split('\n')
  console.log(`length ${file} is ${splitLogs.length}`)
  logs = logs.concat(splitLogs)
})

let bytes = Buffer.byteLength(logs.join('\n'), 'utf8')
let megabytes = bytes * 1e-6;

let repetition_an_hour = mbs_an_hour / megabytes
let repetitions_a_minute = repetition_an_hour / 60
let repetitions_a_second = repetitions_a_minute / 60
let repetitions_200_ms = repetitions_a_second / 5
let logs_per_interval = Math.floor(logs.length * repetitions_200_ms)

let counter = 0;


setInterval(() => {
  let section = counter * logs_per_interval;
  for (let i=0; i<logs_per_interval; i++) {
    console.log(logs[section + i])
  }

  counter++;
  if (counter * logs_per_interval >= logs.length) {
    logs = shuffle(logs)
    counter = 0;
    console.log('starting again')
  }
}, 200)

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
