import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo'; // Importar NetInfo para verificar la conexión
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({ name: 'UserDatabase5.db' });

const Home = () => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getData();
    checkInternetConnection();
  }, []);

  const checkInternetConnection = async () => {
    const netInfoState = await NetInfo.fetch();
    if (netInfoState.isConnected) {
      syncDataWithWebService();
    }
  };

  const syncDataWithWebService = async () => {
    try {
      const response = await axios.get('/api/v1/getUsuarios');
      const users = response.data;
      setUserList(users);
      saveDataToLocalDatabase(users);
    } catch (error) {
      console.error('Error al sincronizar datos con el servicio web', error);
    }
  };

  const saveDataToLocalDatabase = (users) => {
    db.transaction((txn) => {
      txn.executeSql('DROP TABLE IF EXISTS table_user', []);
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, Nombre_Usuario TEXT, Contraseña TEXT, Correo_Electronico TEXT)',
        []
      );
      users.forEach((user) => {
        txn.executeSql(
          'INSERT INTO table_user (Nombre_Usuario, Contraseña, Correo_Electronico) VALUES (?, ?, ?)',
          [user.Nombre_Usuario, user.Contraseña, user.Correo_Electronico]
        );
      });
    });
  };

  const getData = () => {
    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM table_user', [], (tx, res) => {
        var temp = [];
        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        setUserList(temp);
      });
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userList}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.itemText}>{'Nombre: ' + item.Nombre_Usuario}</Text>
            <Text style={styles.itemText}>{'Contraseña: ' + item.Contraseña}</Text>
            <Text style={styles.itemText}>{'Correo: ' + item.Correo_Electronico}</Text>
          </View>
        )}
        keyExtractor={(item) => item.user_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userItem: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
});

export default Home;
