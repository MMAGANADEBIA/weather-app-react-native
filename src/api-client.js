const url = `https://api.darksky.net/forecast/f9027dd170726ab26f9d6d0f99a467fb/${latitude},${longitude}?lang=es&units=si`

function getWeatherData() {
  return fetch(`${url}`, {
    metho: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(response => {
      console.log(response)
    })
}
