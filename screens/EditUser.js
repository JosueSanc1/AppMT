import {
    View,
    Text,
    StyleSheet,  //importamos componentes
    TextInput,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {openDatabase} from 'react-native-sqlite-storage';
  import {useNavigation, useRoute} from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler'; //importamos libreria
  let db = openDatabase({name: 'UserDatabase5.db'});
  const EditUser = () => {
    const route = useRoute(); //traemos los datos para modificarlos
    console.log(route.params.data);
    const navigation = useNavigation();
    const [Codigo, setCodigo]=useState(route.params.data.Codigo);
    const [nombre, setName] = useState(route.params.data.nombre);
    const [Contraseña, setCotraseña] = useState(route.params.data.Contraseña);
    const [Correo, setCorreo] = useState(route.params.data.correo);
    const [telefono, setTelefono] = useState(route.params.data.telefono);
    const [rol, setRol] = useState(route.params.data.rol);
    const updateUser = () => {
      if (!codigo || !nombre || !Contraseña || !correo || !telefono || !rol) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
      }
    
      // Otras validaciones, por ejemplo, para el formato del correo electrónico
      if (!isValidEmail(correo)) {
        Alert.alert('Error', 'El correo electrónico no es válido');
        return;
      }
      
      const lettersonlyRegex = /^[a-zA-z]+$/;
      if (!lettersonlyRegex.test(Contraseña)){
        Alert.alert('Error','La contraseña solo acepta letras como parametros');
        return;
      }

  

      db.transaction(tx => {
        tx.executeSql( //sql para actualizar//
          'UPDATE table_user set Codigo_Usuario=?, Nombre_Usuario=?, Contraseña=?, Correo_Electronico=?, Numero_de_Telefono=?, Rol=? where user_id=?',
          [Codigo, nombre, Contraseña, Correo, telefono, rol, route.params.data.id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'User updated successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('Menu'),
                  },
                ],
                {cancelable: false},
              );
            } else alert('Updation Failed');
          },
        );
      });
    };

    const isValidEmail = email => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
    };
    useEffect(() => {
      setCodigo(route.params.data.Codigo);
      setName(route.params.data.nombre);
      setCotraseña(route.params.data.Contraseña);
      setCorreo(route.params.data.correo);
      setTelefono(route.params.data.telefono);
      setRol(route.params.data.rol);
    }, []);
  
    return ( //diseño//
      <ScrollView>
        <View style={styles.container}>
        <TextInput
          placeholder="Ingrese el Codigo"
          style={[styles.input, {marginTop: 20}]}
          value={Codigo}
          onChangeText={txt => setCodigo(txt)}
        />
        <TextInput
          placeholder="Enter User Name"
          style={[styles.input, {marginTop: 20}]}
          value={nombre}
          onChangeText={txt => setName(txt)}
        />
        <TextInput
          placeholder="Ingrese la contraseña"
          value={Contraseña}
          onChangeText={txt => setCotraseña(txt)}
          style={[styles.input, {marginTop: 20}]}
        />
        <TextInput
          placeholder="Ingrese el Correo"
          value={Correo}
          onChangeText={txt => setCorreo(txt)}
          style={[styles.input, {marginTop: 20}]}
        />
         <TextInput
          placeholder="Ingrese el Telefono"
          value={telefono}
          onChangeText={txt => setTelefono(txt)}
          style={[styles.input, {marginTop: 20}]}
        />
         <TextInput
          placeholder="Ingrese el Rol"
          value={rol}
          onChangeText={txt => setRol(txt)}
          style={[styles.input, {marginTop: 20}]}
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            updateUser();
          }}>
          <Text style={styles.btnText}>Guardar Usuario</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    );
  };
  //diseño//
  export default EditUser;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      borderWidth: 0.3,
      alignSelf: 'center',
      paddingLeft: 20,
      marginTop: 100,
    },
    addBtn: {
      backgroundColor: 'green',
      width: '80%',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      alignSelf: 'center',
    },
    btnText: {
      color: '#fff',
      fontSize: 18,
    },
  });