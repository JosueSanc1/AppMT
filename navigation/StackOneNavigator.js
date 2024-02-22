import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import Login from "../screens/login";
import Menu from "../screens/menu";
import CrudScreen from "../screens/CrudScreen";
import CrearInformesScreen from "../screens/CrearInformesScreen";
import InformesScreen from "../screens/InformesScreen";
import Usuarios from "../screens/Usuarios"; //importamos los componentes
import EditUser from "../screens/EditUser";

const stack = createStackNavigator();

const StackOneNavigator =()=>(
    <NavigationContainer>
        <stack.Navigator
        initialRouteName="login" //cuando se inicia la app lo redirige al login
        //le creamos un nombre y le colocamos el componente para redirigir
    >   
        <stack.Screen name = "login" component={Login}/>
        <stack.Screen name = "Menu" component={Menu}/>
        <stack.Screen name = "CRUD" component={CrudScreen}/> 
        <stack.Screen name = "Crear Informes" component={CrearInformesScreen}/>
        <stack.Screen name = "Informes" component={InformesScreen}/>
        <stack.Screen name = "Usuarios" component={Usuarios}/>
        <stack.Screen name = "EditUser" component={EditUser}/>
        
        </stack.Navigator>       

    </NavigationContainer>
)

export default StackOneNavigator;