const fs = require('fs');

let book = fs.readFileSync('./alice_in_wonderland.txt', 'utf-8')
let book_in_parts = book.split('.')
let steps = Math.floor(book_in_parts.length / 15)
let counter = 0;


setInterval(() => {
  let section = counter * steps;
  for (let i=0; i<steps; i++) {
    console.log(book_in_parts[section + i])
  }

  counter++;
  console.log('counter at', counter)

  if (counter >= 15) {
    counter = 0;
    console.log('starting again')
  }
}, 1000)
