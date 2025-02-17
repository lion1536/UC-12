import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment-timezone';

const WeatherChecker = () => {
  const [currentTime, setCurrentTime] = useState(
    moment().tz('UTC').format('HH:mm:ss'),
  );
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [timezone, setTimezone] = useState('UTC');

  const requestLocationPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão para a localização',
          message:
            'Este app precisa da permissão para acessar a localização do dispositivo.',
          buttonNeutral: 'Me lembre mais tarde',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceitar',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão de localização concedida');
        return true;
      } else {
        console.log('Permissão de localização negada');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const updateCurrentTime = () => {
    const time = moment().tz(timezone).format('HH:mm:ss');
    setCurrentTime(time);
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetchWeather(latitude, longitude);
      },
      error => {
        setError('Erro ao buscar a localização: ' + error.message);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;
      const response = await axios.get<WeatherData>(API_URL);
      setWeatherData(response.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      setError('Erro ao buscar dados do clima: ' + (error as Error).message);
      setLoading(false);
    }
  };

  const fetchWeatherByManualLocation = async () => {
    const location = locationInput.trim();
    if (location === '') {
      setError('Por favor, insira uma localização válida.');
      return;
    }

    try {
      const isCoordinates = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location);
      if (isCoordinates) {
        const [lat, lon] = location.split(',');
        fetchWeather(parseFloat(lat), parseFloat(lon));
      } else {
        const geocodingResponse = await axios.get(
          `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=pt&format=json`,
        );
        if (
          geocodingResponse.data.results &&
          geocodingResponse.data.results.length > 0
        ) {
          const {latitude, longitude} = geocodingResponse.data.results[0];
          fetchWeather(latitude, longitude);
        } else {
          setError('Localização não encontrada.');
        }
      }
      setIsManualLocation(true);
    } catch (error) {
      setError('Erro ao buscar localização: ' + error.message);
    }
  };

  interface WeatherData {
    hourly: {
      temperature_2m: number[];
      relativehumidity_2m: number[];
      windspeed_10m: number[];
      time: string[];
    };
    timezone: string;
  }

  useEffect(() => {
    if (!isManualLocation) {
      getLocation();
    }
  }, [isManualLocation]);

  useEffect(() => {
    const timer = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Verificador Climático</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite uma cidade ou coordenadas (lat, lon)"
        value={locationInput}
        onChangeText={setLocationInput}
      />
      <Button
        title="Buscar por localização manual"
        onPress={fetchWeatherByManualLocation}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Atualizar localização atual"
          onPress={() => {
            setIsManualLocation(false);
            getLocation();
          }}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {weatherData && (
        <View style={styles.weatherInfo}>
          <Text style={styles.text}>
            Temperatura: {weatherData.hourly.temperature_2m[0]}°C
          </Text>
          <Text style={styles.text}>
            Umidade: {weatherData.hourly.relativehumidity_2m[0]}%
          </Text>
          <Text style={styles.text}>
            Velocidade do vento: {weatherData.hourly.windspeed_10m[0]} km/h
          </Text>
          <Text style={styles.text}>Hora: {currentTime}</Text>
          <Picker
            selectedValue={timezone}
            onValueChange={itemValue => setTimezone(itemValue)}
            style={{height: 50, width: 250}}>
            <Picker.Item label="UTC" value="UTC" />
            <Picker.Item label="America/New_York" value="America/New_York" />
            <Picker.Item label="Europe/London" value="Europe/London" />
            <Picker.Item label="Asia/Tokyo" value="Asia/Tokyo" />
            <Picker.Item label="Australia/Sydney" value="Australia/Sydney" />
            <Picker.Item
              label="Africa/Johannesburg"
              value="Africa/Johannesburg"
            />
            <Picker.Item label="Asia/Shanghai" value="Asia/Shanghai" />
            <Picker.Item label="Europe/Paris" value="Europe/Paris" />
            <Picker.Item
              label="America/Los_Angeles"
              value="America/Los_Angeles"
            />
            <Picker.Item label="America/Sao_Paulo" value="America/Sao_Paulo" />
            <Picker.Item label="Asia/Dubai" value="Asia/Dubai" />
            <Picker.Item label="Asia/Kolkata" value="Asia/Kolkata" />
            <Picker.Item label="Pacific/Honolulu" value="Pacific/Honolulu" />
            <Picker.Item label="Europe/Moscow" value="Europe/Moscow" />
            <Picker.Item label="America/Chicago" value="America/Chicago" />
            <Picker.Item label="Asia/Hong_Kong" value="Asia/Hong_Kong" />
            <Picker.Item label="Asia/Seoul" value="Asia/Seoul" />
            <Picker.Item label="Europe/Berlin" value="Europe/Berlin" />
            <Picker.Item label="Europe/Istanbul" value="Europe/Istanbul" />
            <Picker.Item label="America/Toronto" value="America/Toronto" />
            <Picker.Item
              label="America/Mexico_City"
              value="America/Mexico_City"
            />
            <Picker.Item label="Asia/Singapore" value="Asia/Singapore" />
            <Picker.Item label="Asia/Bangkok" value="Asia/Bangkok" />
            <Picker.Item label="Asia/Jakarta" value="Asia/Jakarta" />
            <Picker.Item label="Africa/Cairo" value="Africa/Cairo" />
            <Picker.Item label="Africa/Nairobi" value="Africa/Nairobi" />
            <Picker.Item
              label="America/Argentina/Buenos_Aires"
              value="America/Argentina/Buenos_Aires"
            />
            <Picker.Item label="America/Denver" value="America/Denver" />
            <Picker.Item label="Pacific/Auckland" value="Pacific/Auckland" />
            <Picker.Item label="Asia/Karachi" value="Asia/Karachi" />
            <Picker.Item label="Asia/Riyadh" value="Asia/Riyadh" />
            <Picker.Item label="Asia/Manila" value="Asia/Manila" />
            <Picker.Item label="Asia/Taipei" value="Asia/Taipei" />
          </Picker>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f9f9f9',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '100%',
  },
  weatherInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    color: '#f9f9f9',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
});

export default WeatherChecker;
