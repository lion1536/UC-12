import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const UnitConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [category, setCategory] = useState('temperature');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [toUnit, setToUnit] = useState('fahrenheit');
  const [result, setResult] = useState('');

  const unitOptions = {
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
    mass: ['kgs', 'lbs'],
    distance: ['km', 'miles', 'm', 'feet', 'inches', 'cm'],
  };

  const convertUnits = () => {
    const value = parseFloat(inputValue);

    if (isNaN(value)) {
      setResult('Entrada inválida');
      return;
    }

    let convertedValue;

    if (category === 'temperature') {
      convertedValue = convertTemperature(value, fromUnit, toUnit);
    } else if (category === 'mass') {
      convertedValue = convertMass(value, fromUnit, toUnit);
    } else if (category === 'distance') {
      convertedValue = convertDistance(value, fromUnit, toUnit);
    }
    setResult(`${convertedValue.toFixed(2)} ${toUnit}`);
  };

  const convertTemperature = (value, from, to) => {
    let celsiusValue;

    if (from === 'celsius') {
      celsiusValue = value;
    } else if (from === 'fahrenheit') {
      celsiusValue = ((value - 32) * 5) / 9;
    } else if (from === 'kelvin') {
      celsiusValue = value - 273.15;
    }

    if (to === 'celsius') {
      return celsiusValue;
    } else if (to === 'fahrenheit') {
      return (celsiusValue * 9) / 5 + 32;
    } else if (to === 'kelvin') {
      return celsiusValue + 273.15;
    }

    return value;
  };

  const convertDistance = (value, from, to) => {
    const unitsInMeters = {
      km: 1000,
      miles: 1609.34,
      m: 1,
      feet: 0.3048,
      inches: 0.0254,
      cm: 0.01,
    };

    const metersValue = value * unitsInMeters[from];
    return metersValue / unitsInMeters[to];
  };

  const convertMass = (value, from, to) => {
    const unitsInKgs = {
      kgs: 1,
      lbs: 0.453592,
    };

    const kgsValue = value * unitsInKgs[from];
    return kgsValue / unitsInKgs[to];
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Conversor de Unidades</Text>

      <View style={styles.buttonGroup}>
        <Text style={styles.label}>Categoria:</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'temperature' && styles.activeButton,
            ]}
            onPress={() => {
              setCategory('temperature');
              setFromUnit('celsius');
              setToUnit('fahrenheit');
            }}>
            <Text style={styles.buttonText}>Temperatura</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'mass' && styles.activeButton,
            ]}
            onPress={() => {
              setCategory('mass');
              setFromUnit('kgs');
              setToUnit('lbs');
            }}>
            <Text style={styles.buttonText}>Massa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              category === 'distance' && styles.activeButton,
            ]}
            onPress={() => {
              setCategory('distance');
              setFromUnit('km');
              setToUnit('miles');
            }}>
            <Text style={styles.buttonText}>Distância</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={inputValue}
        onChangeText={text => setInputValue(text)}
      />
      <View style={styles.buttonGroup}>
        <Text style={styles.label}>De:</Text>
        <View style={styles.buttonsRow}>
          {unitOptions[category].map(unit => (
            <TouchableOpacity
              key={unit}
              style={[
                styles.unitButton,
                fromUnit === unit && styles.activeButton,
              ]}
              onPress={() => setFromUnit(unit)}>
              <Text style={styles.buttonText}>{unit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <Text style={styles.label}>Para:</Text>
        <View style={styles.buttonsRow}>
          {unitOptions[category].map(unit => (
            <TouchableOpacity
              key={unit}
              style={[
                styles.unitButton,
                toUnit === unit && styles.activeButton,
              ]}
              onPress={() => setToUnit(unit)}>
              <Text style={styles.buttonText}>{unit}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.convertButton} onPress={convertUnits}>
        <Text style={styles.convertButton}>Converter</Text>
      </TouchableOpacity>
      <View style={styles.resultContainer}>
        <Text style={styles.result}>{result}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  buttonGroup: {
    width: '100%',
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  unitButton: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    minWidth: '30%',
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
  },
  convertButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ff6f61',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default UnitConverter;
