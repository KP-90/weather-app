// Since this a public api key, theres no need to hide it
const API = '91bdd3cfe4a4b2983ae60b6748a5ee45';
const stateCodes = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 
                    'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 
                    'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 
                    'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 
                    'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 
                    'WA', 'WV', 'WI', 'WY' ];

const body = document.querySelector("body")
const main = document.getElementById("main");
const content = document.getElementById("content")
const display = document.getElementById("display")
const details = document.getElementById("details")

// Forecast section
const cards = document.getElementById("cards")

// Variables that will store received api objects
let output;
let forecast_output;

// API to get the wather at city, state. Gets stored in 'output' variable
async function getWeather(city, state) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},us-${state}&units=imperial&APPID=${API}`, {mode: 'cors'})
        const data = await response.json()
        .then(function(temps) {
            output = temps;
            return output
        })
    }
    catch {
        output = `${city}, does not exist in ${state}`;
        return output
    }
}

// API to get icons for the weather. Requires info from the getWeather() functions api
async function getIcon(id) {
    const iconObject = await fetch(`https://openweathermap.org/img/wn/${id}@2x.png`, {mode:'cors'})
    return iconObject
}

// get geolocation then calls api for forecast
async function getForecast(city, state) {
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${API}`, {mode: 'cors'})
    const coords = await response.json()
    console.log(coords)
    let lat = coords[0].lat
    let lon = coords[0].lon
    const forecast = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=imperial&appid=${API}`, {mode:'cors'})
    const data = await forecast.json()
    .then(function(data) {
        forecast_output = data

        return forecast_output
    })
}

// Drop down select menu for state codes becasue omg so many state codes
function createDropDown() {
    let start = document.createElement("select")
    start.id = "stateSelection"
    for (let i = 0; i < stateCodes.length; i++) {
        let option = document.createElement("option")
        option.innerText = stateCodes[i]
        option.id = stateCodes[i]
        option.value = stateCodes[i]
        start.appendChild(option)
    }
    return start;
}

// Create simple form for city, state, and submit button
function createForm() {
    content.display = 'none'
    let div = document.createElement("div")
    div.id = "inputs"
    let cityInput = document.createElement("input");
    cityInput.type = 'text'
    cityInput.id = "cityInput"
    cityInput.placeholder = "City..."
    let states = createDropDown();
    let btn = document.createElement("button")
    btn.classList.add("fa")
    btn.classList.add("fa-search")
    //btn.innerText = "Submit"
    btn.addEventListener("click", () => submitFetch())
    div.append(cityInput, states, btn);
    return div
}

// Calls the API to set gifs of current temp, and description of weather (e.g. cloudy, clear, sunny...)
async function submitFetch() {
    clear()
    content.style.display = 'block'
    let city = document.getElementById("cityInput")
    let state = document.getElementById("stateSelection")
    await getWeather(city.value, state.value)
    
    await getForecast(city.value, state.value)
    console.log(forecast_output.daily)
    
    // Check if calling the api returned the object, if so, we customize the output. Otherwise, display error
    if (output.cod != '404') {
        createDisplay(output)

        //5-day forecast
        for (let i = 0; i < 5; i++) {
            await createCards(forecast_output.daily[i])
        }

    }
    else {
        show.innerText = `${output.message} in ${state.value}`;
    }
}

async function createDisplay(output) {
    let show = document.createElement("span")
    show.id = "currentTemp"
    let f = document.createElement("p")
    f.id = "f"
    f.innerHTML = "&deg;F"
    let iconImg = document.createElement("img")
    iconImg.id = "icon"
    // Gets description of weather
    let status = output.weather[0].description
    //Capitalize it
    status = status.charAt(0).toUpperCase() + status.slice(1)
    // Gets current temp
    let currentTemp = output.main.temp;
    // Get icon
    let icon = output.weather[0].icon
    let test = await getIcon(icon)
    iconImg.src = test.url
    show.innerText = `${currentTemp}`
    display.append(iconImg, show, f)
    //subsection of display
    let detailBox = document.createElement("div")
    detailBox.id = "detailBox"
    let humid = document.createElement("span")
    humid.innerText = `Humidity: ${output.main.humidity}%`
    let wind = document.createElement("span")
    wind.innerText = `Wind: ${output.wind.speed} mph`;
    let feels_like = document.createElement("span")
    feels_like.innerText = `Feels like: ${output.main.feels_like}`
    detailBox.append(humid, wind, feels_like)
    display.appendChild(detailBox)
}

async function createCards(object) {
    let newCard = document.createElement("div")
    newCard.className = "card"
    let object_date = new Date(object.dt * 1000)
    let date_display = document.createElement("p")
    date_display.innerText = `${object_date.getMonth() + 1}/${object_date.getDate()}`
    // Get the icon
    let create_icon = document.createElement("img")
    let get_icon = await getIcon(object.weather[0].icon)
    create_icon.src = get_icon.url
    // get max temp
    let create_high = document.createElement("p")
    create_high.innerText = object.temp.max
    // get min temp
    let low_temp = document.createElement("p")
    low_temp.innerText = object.temp.min
    // Append everything
    newCard.append(date_display, create_icon, create_high, low_temp)
    cards.appendChild(newCard)
}

// Used to clear the main components
function clear() {
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
    while (cards.firstChild) {
        cards.removeChild(cards.firstChild)
    }
}


main.appendChild(createForm())
