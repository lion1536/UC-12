import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const Game: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [soundsLoaded, setSoundsLoaded] = useState<boolean>(false);

  // Carrega os sons ao iniciar o componente
  useEffect(() => {
    const soundFiles = [
      require('./sounds/explosion.mp3'), // Som 1
      require('./sounds/fart.mp3'), // Som 2
    ];

    const loadSounds = async () => {
      try {
        const loadedSounds = await Promise.all(
          soundFiles.map(
            (file, index) =>
              new Promise<Sound>((resolve, reject) => {
                const sound = new Sound(file, error => {
                  if (error) {
                    console.error(`Failed to load sound ${index}:`, error);
                    reject(error);
                  } else {
                    console.log(`Sound ${index} loaded successfully`);
                    resolve(sound);
                  }
                });
              }),
          ),
        );
        setSounds(loadedSounds);
        setSoundsLoaded(true);
      } catch (error) {
        console.error('Error loading sounds:', error);
        Alert.alert(
          'Sound Loading Error',
          'Failed to load sounds. Please try again.',
        );
      }
    };

    loadSounds();

    // Libera os sons ao desmontar o componente
    return () => {
      sounds.forEach(sound => sound.release());
    };
  }, []);

  // Reproduz um som diretamente
  const playSoundDirectly = useCallback(
    (index: number) => {
      if (index < 0 || index >= sounds.length) {
        console.error('Invalid sound index:', index);
        return;
      }

      const sound = sounds[index];
      sound.play(success => {
        if (success) {
          console.log(`Sound ${index} played successfully`);
        } else {
          console.error(`Sound ${index} playback failed`);
          Alert.alert('Playback Error', 'Failed to play sound');
        }
      });
    },
    [sounds],
  );

  // Gera uma nova sequência
  const generateNewSequence = useCallback(() => {
    const newSequence = [
      ...sequence,
      Math.floor(Math.random() * sounds.length), // Adiciona um novo som à sequência
    ];
    setSequence(newSequence);
    console.log('New sequence:', newSequence);
  }, [sequence, sounds.length]);

  // Inicia o jogo
  const startGame = useCallback(() => {
    if (!soundsLoaded) {
      Alert.alert('Aguarde', 'Os sons ainda estão carregando.');
      return;
    }

    setSequence([]); // Reinicia a sequência
    setPlayerSequence([]); // Reinicia a sequência do jogador
    setScore(0); // Reinicia a pontuação
    generateNewSequence(); // Gera a primeira sequência
  }, [soundsLoaded, generateNewSequence]);

  // Reproduz a sequência de sons
  const playSequence = useCallback(async () => {
    setIsPlaying(true);
    for (let i = 0; i < sequence.length; i++) {
      const soundIndex = sequence[i];
      playSoundDirectly(soundIndex);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Intervalo entre os sons
    }
    setIsPlaying(false);
  }, [sequence, playSoundDirectly]);

  // Reproduz um som quando o jogador toca em um botão
  const playSound = useCallback(
    (index: number) => {
      if (isPlaying || !soundsLoaded) return;

      playSoundDirectly(index);

      const newPlayerSequence = [...playerSequence, index];
      setPlayerSequence(newPlayerSequence);

      // Verifica se o jogador completou a sequência
      if (newPlayerSequence.length === sequence.length) {
        if (newPlayerSequence.every((value, i) => value === sequence[i])) {
          setScore(prevScore => prevScore + 1); // Aumenta a pontuação
          setPlayerSequence([]); // Reinicia a sequência do jogador
          generateNewSequence(); // Gera uma nova sequência
        } else {
          Alert.alert('Errou!', `Pontuação final: ${score}`);
          startGame(); // Reinicia o jogo
        }
      }
    },
    [
      isPlaying,
      playerSequence,
      sequence,
      score,
      startGame,
      generateNewSequence,
      playSoundDirectly,
      soundsLoaded,
    ],
  );

  // Reproduz a sequência automaticamente quando ela é atualizada
  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence, playSequence]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo de Memória Musical</Text>
      <Text style={styles.score}>Pontuação: {score}</Text>
      {/* Removido o texto "Sounds loaded" */}
      <View style={styles.buttonsContainer}>
        {sounds.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              {backgroundColor: `hsl(${index * 90}, 70%, 70%)`},
            ]}
            onPress={() => playSound(index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Iniciar Jogo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  score: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    width: 80,
    height: 80,
    margin: 10,
    borderRadius: 40,
  },
  startButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Game;
