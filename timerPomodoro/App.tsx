import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {Button, Card, Title} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            setIsActive(false);
            setIsBreak(!isBreak);
            setMinutes(isBreak ? 25 : 5);
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isBreak ? 'Hora do Descanso! 🎉' : 'Hora de Trabalhar! 💪'}
          </Title>
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>
              {`${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={toggleTimer}
              style={styles.button}
              color="#fff">
              <Text style={styles.buttonText}>
                {isActive ? '⏸️ Pausar' : '▶️ Iniciar'}
              </Text>
            </Button>
            <Button
              mode="contained"
              onPress={resetTimer}
              style={styles.button}
              color="#fff">
              <Text style={styles.buttonText}>🔄 Reiniciar</Text>
            </Button>
          </View>
        </Card.Content>
      </Card>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#6a11cb',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    borderRadius: 50,
    width: 120, // Aumentei a largura para caber o emoji e o texto
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PomodoroTimer;
