import * as React from 'react';
import { View,StyleSheet,Button } from 'react-native';
import { useEffect, useState } from 'react';



function RandomTest({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    let name = 'drawer'
  
    const getQuiz = async () => {
      try {
       const res = await (await fetch('https://tgryl.pl/quiz/tests')).json();
       setData(res);
     } catch (error) {
       console.error(error);
     } finally {
       setLoading(false);
     }
   }
  
   useEffect(() => {
    getQuiz();
  }, []);

        const randNum = Math.floor(Math.random() * 3) + 0;
    
    return (
        <View style={styles.container}>
            <View style={styles.footerButton} >
                <Button style={styles.footerButton} onPress={()=>navigation.navigate('Test',{name: name,idParam: data[randNum].id})} title="Quiz!" />
            </View>
        </View>
       );  
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        padding: 20,
        margin: 10,
      },
     input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 10,
        width: "auto",
        marginTop: 100,
     } ,
  
    footerButton: {
        marginTop: 100,
         flex: 0.7,
      }
    });

export default RandomTest;