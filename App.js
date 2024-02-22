import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';  //importamos la librerias y componentes//
import { createStackNavigator } from '@react-navigation/stack';

//importamos la rutas//
import StackOneNavigator from './app/navigation/StackOneNavigator'; 
import { initDatabase } from './db'; //importamos la base de datos
import SQLite from 'react-native-sqlite-storage';

export default function App(){
  
useEffect(function(){
  async function init(){
    await initDatabase(); //inicializamos base de datos central
  }
  init();
}, []);


  return(
    <StackOneNavigator/> //nos redirige al login
  )
}










