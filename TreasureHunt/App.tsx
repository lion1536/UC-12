import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';

const GRID_SIZE = 5; // Tamanho do grid (5x5)

const Game = () => {
  const [attempts, setAttempts] = useState(0);
  const [found, setFound] = useState(false); // Estado para verificar se o tesouro foi encontrado
  const [treasureRow, setTreasureRow] = useState(
    Math.floor(Math.random() * GRID_SIZE),
  ); // Linha do tesouro
  const [treasureCol, setTreasureCol] = useState(
    Math.floor(Math.random() * GRID_SIZE),
  ); // Coluna do tesouro

  const handleCellPress = (row, col) => {
    if (found) return; // Se o tesouro já foi encontrado, não faz nada

    setAttempts(attempts + 1);

    if (row === treasureRow && col === treasureCol) {
      setFound(true); // Marca o tesouro como encontrado
      Alert.alert(
        'Parabéns!',
        `Você encontrou o tesouro em ${attempts + 1} tentativas!`,
      );
    } else {
      const distance = Math.sqrt(
        Math.pow(row - treasureRow, 2) + Math.pow(col - treasureCol, 2),
      );
      if (distance <= 1) {
        Alert.alert('Quente!', 'Você está muito perto do tesouro!');
      } else if (distance <= 2) {
        Alert.alert('Morno!', 'Você está perto do tesouro.');
      } else {
        Alert.alert('Frio!', 'Você está longe do tesouro.');
      }
    }
  };

  const restartGame = () => {
    setAttempts(0);
    setFound(false);
    setTreasureRow(Math.floor(Math.random() * GRID_SIZE)); // Nova posição aleatória para o tesouro
    setTreasureCol(Math.floor(Math.random() * GRID_SIZE)); // Nova posição aleatória para o tesouro
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      const cells = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        cells.push(
          <TouchableOpacity
            key={`${row}-${col}`}
            style={styles.cell}
            onPress={() => handleCellPress(row, col)}>
            <Text style={styles.cellText}>
              {found && row === treasureRow && col === treasureCol
                ? '💎'
                : '🪙'}
            </Text>
          </TouchableOpacity>,
        );
      }
      grid.push(
        <View key={row} style={styles.row}>
          {cells}
        </View>,
      );
    }
    return grid;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caça ao Tesouro</Text>
      <Text style={styles.attempts}>Tentativas: {attempts}</Text>
      <View style={styles.grid}>{renderGrid()}</View>
      {found && (
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.restartButtonText}>Reiniciar Jogo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  attempts: {
    fontSize: 18,
    marginBottom: 20,
    color: '#fff',
  },
  grid: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#e0e0e0',
  },
  cellText: {
    fontSize: 24,
  },
  restartButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Game;
