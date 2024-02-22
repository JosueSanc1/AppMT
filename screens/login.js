import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,   //importamos componentes
  Text,
  Alert,
  Image
} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import navigation from '../navigation/StackOneNavigator';
import menu from "../screens/menu";
import {openDatabase} from 'react-native-sqlite-storage';  //importamos librerias
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
let db = openDatabase({name: 'UserDatabase5.db'});
const Login =({navigation})=> {  //creamos contantes para la validacion de datos
  const [nombre, setNombre] = useState('');
  const [contraseña, setCostraseña] = useState('');
  const [userToken, setUserToken] = useState(null);


  const handleLogin = () => {    //validacion de datos con la base de datos interna
    db.transaction(txn=>{
      txn.executeSql('SELECT * FROM table_user WHERE Nombre_Usuario=? AND Contraseña=?',
      [nombre,contraseña], //velida datos para el inicio de sesion
      (txn,result)=>{
        if(result.rows.length>0){
          Alert.alert('Inicio de sesión exitoso');//mensaje de alerta
          navigation.navigate('Menu')//nor redirige al menu 
        }else{
          Alert.alert('Inicio de sesión fallido');
        }
      })
    })
    if (nombre === 'Josue' && contraseña === '1234') {
      Alert.alert('Inicio de sesión exitoso');
      navigation.navigate('Menu')
    } else {
      Alert.alert('Inicio de sesión fallido');
    }

   
  };
    

  return (
    //diseño//
   <ScrollView>
     <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Ingenio Madre Tierra</Text> 
          
        <Image
          source= {require('../src/img/logo-menu-2.png')}
          style={styles.headerImage}
        />
      </View>
      <Text> 


      </Text>
      <Text>
        

         </Text>
      <Text> </Text>
      <Text></Text>
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
      <Text> </Text>
    <View style={styles.formContainer}>
    <View style={styles.inputContainer}>
      <Text style={styles.header}>Inicio de Sesión</Text>
        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario"
          onChangeText={(text) => setNombre(text)}
          value={nombre}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          onChangeText={(text) => setCostraseña(text)}
          value={contraseña}
        />
      </View>
      <Button title="Iniciar Sesión" onPress={handleLogin} />
    </View>
    </View>
      
   </ScrollView>
  );
}

export default Login;
 
//estilos//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    backgroundColor: 'green',
    flexDirection: 'row',
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
    position: 'absolute', // Posición absoluta
    top: 0, // Colocar en la parte superior
    
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    
  },
  headerImage: {
    width: 100, // Tamaño de la imagen
    height: 80, // Tamaño de la imagen
    marginLeft: 10, // Espacio entre el texto y la imagen
    
  },
  header: {
    fontSize: 25,
    marginBottom: 5,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: 300,
    height: 40,
    borderColor: 'green',
    borderWidth: 1,
    paddingLeft: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
});



