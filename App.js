import React from 'react';
import { AppRegistry,StyleSheet, Text, View,Image } from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import TransactionScreen from './screens/TransactionScreen';
import SearchScreen from "./screens/SearchScreen"
import LoginPage from './screens/login'


export default function App () { 

    return(<AppContainer/>)
  
  
}

const TabNavigator= createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen}
},
{
  defaultNavigationOptions:({navigation})=>({
    tabBarIcon:({})=>{
    if(navigation.state.routeName==='Transaction'){
    return(
      <Image
        source={require('./assets/assets/book.png')}
        style={{width:40,height:40}}
        />
      
    )
    }
    else if(navigation.state.routeName==='Search'){
      return(
        <Image
          source={require('./assets/assets/searchingbook.png')}
          style={{width:40,height:40}}
        />
      )
      }
    
    }
  
  })
}
)
const switchNav = createSwitchNavigator({
login:{screen:LoginPage},
TabNavigator:{screen:TabNavigator}

})

const AppContainer= createAppContainer(switchNav)

