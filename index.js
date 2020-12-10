let chalk = require('chalk')
let boxen = require('boxen')
let axios = require('axios')
let createCsvWriter = require('csv-writer').createObjectCsvWriter

// OpenWeather API
let apiKey = '039cced4e26208ff41df889a035ca457'
let city = 'dallas'
let units = 'metric'
let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`

// Call to API
axios.get(api)
    .then(res => {
        // CSV creator
        let csvWriter = createCsvWriter({
            path: 'dallasWeather.csv',
            header: [
                {id: 'temperature', title: 'Temperature'},
                {id: 'units', title: 'Units'},
                {id: 'precipitation', title: 'Precipitation'},
            ]
        })
        // Create data obj
        let data = [
                {
                    temperature: res.data.main.temp,
                    units: 'C',
                    precipitation: res.data.weather[0].description === 'rain' ? true : false
                }
            ]
        // Write CSV
        csvWriter
            .writeRecords(data)
            .then(()=> {
                // Make output pretty
                let text = chalk.white.bold("CSV file successfully written")
                let boxenOptions = {
                    padding: 1,
                    margin: 1,
                    borderStyle: "round",
                    borderColor: "green"
                }
                let prettyText = boxen( text, boxenOptions )
                console.log(prettyText)
            })
            .catch(() => console.log('CSV not created'))
    })
    .catch(err => {
        // CSV creator
        let csvWriterErr = createCsvWriter({
            path: 'dallasWeatherError.csv',
            header: [
                {id: 'error', title: 'Error'}
            ]
        })
        // Create data obj
        let data = [
            {
                error: `API problem: ${err.response.statusText}`
            }
        ]
        // Write CSV
        csvWriterErr
            .writeRecords(data)
            .then(()=> {
                // Make output pretty
                let text = chalk.white.bold("CSV file written, but there are some errors")
                let boxenOptions = {
                    padding: 1,
                    margin: 1,
                    borderStyle: "round",
                    borderColor: "green"
                }

                let prettyText = boxen( text, boxenOptions )
                console.log(prettyText)
            })
    })