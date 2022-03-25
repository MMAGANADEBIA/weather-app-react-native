import { StatusBar } from 'react-native';
StatusBar.setBarStyle('light-content', true);
StatusBar.setBackgroundColor("#1C1C1C");
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native-web';

import cloudy from './assets/cloudy.png';
import clearDay from './assets/weather-icons/clear-day.png';
import clearNight from './assets/weather-icons/clear-night.png';
import fog from './assets/weather-icons/fog.png';
import humidity from './assets/weather-icons/humidity.png';
import partlyCloudyDay from './assets/weather-icons/partly-cloudy-day.png';
import partlyCloudyNight from './assets/weather-icons/partly-cloudy-night.png';
import precipitation from './assets/weather-icons/precipitation.png';
import rain from './assets/weather-icons/rain.png';
import sleet from './assets/weather-icons/sleet.png';
import snow from './assets/weather-icons/snow.png';
import windSignal from './assets/weather-icons/wind-signal.png';
import wind from './assets/weather-icons/wind.png';

let imagesObject = {
  "cloudy": cloudy,
  "clearDay": clearDay,
  "clearNight": clearNight,
  "fog": fog,
  "partlyCloudyDay": partlyCloudyDay,
  "partlyCloudyNight": partlyCloudyNight,
  "rain": rain,
  "sleet": sleet,
  "snow": snow,
  "wind": wind,
}
export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let [weatherData, setWeatherData] = useState(null);
  let [weatherIcons, setWeatherIcons] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // let text = 'Waiting...';
  let latitude;
  let longitude;
  if (errorMsg) {
    // text = errorMsg;
    console.log(errorMsg);
  } else if (location) {
    // text = JSON.stringify(location);
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

  // let iconName;

  const getWeatherData = async () => {
    fetch(`https://api.darksky.net/forecast/f9027dd170726ab26f9d6d0f99a467fb/${latitude},${longitude}?lang=es&units=si`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setWeatherData(json);
        console.log(json.currently);
        return json;
      })
      .catch((error) => {
        console.error(error);
      })
  }


  useEffect(() => {
    getWeatherData();
    firstWeek();
    image();
    setDailyImages();
    setDailyIconSummary();
  }, []);


  let date = new Date();
  let weekday = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
  let day0, day1, day2, day3, day4, day5, day6, day7;
  let daysArray = [day0, day1, day2, day3, day4, day5, day6, day7];
  const firstWeek = () => {
    let n = 0;
    for (let i = 0; i < 8; i++) {
      if (weekday[date.getDay() + (i + 1)]) {
        daysArray[i] = weekday[date.getDay() + (i + 1)];
      } else {
        n = i;
        i = 9;
      }
    }
    let nw = 0;
    for (n; n < 8; n++) {
      daysArray[n] = weekday[nw];
      nw++;
    }
    return daysArray;
  }

  const toCamelCase = () => {
    let icon = weatherData.currently.icon;
    return icon.toLowerCase().replace(/([-_][a-z])/g, group =>
      group
        .toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );
  }

  let images = [cloudy, clearDay, clearNight, fog, partlyCloudyDay, partlyCloudyNight, rain, sleet, snow, wind];
  const image = () => {
    let camelCaseName = toCamelCase();
    for (let i = 0; i < images.length; i++) {
      if (Object.keys(imagesObject)[i] == camelCaseName) {
        setWeatherIcons(images[i]);
      }
    }
    return setWeatherIcons;
  }

  let dailySummary = weatherData.daily.summary;
  let dailyImage0, dailyImage1, dailyImage2, dailyImage3, dailyImage4, dailyImage5, dailyImage6, dailyImage7;
  let dailyArray = [dailyImage0, dailyImage1, dailyImage2, dailyImage3, dailyImage4, dailyImage5, dailyImage6, dailyImage7];
  const setDailyImages = () => {
    for (let i = 0; i < 8; i++) {
      let camelCaseIcon = weatherData.daily.data[i].icon.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
          .toUpperCase()
          .replace('-', '')
          .replace('_', '')
      )
      for (let j = 0; j < 8; j++) {
        if (camelCaseIcon == Object.keys(imagesObject)[j]) {
          dailyArray[i] = images[j];
        }
      }
    }

    return dailyArray;
  }

  let dailyIconSummary;
  const setDailyIconSummary = () => {
    for (let i = 0; i < 8; i++) {
      let dailySummaryIconCamelCase = weatherData.daily.icon.toLowerCase().replace(/([-_][a-z])/g, group =>
        group
          .toUpperCase()
          .replace('-', '')
          .replace('_', '')
      )
      if (dailySummaryIconCamelCase == Object.keys(imagesObject)[i]) {
        dailyIconSummary = images[i];
      }
    }
    return dailyIconSummary;
  }

  return (
    <View style={styles.container}>

      <View style={styles.currently}>
        <Image source={weatherIcons} style={styles.icon} />
        <Text style={styles.text}>{weatherData.currently.temperature}°C</Text>
        <Text style={styles.text}>{weatherData.currently.summary}</Text>
        <Text style={styles.text}>Aparente: {weatherData.currently.apparentTemperature}°C</Text>

        <View style={styles.extraInfo}>
          <View style={styles.circle}>
            <Image source={windSignal} style={styles.extraInfoIcon} />
            <Text style={styles.text}>{weatherData.currently.windSpeed}</Text>
          </View>
          <View style={styles.circle}>
            <Image source={humidity} style={styles.extraInfoIcon} />
            <Text style={styles.text}>{weatherData.currently.humidity}</Text>
          </View>
          <View style={styles.circle}>
            <Image source={precipitation} style={styles.extraInfoIcon} />
            <Text style={styles.text}>{weatherData.currently.precipProbability}</Text>
          </View>
        </View>
      </View>



      <View style={styles.dailySummary}>
        <Image style={styles.dailyIconSummary} source={setDailyIconSummary()} />
        <Text style={styles.text}>{dailySummary}</Text>
      </View>

      <View style={styles.dailyContainer}>
        <View style={styles.daily}>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[0]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[0]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[0].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[0].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[0].temperatureLow}</Text>
          </View>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[1]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[1]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[1].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[1].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[1].temperatureLow}</Text>
          </View>
        </View>


        <View style={styles.daily}>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[2]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[2]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[2].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[2].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[2].temperatureLow}</Text>
          </View>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[3]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[3]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[3].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[3].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[3].temperatureLow}</Text>
          </View>
        </View>

        <View style={styles.daily}>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[4]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[4]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[4].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[4].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[4].temperatureLow}</Text>
          </View>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[5]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[5]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[5].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[5].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[5].temperatureLow}</Text>
          </View>
        </View>

        <View style={styles.daily}>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[6]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[6]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[6].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[6].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[6].temperatureLow}</Text>
          </View>
          <View style={styles.dailyBlock}>
            <Text style={styles.dailyText}>{firstWeek()[7]}</Text>
            <Image style={styles.dailyImage} source={setDailyImages()[7]} />
            <Text style={styles.dailyText}>{weatherData.daily.data[7].summary}</Text>
            <Text style={styles.dailyText}>Máx: {weatherData.daily.data[7].temperatureHigh}</Text>
            <Text style={styles.dailyText}>Mín: {weatherData.daily.data[7].temperatureLow}</Text>
          </View>
        </View>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  icon: {
    width: 150,
    height: 150,
  },
  currently: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  extraInfo: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
  },
  extraInfoIcon: {
    width: 50,
    height: 50
  },
  circle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#232327',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
  },
  daily: {
    flex: 1,
    flexDirection: "row",
  },
  dailyText: {
    fontSize: 10,
    color: "#ffffff"
  },
  dailyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -75,
    marginBottom: 75,
  },
  dailyBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dailyImage: {
    height: 25,
    width: 25,
  },
  dailyIconSummary: {
    height: 85,
    width: 85,
  },
  dailySummary: {
    flex: 1,
    marginTop: -70,
    alignItems: "center",
    justifyContent: "center",
  }
});
