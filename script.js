let key = '3ec0b491578e41a083c1b43b4942e4a3';
let current = 'Moscow'

let input = document.getElementById('city')
let search = document.getElementById('btn')
let today = document.getElementById('today_weather')
let forecast = document.getElementById('forecast')

let img = '404.jpg'
let sun_Rise = '-'
let sun_Set = '-'

document.getElementById('today_block').addEventListener('click', () => {
    show('today', 'today_block')
})

document.getElementById('forecast_block').addEventListener('click', () => {
    show('forecast', 'forecast_block')
})

function show(id_1, id_2) {
    document.getElementById('today').className = 'tab_content'
    document.getElementById('forecast').className = 'tab_content'
    document.getElementById('today_block').className = 'tab'
    document.getElementById('forecast_block').className = 'tab'

    document.getElementById(id_1).className = 'tab_content active'
    document.getElementById(id_2).className = 'tab active'
}

search.addEventListener('click', () => {
    let city = input.value.trim()

    if (city === '') {
        city = 'Moscow'
    }
    todayWeather(city)
    getForecast(city)
})

todayWeather(current)
getForecast(current)

function todayWeather(city) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=en`

    fetch(url).then(response => {
        response.json().then(data => {
        if (data.cod === '404') {
            showErr(city)
            return
        }
            current = data.name

            sun_Rise = new Date(data.sys.sunrise * 1000).toLocaleTimeString()
            sun_Set = new Date(data.sys.sunset * 1000).toLocaleTimeString()
            let dur = Math.round((data.sys.sunset - data.sys.sunrise) / 3600) + ' ч'

                today.innerHTML = `<div class="weather_card">
                    <h2>${data.name} - ${new Date().toLocaleDateString()}</h2>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                    <p>${data.weather[0].description}</p>
                    <p>Temperature: ${data.main.temp}°C (feels_like ${data.main.feels_like}°C)</p>
                    <p>Sunrise: ${sun_Rise}</p>
                    <p>Sunset: ${sun_Set}</p>
                    <p>Duration: ${dur}</p>
                </div>`
                
                PopCities()
            })
    })
}


function PopCities() {
    let cities = ['Singapore', 'Dubai', 'Paris', 'Tokyo']
    let cont = document.getElementById('popular_places')
    cont.innerHTML = ''

    for (let i = 0; i < cities.length; i++) {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${key}&units=metric&lang=en`

        fetch(url).then(response => {
            response.json().then(data => {
                    let card = document.createElement('div')
                    card.className= 'popular_card'

                    card.innerHTML = `<h4>${data.name}</h4>
                     <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png">
                     <p>${Math.round(data.main.temp)}°C</p>`

                    cont.appendChild(card)
                })
        })
    }
}


function getForecast(city) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric&lang=en`
    
    fetch(url).then(response => {
        response.json().then(data => {
        if (data.cod === '404') {
            showErr(city)
            return
        }
        let days = {}
        for (let i = 0; i < data.list.length; i++) {
            let item = data.list[i]
            let date = item.dt_txt.split(" ")[0]
            if (!days[date]) {
            days[date] = []
        }
        days[date].push(item)
    }
    let keys = Object.keys(days).slice(0, 5)
    forecast.innerHTML = '<div class="forecast_list" id="forecast_list"></div>'
                
    for (let n = 0; n < keys.length; n++) {
      let gr = days[keys[n]]
      let main = gr[0]
                    
      let block = document.createElement('div')
      block.className = 'weather_card'
                    
      let date = new Date(keys[n])
      let weekday = date.toLocaleDateString('en-US', {
        weekday: 'short'
      })

      block.innerHTML = `<h3>${weekday}</h3>
      <p>${date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</p>
      <img src="https://openweathermap.org/img/wn/${main.weather[0].icon}@2x.png">
      <p>${Math.round(main.main.temp)}°C</p>
      <p>${main.weather[0].description}</p>`

      block.addEventListener('click', () => {
      let click = document.querySelector('.detail_block')
      if (click) {
        click.remove()
      }
      let det = gr[4] || gr[1]
      let info = document.createElement('div')
      info.className = 'weather_card detail_block'

      let sr = sun_Rise
      let ss = sun_Set

      info.innerHTML = `<h4>Подробно:</h4>
         <p>Wind: ${det.wind.speed}</p>
         <p>Humidity: ${det.main.humidity}</p>
         <p>Pressure: ${det.main.pressure}</p>
         <p>Sunrise: ${sr}</p>
         <p>Sunset: ${ss}</p>`

      forecast.appendChild(info)
   })
                    
    document.getElementById('forecast_list').appendChild(block)
            
  }
 })
    })
}

function showErr(city) {
    today.innerHTML = `<div class="weather_card">
     <img src=${img} style width='200px'>
     <h2>404</h2>
     <p>City "<strong>${city}</strong>" could not be found.</p>
     <p>Please enter a different location.</p>
  </div>`
    
    forecast.innerHTML = ''
    document.getElementById('popular_places').innerHTML = ''
    
}