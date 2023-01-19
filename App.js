import  React, { useState, useEffect } from 'react';
import { View,StyleSheet, Text, TouchableOpacity } from 'react-native';
import Routes from './src/Navigation/Routes';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


function App() {
  let [loading, setLoading] = useState(true)
  let [ifOpening, setIfOpening] = useState(false)
  let FirstOpening = async () => {
    let Fopening = await AsyncStorage.getItem('Regulation')
    if(Fopening === null)
      setIfOpening(true)
    setLoading(false)
  }


  useEffect(() => {
    SplashScreen.hide();
    FirstOpening();
}, []);

let handleDone = () => {
  setIfOpening(false)
  AsyncStorage.setItem('Regulation','no')
}

const Regulation = () => {
  return(
    <SafeAreaView style={styles.containerButton}>
      <TouchableOpacity onPress={handleDone}>
        <Text style={styles.tekst}>Zaakceptuj regulamin</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )

}

if(ifOpening){
  return (
    <Regulation />
  )
}
else{
  return (
    <View style = {styles.container}>
      <Routes />
    </View>
  );
}
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  containerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tekst: {
    fontSize: 30,
    color: 'black'
  }
})




export default App;