import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Image,Dimensions } from 'react-native';
//importamos componentes
const { width } = Dimensions.get('window');
//esto sirve para el ajuste de las pantalllas
export default function MenuScreen({ navigation }) { //estos nos ayudara a redirigir
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const menuItems = [
    //menu//
    { text: 'Agregar Usuario', imageSource: require('../src/img/add-user_4175032.png'), screenName: 'CRUD' },
    //cuando seleccionamos un boton nos redirige a la pantalla que tiene asociada
    { text: 'Usuarios', imageSource: require('../src/img/group_681494.png'), screenName: 'Usuarios' },
    { text: 'Crear Informes', imageSource: require('../src/img/reporte.png'), screenName: 'Crear Informes' },
    { text: 'Informes', imageSource: require('../src/img/listaReporte.png'), screenName: 'Informes' },
  ];

  return (

    //diseño
    <View style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Ingenio Madre Tierra</Text>
      <Image
        source={require('../src/img/logo-menu-2.png')}
        style={styles.headerImage}
      />
    </View>
    <Text> </Text>
    <Text style={styles.header}>Menú</Text>

    <View style={styles.menuContainer}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuButton}
          onPress={() => navigateToScreen(item.screenName)}
        >
          <Image source={item.imageSource} style={styles.buttonImage} />
          <Text style={styles.buttonText}>{item.text}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={require('../src/img/exit.png')} style={styles.buttonImage} />
        <Text style={styles.buttonText}>Salir</Text>
      </TouchableOpacity>
    </View>
  </View>


    
  );
}
//estilo
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
    position: 'absolute',
    top: 0,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  headerImage: {
    width: 100,
    height: 80,
    marginLeft: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    backgroundColor: 'white',
    width: (width / 2) - 16,
    margin: 8,
    padding: 10,
    borderRadius: 5,
    borderColor: 'black', // Agrega un borde negro
    borderWidth: 1, // Grosor del borde
    alignItems: 'center',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
});