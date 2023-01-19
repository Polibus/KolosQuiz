import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet,Button,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import _ from 'lodash';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
import NetInfo from "@react-native-community/netinfo";


const db = SQLite.openDatabase(
  {
      name: 'MainDB',
      location: 'default',
  },
  () => { },
  error => {
      console.log("ERROR: " + error);
  }
);



function Home({navigation,route}) {

  const { name2 } = route.params;
    const [quizList, setQuizList] = useState();
    let [loading, setLoading] = useState(true)
    
    
    const homeStart = () => {
        setLoading(true);
        NetInfo.fetch().then(state => {
            if(state.isConnected){
                console.log('Internet is On HOME')
                getQuizList();
            }
            else {
                console.log('Internet is Off HOME')
                getQuizListDB();
            }
        });
    }

    

    const getQuiz = async (id) => {
        try {
            const response = await fetch(`https://tgryl.pl/quiz/test/${id}`)
            const json = await response.json();

            return json;
        } catch (error) {
            console.error(error);
        } finally {
        }
    }

    const getQuizList = async () => {
        try {
            const response = await fetch('https://tgryl.pl/quiz/tests');
            const json = await response.json();

            setQuizList(_.shuffle(json));

        } catch (error) {
            console.error(error);
        } finally {

        }
    }

    const getQuizListDB = () => {
        try {
            DBHelper.getQuizListDBTMP(value => {
                setQuizList(value);
            })
        } catch (error) {
            console.log(error)
        } finally {
        }
    }

    const DBHelper = {
        getQuizListDBTMP: (callback) => {
            db.transaction( (tx) => {
                tx.executeSql(
                    "SELECT quizList From QuizList where id = 1",
                    [],
                    (tx, results) => {
                        let len = results.rows.length;
                        if (len > 0) {
                            let quiz = results.rows.item(0);
                            let quiz2 = JSON.stringify(quiz).replaceAll('\\', '');
                            quiz2 = quiz2.substring(13, quiz2.length - 2);
                            const quiz3 = JSON.parse(quiz2);

                            callback(_.shuffle(quiz3));
                        }
                    }
                );
            });
        },
    }

    
    const createTable = () =>{
        try {
            db.transaction((tx)=> {
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS Quiz (quiz_id TEXT, quiz TEXT, date_update INTEGER);"
                );
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS QuizList (id INTEGER PRIMARY KEY AUTOINCREMENT,quizList TEXT, date_update INTEGER);"
                );
            })
        } catch (error) {
            console.log(error)
        } finally {
            console.log("Table created")
        }
    }

    const saveQuizDB = async (data) => {
        let today = new Date();

        try {
            for (let i = 0; i < data.length; i++) {
                let send = await getQuiz(data[i].id);
                await db.transaction(async (tx) => {
                    await tx.executeSql(
                        "SELECT * From Quiz WHERE quiz_id = ?",
                        [data[i].id],
                        async (tx, results) => {
                            let len = results.rows.length;
                            if (len === 0) {
                                await tx.executeSql(
                                    "INSERT INTO Quiz (quiz_id, quiz, date_update) VALUES (?,?, ?);",
                                    [send.id, JSON.stringify(send), today.getDay()],
                                    () => {
                                        console.log("data2 added first time")
                                    },
                                    error => {
                                        console.log(error)
                                    }
                                );
                            } else if(len > 0 && quiz.date_update !== today.getDay()) {
                                await tx.executeSql(
                                    "UPDATE Quiz SET quiz_id = ?, quiz=?, date_update = ? WHERE quiz_id = ?;",
                                    [send.id, JSON.stringify(send), today.getDay(), send.id],
                                    () => {
                                        console.log("data2 updated")
                                    },
                                    error => {
                                        console.log(error)
                                    }
                                );
                            }
                        }
                    );
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const saveQuizListDB = async (data) => {
        let today = new Date();
        data = JSON.stringify(data);
        try {
            await db.transaction(async (tx)=>{
                await tx.executeSql(
                    "SELECT quizList, date_update From QuizList Where id = 1",
                    [],
                    async (tx, results) => {
                        let len = results.rows.length;
                        let quiz = results.rows.item(0);
                        if (len > 0 && quiz.date_update !== today.getDay()) {
                            await tx.executeSql(
                                "UPDATE QuizList SET quizList = ?, date_update = ? WHERE id = 1;",
                                [data, today.getDay()],
                                () => { console.log("data updated") },
                                error => {console.log(error)}
                            );
                        } else if(len === 0) {
                            await tx.executeSql(
                                "INSERT INTO QuizList (quizList, date_update) VALUES (?,?);",
                                [data, today.getDay()],
                                () => { console.log("data added first time") },
                                error => {console.log(error)}
                            );
                        }
                    }
                );
            })
        } catch (error) {
            console.log(error)
        }
    }

    

    useEffect(() => {
        homeStart()
        createTable()
    }, []);



    useEffect(() => {
        if(quizList !== undefined){
            NetInfo.fetch().then(state => {
                if(state.isConnected){
                    saveQuizListDB(quizList);
                    saveQuizDB(quizList);
                }
            });
            setLoading(false);
        }
    }, [quizList]);

    



return (
  <View style={styles.container}>
    {loading ? <ActivityIndicator/> : (
        <FlatList
          data={_.shuffle(quizList)}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
          <TouchableOpacity style={styles.barContainer} onPress={()=>navigation.navigate('Test',{name: name2,idParam: item.id})}>  
            <Text style={styles.title} >{item.name}</Text>
            <Text style={styles.tag} >{item.tags[0]}, {item.tags[1]}, {item.tags[2]}</Text>
            <Text style={styles.text} >{item.description}</Text>
          </TouchableOpacity> 
          )}
        />
    )}
      <View style={styles.footer} >
                <Button style={styles.footerButton} onPress={()=>navigation.navigate('Result')} title="Check!" />
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
    barContainer: {
            flex: 0.3,
            borderWidth: 2,
            height: 100,
            margin: 10,
          },
    footer: {
       flex: 2,
       margin: 2,
  
    },
    footerTitle: {
      padding: 10,
       textAlign: 'center',
       flex: 1,
       fontFamily: 'ChivoMono-Italic-VariableFont_wght',
       color: 'black',
       fontSize: 15,
    },
  
    footerButton: {
         flex: 1,
      },
  
      title: {
        flex: 0.3,
        color: 'black',
        fontSize: 14,
        textAlign:'center',
        fontFamily: 'ChivoMono-Italic-VariableFont_wght'
      },
      tag: {
        flex: 0.2,
        color: '#69d5ff',
        fontSize: 15,
        fontFamily: 'Caveat-VariableFont_wght'
      },
      text: {
        flex: 0.5,
        color: 'black',
        fontSize: 12,
        fontFamily: 'ChivoMono-Italic-VariableFont_wght'
      },
    });

export default Home;