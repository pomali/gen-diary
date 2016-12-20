const csvParse = require('csv-parse/lib/sync')
const fs = require('fs')
const moment = require('moment')
const ICAL = require('ical.js')
const lodash = require('lodash')
const exportYear = 2017

/* lazy night coding */

function getNamedaysCsv () {
  let data = csvParse(fs.readFileSync('data/namedays1.csv', 'utf8'), {delimiter: ','})
    .map(
      (x) => {
        const name = x[0]
        let date = moment(x[1], 'YYYY-MM-DD')
        date.year(exportYear)
        return [name, date]
      }
    )

  let output = {}
  data.forEach(([name, date]) => { output[date.format('YYYY-MM-DD')] = name })
  return output
}
function getNamedayIcs () {
  const fileIn = fs.readFileSync('data/namedays2.ics', 'utf8')

  var jcalData = ICAL.parse(fileIn)
  var vcalendar = new ICAL.Component(jcalData)
  var data = vcalendar.getAllSubcomponents('vevent')
    .map(
      (x) => {
        let name = x.getFirstPropertyValue('summary')
        let date = moment(x.getFirstProperty('dtstart').getFirstValue().toString(), 'YYYY-MM-DD')
        date.year(exportYear)
        return [name, date]
      }
    )

  var output = {}
  data.forEach(([name, date]) => { output[date.format('YYYY-MM-DD')] = name })
  return output
}
let a = getNamedaysCsv()
let b = getNamedayIcs()

//console.log(a)
//console.log(b)
//console.log(lodash.isEqual(a, b))

//console.log('---diff:')

let out = Object.keys(a).sort().map((k) => [a[k] === b[k] ? a[k]: [a[k], b[k]], k])
console.log(out)
fs.writeFileSync('namesday.json', JSON.stringify(out))

// vim: set ts=2 sw=2 tw=0 et :
