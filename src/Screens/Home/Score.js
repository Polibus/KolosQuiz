import React, { useEffect } from 'react';
import {View, Text,StyleSheet, Button } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

function Score({route, navigation}) {

  const { points,questionLength,name,typ } = route.params;


  useEffect(() => {
    getStartData()
  }, []);

  const sendResult = () => {
    console.log('done')
  }

  const getStartData = () => {
    NetInfo.fetch().then(state => {
        if(state.isConnected){
            console.log('Internet is On HOME')
            sendResult();
        }
        else {
            console.log('Internet is Off HOME')
            sendResult3();
        }
    });
}

  const sendResult2 = async() => {
    try {

        await fetch('http://tgryl.pl/quiz/result', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nick: name,
            score: points,
            total: questionLength,
            type:  typ
          })
        })
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={styles.container}>
        <Text style={styles.tekst}>Zdobyłeś: {points}/{questionLength}</Text>
        <View style={styles.footerButton} >
              <Button onPress={()=>navigation.navigate('Home',{name: name})} title="End" />
        </View>
    </View>
  );
  }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 100,

      },
    tekst: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 30,
        color: 'black'
    },
    footerButton: {
        flex: 1,
    }
    });

export default Score;