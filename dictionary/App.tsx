import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const EnglishDictionary = () => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchWord = async () => {
    if (!word.trim()) {
      setError('Por favor, digite uma palavra.');
      return;
    }

    setLoading(true);
    setError('');
    setDefinition('');

    try {
      const response = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      if (response.data && response.data.length > 0) {
        const allDefinitions = response.data[0].meanings
          .map(meaning => meaning.definitions.map(def => def.definition))
          .flat();
        setDefinition(allDefinitions.join('\n\n'));
      } else {
        setError('Palavra não encontrada.');
      }
    } catch (error) {
      setError('Erro ao buscar a palavra. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite uma palavra"
        value={word}
        onChangeText={setWord}
      />
      <Button title="Buscar" onPress={searchWord} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <ScrollView style={styles.definitionContainer}>
        <Text style={styles.definitionText}>{definition}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  definitionContainer: {
    marginTop: 20,
  },
  definitionText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});
export default EnglishDictionary;
