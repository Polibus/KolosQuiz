import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerItem } from '@react-navigation/drawer';
import { Home, ResultScreen, Test, Score,Name,RandomTest} from '../Screens';
import CustomDrawer from './CustomDrawer';
const Drawer = createDrawerNavigator();
import _ from 'lodash';
function Routes() {
  let name = 'drawer'
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const getQuiz = async () => {
    try {
     const res = await (await fetch('https://tgryl.pl/quiz/tests')).json();
     setData(_.shuffle(res));
   } catch (error) {
     console.error(error);
   } finally {
     setLoading(false);
   }
 }


 useEffect(() => {
  getQuiz();
}, []);

  const drawerQuiz = () =>{
    return(data.map((da, index) => {
        return (
            <Drawer.Screen key={index+".drawer_quiz_"+da.id} name={da.name} component={Test}  initialParams={{name: name,idParam: da.id,data2: data}}/>
        );
    }))
  }


  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props =><CustomDrawer {...props} />}>
        <Drawer.Screen name="Name" component={Name} />
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Result" component={ResultScreen} />
        <Drawer.Screen
            name="Test"
            component={Test}
            options={{unmountOnBlur: true}}
            />
        <Drawer.Screen
            name="Score"
            component={Score}
            options={{unmountOnBlur: true}}
            />
        <Drawer.Screen
            name="Random Test"
            component={RandomTest}
            options={{unmountOnBlur: true}}
            />
        {drawerQuiz()}
      </Drawer.Navigator>
     </NavigationContainer>
     

     
  );
}

export default Routes