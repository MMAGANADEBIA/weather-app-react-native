import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Location from 'expo-location';
import cloudy from './assets/cloudy.png';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native-web';


export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  let [weatherData, setWeatherData] = useState(null);

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

  let text = 'Waiting...';
  let latitude;
  let longitude;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    latitude = location.coords.latitude;
    longitude = location.coords.longitude;
  }

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
        console.log(json);
        return json;
      })
      .catch((error) => {
        console.error(error);
      })
  }

  useEffect(() => {
    getWeatherData();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={cloudy} style={styles.logo} />
      <Text>{weatherData.currently.temperature}°C</Text>
      <Text>{weatherData.currently.summary}</Text>
      <Text>Aparente: {weatherData.currently.apparentTemperature}°C</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },

});
