import * as React from 'react';
import { FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';

import ResultBody from './ResultBody';

function ResultScreen(props) {

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect( () => {getResult()
  }, [])

  const getResult = async() => {
    setLoading(true);
    try{
      const res = await (await fetch('http://tgryl.pl/quiz/results')).json();
      setResults(res);
    }
    catch(error){
      console.log(error);
    }
    setLoading(false);
  }

  const renderItem = ({ item }) => (
      <ResultBody result={item} navigation={props.navigation} />
  );

  
  return (
    <FlatList
      refreshControl={
        <RefreshControl
          loading={loading}
          onRefresh={getResult}
        />
      }
      style={styles.container}
      data={results}
      renderItem={renderItem}
      keyExtractor={item=>item.id}
    />

  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white',
  },
})

export default ResultScreen;