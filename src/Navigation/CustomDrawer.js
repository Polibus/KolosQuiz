import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet,Button,TouchableOpacity,FlatList,ActivityIndicator,ToastAndroid } from "react-native";
import _ from 'lodash';
import NetInfo from "@react-native-community/netinfo";

const CustomDrawer =(props,navigation) => {
  let name='drawer'
  const [quizList, setQuizList] = useState();

  const netInfo = () => {
    NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        if(state.isConnected){
            getQuizList();
        }
        else {
            ToastAndroid.show('Internet is Off!', ToastAndroid.SHORT);
        }
    });
}

 const getQuizList = async () => {
  try {
      const response = await fetch('https://tgryl.pl/quiz/tests');
      const json = await response.json();

      setQuizList(_.shuffle(json));
      
      ToastAndroid.show('Refresh Test!', ToastAndroid.SHORT);

  } catch (error) {
      console.error(error);
  } finally {

  }
}


    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props}/>
            <DrawerItem
                label='Refresh Test'
                onPress={() => netInfo()}/> 
        </DrawerContentScrollView>


        
    )
}

const styles = StyleSheet.create({
  container: {
      flex: 2,
    },
  barContainer: {
          flex: 0.3,
        },

    title: {
      flex: 0.3,

    },
  });
export default CustomDrawer