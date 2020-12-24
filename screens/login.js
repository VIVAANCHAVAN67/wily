import React from 'react';
import {Text, View,TouchableOpacity,StyleSheet,Image,
    ToastAndroid,KeyboardAvoidingView,Alert} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from "firebase"
import db from "./config.js"

class LoginPage extends  React.Component{
    constructor(){
        super()
        this.state={
            email:"",
            password:""
        }
    }

    login = async(email,password)=>{
        if(email && password){
        try{
            const response=
            await firebase.auth().signInWithEmailAndPassword(email, password)
     if(response){
         this.props.navigation.navigate("Transaction")
     }
        }
        catch(error){
switch(error.code){
    case "auth/user-not-found":
        Alert.alert("user not found")
        break
        case "auth/invalid-email":
            Alert.alert("incorrect email/password")
            break
}
        }
        }
        else{
            Alert.alert("enter email/password")
        }
    }
    render(){
        return(
            <KeyboardAvoidingView style={{
                alignItems:'center',
                marginTop:50
            }}>
                <View>
                <Image 
            source={require("../assets/assets/booklogo.jpg")} 
            style={{width:150,
            height:150}}/>
                <Text style={{
                    marginTop:100,
                    marginLeft:50,
                    textAlign:'center',
                    fontSize:24
                }}>
                    WILY
                </Text>
                </View>
                <View >
                    <TextInput style={styles.loginBox} 
                    placeholder="abcxyz@gmail.com"
                    keyboardType="email-address"
                    onChangeText={(text)=>{
                        this.setState({
                            email:text,
                        })
                    }}/>
                    <TextInput style={styles.loginBox} 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.setState({
                            password:text,
                        })
                    }}/>                 
                </View>
                <View>
                    <TouchableOpacity style={{
                        height:40,
                        width:100,
                        borderWidth:1,
                        borderRadius:7,
                        paddingTop:7
                        }}
                        onPress={()=>{
                            this.login(this.state.email,
                                this.state.password)
                        }}>
<Text>login</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
export default LoginPage 

const styles=
StyleSheet.create({ 
    loginBox:{
         width:300,
          height:40,
           borderWidth:1.5,
            fontSize:20,
             margin:10,
              paddingLeft:10
             } 
            })