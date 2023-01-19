import * as React from 'react';
import { View,StyleSheet,Button,TextInput } from 'react-native';

import _ from 'lodash';

function Name({navigation}) {
    const [name,setName] = React.useState('Name')
 
    return (
        <View style={styles.container}>
                <TextInput 
                    style={styles.input}
                    placeholder='Name'
                    onChangeText={(val) => setName(val)}
                />
                     <View style={styles.footerButton} >
                        <Button style={styles.footerButton} onPress={()=>navigation.navigate('Home',{name: name})} title="Next!" />
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

export default Name;