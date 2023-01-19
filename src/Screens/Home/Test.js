import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,ActivityIndicator,TouchableOpacity } from 'react-native';
import _ from 'lodash';
import SQLite from 'react-native-sqlite-storage';
import NetInfo from "@react-native-community/netinfo";


const db = SQLite.openDatabase(
  {
      name: 'quizDB',
      location: 'default',
  },
  () => { },
  error => {
      console.log("ERROR: " + error);
  }
);

function Test({ navigation,route}) {
   let points = React.useRef(0)
   const { name,idParam } = route.params;
   const [value, setValue] = useState(0);
   const [data, setData] = useState(0);
  const [idBD, setIdBD] = useState();
  const [isLoading, setLoading] = useState(true);

  const getQuiz = async (idParam) => {

    try {

        const res = await fetch(`https://tgryl.pl/quiz/test/${idParam}`)
        const json = await res.json();
        json.tasks = _.shuffle(json.tasks);

        for (let i = 0; i < json.tasks.length; i++) {
            json.tasks[i].answers = _.shuffle(json.tasks[i].answers);
        }
        setData(json);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}


const DBHelper = {
  getQuizDBTMP: (callback) => {
       db.transaction( (tx) =>{
          tx.executeSql(
              "SELECT quiz From Quiz where quiz_id = ?",
              [idBD],
              (tx, results) => {
                let len = results.rows.length;
                if(len > 0){
                    let quiz = results.rows.item(0);
                    let quiz2 = JSON.stringify(quiz).replaceAll('\\','');
                    quiz2= quiz2.substring(9, quiz2.length-2);
                    let quiz3 = JSON.parse(quiz2);

                    quiz3.tasks = _.shuffle(quiz3.tasks);

                    for (let i = 0; i < quiz3.tasks.length; i++) {
                        quiz3.tasks[i].answers = _.shuffle(quiz3.tasks[i].answers);
                    }
                    callback(quiz3);
                }
            }
          );
      });
  },
}

const getQuizBD = () => {
    try {
        DBHelper.getQuizDBTMP(value => {
            setData(value);
            setLoading(false);
        });
    } catch (error) {
        console.error(error);
    } finally {

    }
}

useEffect(() => {
    getQuizBD();
}, [idBD]);


const getQuizStart = (idParam) => {
  NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
          getQuiz(idParam);
      } else {
          setIdBD(idParam)
      }
  });
  }

  useEffect(() => {

        getQuizStart(idParam);

}, []);
  






  const handleOnPress = (answerNumber) =>{

    if(value < (data.tasks.length-1)){
      if(data.tasks[value].answers[answerNumber].isCorrect){
        points.current++
      }
      setValue(value+1)
    }else{
      setValue(0)
      navigation.navigate('Score', { points: points.current, questionLength: data.tasks.length ,name:name, typ: data.name})
      points.current = 0
    }
  
  }


return(
  <View style={styles.container}>
    {isLoading ? <ActivityIndicator/> : (
      <View>
    <View style={styles.quest}>
      <Text style={styles.text}>{data.tasks[value].question}</Text>
    </View>

    <View style={styles.answers}>
        <View style={styles.column}>
          {data.tasks[value].answers.map((element, i) => {
            return <TouchableOpacity  key={i} style={styles.button} onPress={() => handleOnPress(i)}>
                        <Text style={styles.text_answer}>{data.tasks[value].answers[i].content}</Text>
                   </TouchableOpacity>
          })}
        </View>
    </View>
    </View>)}
  </View>)
};

const styles = StyleSheet.create({
  quest: {
      height: 250,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center'
  },
  text: {
      textAlign: 'center',
      fontSize: 30,
      color: 'black',
      fontFamily: 'ChivoMono-Italic-VariableFont_wght'
  },
  text_answer: {
      fontSize: 20,
      fontFamily: 'Caveat-VariableFont_wght',
      color: 'white',
  },
  button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      paddingHorizontal: 30,
      margin: 5,
      backgroundColor: 'grey',

  },
});


export default Test
