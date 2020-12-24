import React from 'react';
import {Text, View,TouchableOpacity,StyleSheet,Image,
    ToastAndroid,KeyboardAvoidingView,Alert} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import { TextInput } from 'react-native-gesture-handler';
import firebase from "firebase"
import db from "./config.js"




export default class BookTransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermissions:null,
            scanned:false,
            scannedData:'',
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:""
        }
    }
    checkStudentEligibilityReturn=async()=>{
const transRef=
await db.collection("transaction").where(
    "bookid","==",this.state.scannedBookId
).limit(1)
.get()
   var isStudentEligible=""
   transRef.docs.map((doc)=>{
       var lastTransaction=doc.data()
       if(lastTransaction.studentid===this.state.scannedStudentId){
           isStudentEligible=true
       }
       else{
           isStudentEligible=false
           Alert.alert("book wasnt issued by the student")
           this.setState({
            scannedBookId:"",
            scannedStudentId:""
        })
       }
   })
   return isStudentEligible
}

checkStudentEligibilityIssue=async()=>{
    const issueRef=
    await db.collection("students").where(
        "STUDENTid","==",this.state.scannedStudentId
    ).get()
 var isStudentEligible=""   
 if(issueRef.docs.length===0){
     isStudentEligible=false
     this.setState({
         scannedBookId:"",
         scannedStudentId:""
     })
     Alert.alert("student dosent exist")
 }
 else{
     issueRef.docs.map((doc)=>{
         var student=doc.data()
         if(student.NoOfBooksIssued<2){
             isStudentEligible=true
         }
         else{
             isStudentEligible=false
             Alert.alert("has issued more than 2 books")
             this.setState({
                scannedBookId:"",
                scannedStudentId:""
            })
            }
     })
 }
 return isStudentEligible
}

  checkBookEligibility=async()=>{
  const BookRef= 
  await db.collection("books").where(
  "Bookid","==",this.state.scannedBookId
      ) .get()
    var transactionType=""
      if(BookRef.docs.length===0){
        transactionType=false
      }
      else{
          BookRef.docs.map((doc)=>{
              var book=doc.data()
              if(book.bookavailibility===true){
                  transactionType="issue"
              }
              else{
                  transactionType="return"
              }
          })
      }
      return transactionType
  }
    initiateBookIssue=async()=>{
       console.log("issue")
    db.collection("books").doc(this.state.scannedBookId).update({
        bookavailibility:false
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
        NoOfBooksIssued:firebase.firestore.FieldValue.increment(1)
    })
    db.collection("transaction").add({
    "studentid":this.state.scannedStudentId,
    "bookid":this.state.scannedBookId,
    "date":firebase.firestore.Timestamp.now().toDate(),
    "transactionType":"issued"
    })
    this.setState({
        scannedBookId:"",
        scannedStudentId:""
    })
   }
   initiateBookReturn=async()=>{
    db.collection("books").doc(this.state.scannedBookId).update({
        bookavailibility:true
    })
    db.collection("students").doc(this.state.scannedStudentId).update({
        NoOfBooksIssued:firebase.firestore.FieldValue.increment(-1)
    })
    db.collection("transaction").add({
    "studentid":this.state.scannedStudentId,
    "bookid":this.state.scannedBookId,
    "date":firebase.firestore.Timestamp.now().toDate(),
    "transactionType":"returned"
    })
    this.setState({
        scannedBookId:"",
        scannedStudentId:""
    })
   }
    handleTransaction=async()=>{
var transactionType=await this.checkBookEligibility()
if(! transactionType){
    Alert.alert("book dosen't exist")
    this.setState({
        scannedBookId:"",
        scannedStudentId:""
    })
}
else if(transactionType==="issue"){
    var isStudentEligible =await this.checkStudentEligibilityIssue()
    if(isStudentEligible===true){
        this.initiateBookIssue()
        transactionMessage="Book Issued"
        ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
    }
}
else {
    var isStudentEligible =await this.checkStudentEligibilityReturn()
    if(isStudentEligible===true){
        this.initiateBookReturn()
        transactionMessage="Book Returned"
        ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
    }
}

    }
    getCameraPermission =async(id)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions:status=== "granted",
            buttonState:id,
            scanned:false
        })
    }
    handleBarCodeScanned=async({type,data})=>{
        if(this.state.buttonState==="bookId")
        this.setState({
            scanned:true,
            scannedBookId:data,
            buttonState:'normal'
        })
        if(this.state.buttonState==="studentId")
        this.setState({
            scanned:true,
            scannedStudentId:data,
            buttonState:'normal'
        })
        

    }
    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState= this.state.buttonState;
        if(buttonState!='normal' && hasCameraPermissions){
            return(
                <BarCodeScanner
                    onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
                style = {StyleSheet.absoluteFillObject}
            />)
        }
        else if(buttonState === 'normal'){
            return(
                
                <KeyboardAvoidingView style={styles.container} behavior= "padding" enabled>
                    <View>
                        <Image 
                        source={require("../assets/assets/booklogo.jpg")}
                        style ={{width:200,height:200}}
                        />
                        <Text style={{textAlign:'center',fontSize:30}}>Wily</Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput style={styles.inputBox}
                        placeholder="Book Id"
                        onChangeText={
                            text=>this.setState({scannedBookId:text})
                        }
                        value={this.state.scannedBookId}/>
                        <TouchableOpacity onPress={()=>{this.getCameraPermission("bookId")}}
                        style ={styles.scanButton} >
                            <Text>Scan </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                    <TextInput style={styles.inputBox}
                    placeholder="StudentId Id"
                    onChangeText={
                        text =>this.setState({scannedStudentId:text})
                    }
                    value={this.state.scannedStudentId}/>
                    <TouchableOpacity onPress={()=>{this.getCameraPermission("studentId")}}
                    style ={styles.scanButton}>
                        <Text>Scan </Text>
                    </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={async()=>{this.handleTransaction() }}>
                       <Text>SUBMIT</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    }
  });