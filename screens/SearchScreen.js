import React from 'react';
import {Text,View,StyleSheet} from 'react-native';
import db from "./config.js";
import {FlatList, TextInput, TouchableOpacity} from 'react-native-gesture-handler'

export default class SearchScreen extends React.Component{
 constructor(){
     super();
     this.state={
         allTransactions:[],
         lastVisibleTransaction:"",
         search:""
     }
 }

 searchTransaction=async(text)=>{
var enterText = text.split("")
var textUp = text.toUpperCase()
if(enterText[0].toUpperCase() ==="B"){
const query=await db.collection("transaction").where(
    "bookid","==",textUp
).get()
query.docs.map((doc)=>{
    this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastVisibleTransaction:doc,
        search:""
    })
})
}
if(enterText[0].toUpperCase() ==="S"){
    const query=await db.collection("transaction").where(
        "studentid","==",textUp
    ).get()
    query.docs.map((doc)=>{
        this.setState({
            allTransactions:[...this.state.allTransactions,doc.data()],
            lastVisibleTransaction:doc,
            search:""
        })
    })
    }
 }

 fetchMoreTransactions = async()=>{
var enterText = this.state.search.split("")
var textUp = this.state.search.toUpperCase()
if(enterText[0].toUpperCase() ==="B"){
const query=await db.collection("transaction").where(
    "bookid","==",textUp
).startAfter(this.state.lastVisibleTransaction).limit(10).get()
query.docs.map((doc)=>{
    this.setState({
        allTransactions:[...this.state.allTransactions,doc.data()],
        lastVisibleTransaction:doc,
        
    })
})
}
if(enterText[0].toUpperCase() ==="S"){
    const query=await db.collection("transaction").where(
        "studentid","==",textUp
    ).startAfter(this.state.lastVisibleTransaction).limit(10).get()
    query.docs.map((doc)=>{
        this.setState({
            allTransactions:[...this.state.allTransactions,doc.data()],
            lastVisibleTransaction:doc,
            
        })
    })
    }
 }
 componentDidMount=async()=>{
     const query=
     await db.collection("transaction").limit(10).get()
     query.docs.map((doc)=>{
     this.setState({
allTransactions:[...this.state.allTransactions,doc.data()]
     
    })
     })
    }
    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
       <View>
           <TextInput style={styles.searchBar}
           placeholder="enter book/student ID"
            onChangeText={(text)=>{
                this.setState({
                    search:text
                })
            }}/>
        <TouchableOpacity style={styles.searchButton} 
       onPress={()=>{
            this.searchTransaction(this.state.search)
        }}>
                <Text>search</Text>
            </TouchableOpacity>
       </View>
        <FlatList 
        data={this.state.allTransactions} 
        renderItem={({item})=>(
            <View 
            style={{borderBottomWidth:2}}>
            <Text>{"book Id : " + item.bookid}</Text>
            <Text>{"student Id : " + item.studentid}</Text>
            <Text>{"date : " + item.date.toDate()}</Text>
            <Text>{"transactionType : " + item.transactionType}</Text>
            </View>
        )} 
        keyExtractor={(item,index)=>index.toString()}
        onEndReached={this.fetchMoreTransactions}
        onEndThreshold={0.7}/>

        
            </View>
        )
    }
}
const styles =StyleSheet.create({
     searchBar:{ 
         flexDirection:"row",
          height:40,
           width:'auto',
            borderWidth:0.5,
             alignItems:'center',
              backgroundColor:'gray',
              marginTop:60
             }, 
             bar:{ 
                 borderWidth:2,
                  height:30, 
                  width:300, 
                  paddingLeft:10
                 },
                  searchButton:{ 
                      borderWidth:1, 
                      height:30, 
                      width:50, 
                      alignItems:'center',
                       justifyContent:'center',
                        backgroundColor:'green'
                     } 
                    })