import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ResultBody(props) {
  return(
    <View style={styles.container}>

      <Text style={styles.title}>
        {props.result.nick}
      </Text>

      <Text style={styles.score}>
        {props.result.score}/{props.result.total}
      </Text>

      <Text style={styles.date}>
        {props.result.createdOn}
      </Text>

      <Text style={styles.type}>
        {props.result.type}
      </Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    backgroundColor: 'white',
    margin: 10
  },
  title:{
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontFamily: 'ChivoMono-Italic-VariableFont_wght',
    textAlign:'center',
  },
  score:{
    flex:1,
    fontSize: 14,
    margin: 10,
    color: 'black',
    fontFamily: 'ChivoMono-Italic-VariableFont_wght',
    textAlign:'center',
  },
  type:{
    flex:1,
    fontSize: 14,
    color: 'black',
    fontFamily: 'ChivoMono-Italic-VariableFont_wght',
    margin: 10
  },
  date:{
    flex:1,
    fontSize: 14,
    color: 'black',
    fontFamily: 'ChivoMono-Italic-VariableFont_wght',
    margin: 10
  }
})

export default ResultBody;



