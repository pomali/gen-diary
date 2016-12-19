const csvParse = require('csv-parse/lib/sync')
const fs = require('fs')
const moment = require('moment')
const ICAL = require('ical.js')

/* lazy night coding */

function getNamedaysCsv () {
  return csvParse(fs.readFileSync('data/namedays1.csv', 'utf8'), {delimiter: ','})
    .map(
      (x) => {
        const name = x[0]
        let date = moment(x[1], 'YYYY-MM-DD')
        return [name, date]
      }
    )
}
function getNamedayIcs () {
  const fileIn = fs.readFileSync('data/namedays2.ics', 'utf8')

  var jcalData = ICAL.parse(fileIn)
  var vcalendar = new ICAL.Component(jcalData)
  console.log(vcalendar.getAllSubcomponents('vevent').map((x) => [x.getFirstPropertyValue('summary'), x.getFirstPropertyValue('dtstart')]))
  var vevent = vcalendar.getFirstSubcomponent('vevent')
  var summary = vevent.getFirstPropertyValue('summary')
  console.log('Summary: ' + summary)
}

console.log(getNamedaysCsv())
getNamedayIcs()

// vim: set ts=2 sw=2 tw=0 et :
