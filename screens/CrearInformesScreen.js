import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  Image,
  PermissionsAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera,launchImageLibrary } from 'react-native-image-picker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFetchBlob from 'rn-fetch-blob';
import { Picker } from '@react-native-picker/picker';
 // Asegúrate de importar ImagePickerResponse
import { openDatabase } from 'react-native-sqlite-storage';
import moment from 'moment';
import { base64 } from 'react-native-fs';

let db = openDatabase({ name: 'UserDatabase5.db' });

export default function CrearInformeScreen() {
  const navigation = useNavigation();
  const [fecha, setFecha] = useState(new Date());
  const [tipoInspeccion, setTipoInspeccion] = useState('');
  const [hallazgos, setHallazgos] = useState('');
  const [takePhoto, setTakePhoto]= useState();
  const [selectPhoto, setSelectPhoto]= useState();
  const [selectedArea, setSelectedArea] = useState('');
  const [takePhoto2, setTakePhoto2]= useState();
  const [selectPhoto2, setSelectPhoto2]= useState();
  const [takePhoto3, setTakePhoto3]= useState();
  const [selectPhoto3, setSelectPhoto3]= useState();
  const [hallazgos2, setHallazgos2] = useState('');
  const [pdfPath, setPdfPath] = useState('');
  const [takePhoto4, setTakePhoto4]= useState();
  const [selectPhoto4, setSelectPhoto4]= useState();
  const [takePhoto5, setTakePhoto5]= useState();
  const [selectPhoto5, setSelectPhoto5]= useState();
  const [takePhoto6, setTakePhoto6]= useState();
  const [selectPhoto6, setSelectPhoto6]= useState();
  const [hallazgos3, setHallazgos3] = useState('');
  const [tiposInspeccion, setTiposInspeccion] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedTipoInspeccion, setSelectedTipoInspeccion] = useState('');
  const [evidencia1, setEvidencia1] = useState('');
  const [evidencia2, setEvidencia2] = useState('');
  const [area, setArea] = useState('');
  useEffect(() => {
    // Función para realizar la solicitud GET al endpoint del catálogo
    const fetchCatalogos = async () => {
      try {
        const response = await fetch('', {
          method: 'GET',
          headers: {
            Authorization: '', // Reemplaza con tu token real
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los catálogos');
        }

        const data = await response.json();

        // Guardar en SQLite3
        db.transaction(txn => {
          // Crear tabla para el catálogo de áreas
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS area (id INTEGER PRIMARY KEY, nombre TEXT, estado TEXT)',
            []
          );

          // Crear tabla para el catálogo de tipos de inspección
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS tipo_inspeccion (id INTEGER PRIMARY KEY, nombre TEXT, descripcion TEXT, estado TEXT)',
            []
          );

          // Insertar datos en la tabla de áreas
          data.area.forEach(area => {
            txn.executeSql('INSERT INTO area (id, nombre, estado) VALUES (?, ?, ?)', [
              area.id,
              area.nombre,
              area.estado,
            ]);
          });

          // Insertar datos en la tabla de tipos de inspección
          data.tipo_inspeccion.forEach(tipo => {
            txn.executeSql(
              'INSERT INTO tipo_inspeccion (id, nombre, descripcion, estado) VALUES (?, ?, ?, ?)',
              [tipo.id, tipo.nombre, tipo.descripcion, tipo.estado]
            );
          });
        });

        // Actualizar estados con los datos obtenidos
        setAreas(data.area);
        setTiposInspeccion(data.tipo_inspeccion);
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al obtener los catálogos.');
        console.error(error);
      }
    };

    // Llamar a la función para obtener los catálogos al cargar el componente
    fetchCatalogos();
  }, []);
 
  const generatePdf = async () => {
    //funcion para crear el pdf
    const informesDir = `${RNFetchBlob.fs.dirs.DownloadDir}/Informes`;
    const imageSource=source= require('../src/img/descarga.jpg');
    const htmlContent = `
    <html>
    <head>
        <style>
        .container {
          width: 100%;
          border: 2px solid #000;
          display: flex;
          flex-direction: column;
      }

      .header {
          display: flex;
          border-bottom: 1px solid #000;
      }

      .image {
          width: 10%;
          border-right: 1px solid #000;
          display: flex;
          justify-content: center;
          align-items: center;
      }
      .image img {
          max-height: 100px; /* La imagen se ajustará a la altura de la columna */
          max-width: 100px; /* Asegura que la imagen no se desborde */
      }

      .title {
          width: 70%;
          text-align: center;
          border-right: 1px solid #000;
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .info {
          width: 20%;
          display: flex;
          flex-direction: column;
          border-top: 1px solid #000; 
      }

      .info-line {
          flex: 25%;
          
          border-bottom: 1px solid #000;
      }

      .info-line:last-child {
          border-top: 1px solid #000; 
          border: none;
          display: flex;
          justify-content: flex-start;
          align-items: center;
      }

      .column {
          display: flex;
          border-top: 1px solid #000;
          padding: 10px;
      }

      .column-left {
          flex: 45%;
      }

      .column-right {
          flex: 55%;
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
      }
      .sanitarios {
          display: flex;
          border-top: 1px solid #000;
          padding: 10px;
          text-align: center;
          justify-content: center;
          align-items: center;
      }
      .images {
          display: flex;
          border-top: 1px solid #000;
          padding: 10px;
          flex: 100;
      }

      .image-left, .image-right {
          flex: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .image-left img, .image-right img {
          max-width: 175px; /* Ajusta el ancho máximo de ambas imágenes */
          max-height: 175px; /* Ajusta la altura máxima de ambas imágenes */
      }
      
      .line-divider {
          border-left: 1px solid #000;
          height: 100%; /* Asegura que la línea tenga la misma altura que la última columna */
      }

      .hallazgos {
          display: flex;
          border-top: 1px solid #000;
          padding: 10px;
          text-align: center;
          justify-content: center;
          align-items: center;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="image">
                    <img src="${imageSource}" alt="Imagen">
                </div>
                <div class="title">
                    Informe de Inspección
                </div>
                <div class="info">
                    <div class="info-line">Código: 1-RH-G-R-017</div>
                    <div class="info-line">Versión: 3</div>
                    <div class="info-line">Fecha: 04/11/2019</div>
                    <div class="info-line">Página 1 de 1</div>
                </div>
            </div>
            <div class="column">
                <div class="column-left">
                    Área  ${area}
                </div>
                <div class="column-right">
                    <div>
                        Fecha: ${fecha}
                    </div>
                    <div>
                        Tipo de Inspección: ${tipoInspeccion}
                    </div>
                </div>
            </div>
            <div class="hallazgos">
                <text>hallazgos</text>
            </div>
            <div class="sanitarios">
                ${hallazgos}
            </div>
            <div class="images">
                <div class="image-left">
                    <img src="${takePhoto ?takePhoto : selectPhoto}" alt="Imagen 1">
                </div>
                <div class="line-divider"></div> <!-- Línea divisoria -->
                <div class="image-right">
                    <img src="${takePhoto2 ?takePhoto2 : selectPhoto2}" alt="Imagen 2">
                </div>
            </div>
            <div class="hallazgos">
            <text>hallazgos</text>
        </div>
        <div class="sanitarios">
            ${hallazgos2}
        </div>
        <div class="images">
            <div class="image-left">
                <img src="${takePhoto4 ?takePhoto4 : selectPhoto4}" alt="Imagen 3">
            </div>
            <div class="line-divider"></div> <!-- Línea divisoria -->
            <div class="image-right">
                <img src="${takePhoto5 ?takePhoto5 : selectPhoto5}" alt="Imagen 4">
            </div>
        </div>
        <div class="hallazgos">
            <text>hallazgos</text>
        </div>
        <div class="sanitarios">
              ${hallazgos3}
        </div>
        <div class="images">
            <div class="image-left">
                <img src="${takePhoto5 ?takePhoto5 : selectPhoto5}" alt="Imagen 1">
            </div>
            <div class="line-divider"></div> <!-- Línea divisoria -->
            <div class="image-right">
                <img src="${takePhoto6 ?takePhoto6 : selectPhoto6}" alt="Imagen 2">
            </div>
        </div>
        </div>
    </body>
    </html>
    `;


    const options = {
      html: htmlContent,
      fileName: 'Informe',
      directory: informesDir,
      image: { type: 'jpeg', quality: 0.10 },
    };

    try {
      const pdfFile = await RNHTMLtoPDF.convert(options);
      setPdfPath(pdfFile.filePath);
  
      const pdfBase64 = await RNFetchBlob.fs.readFile(pdfFile.filePath, 'base64');
      console.log('PDF en formato base64:', pdfBase64);
  
      // Resto del código...
    } catch (error) {
      console.error('Error al generar o guardar el informe:', error);
    }
    
  };

  

 

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_informes'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_informes', []);
            txn.executeSql('CREATE TABLE IF NOT EXISTS table_informes(informe_id INTEGER PRIMARY KEY AUTOINCREMENT, Area NVARCHAR(255), Fecha date not null, Tipo_de_Inspeccion NVARCHAR(255) not null, Hallazgos NVARCHAR(255) not null, Evidencia1 NVARCHAR(255) not null, Evidencia2 NVARCHAR(255)not null)',
              [],);
          } 
          else {
            console.log('already created table');
          }
        },
      );
    });
  }, []);



  const handleSave = () => {
    // Validación de la fecha
 
    const isValidDate = moment(fecha, 'DD/MM/YYYY', true).isValid();
    if (!isValidDate) {
      Alert.alert(
        'Error',
        'La fecha ingresada no es válida. Por favor, ingrese una fecha válida en el formato dd-mm-yyyy.',
        [{ text: 'Ok' }]
      );
      return;
    }



    db.transaction(txn =>{
      txn.executeSql(
        'INSERT INTO table_informes (Area, Fecha, Tipo_de_Inspeccion, Hallazgos, Evidencia1, Evidencia2) VALUES (?,?,?,?,?,?)',
        [area,fecha,tipoInspeccion,hallazgos,takePhoto ?takePhoto : selectPhoto,takePhoto2 ?takePhoto2 : selectPhoto2],
        (tex,res)=>{
          if(res.rowsAffected==1){
             Alert.alert(
          'Succes',
          'Informe Creado',
          [
            {
              text: 'Ok',
            }
          ],
          {
            cancelable: false
          }
        );
            
          }else{
            console.log(res);
          }
          
        },
        error => {
          console.log(error);
        },
      );
     });  

      // Limpia los campos de texto y fecha
     setArea('');
     setFecha(new Date());
     setTipoInspeccion('');
     setHallazgos('');
     setHallazgos2('');
     setHallazgos3('');

  // Otros campos de texto se pueden limpiar de la misma manera

  // Limpia las imágenes
     setTakePhoto(null);
     setSelectPhoto(null);
     setTakePhoto2(null);
     setSelectPhoto2(null);
     setTakePhoto3(null);
     setSelectPhoto3(null);
     setTakePhoto4(null);
     setSelectPhoto4(null);
     setTakePhoto5(null);
     setSelectPhoto5(null);
     setTakePhoto6(null);
     setSelectPhoto6(null);


    console.log('Informe guardado');

    
  };


  const options = {
    mediaType: 'photo',
    title: 'Select Image',
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.2,
  };

  const hadleSelectPhoto = async () => {
    const result = (await launchImageLibrary(options))  // Asumiendo que tienes la función launchImageLibrary disponible
    setSelectPhoto(result.assets[0].uri);
  };

  const hadleTakePhoto = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = (await launchCamera(options))  // Asumiendo que tienes la función launchCamera disponible
      setTakePhoto(result.assets[0].uri);
    }
  };

  const hadleSelectPhoto2 = async () => {
    const result = (await launchImageLibrary(options))  // Asumiendo que tienes la función launchImageLibrary disponible
    setSelectPhoto2(result.assets[0].uri);
    console.log('result', result)
  };

  const hadleTakePhoto2 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = (await launchCamera(options))  // Asumiendo que tienes la función launchCamera disponible
      setTakePhoto2(result.assets[0].uri);
      console.log('result',result)
    }
  };

  const hadleSelectPhoto3 = async () => {
    const result = (await launchImageLibrary(options))  // Asumiendo que tienes la función launchImageLibrary disponible
    setSelectPhoto3(result.assets[0].uri);
    console.log('result', result)
  };

  const hadleTakePhoto3 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = (await launchCamera(options))  // Asumiendo que tienes la función launchCamera disponible
      setTakePhoto3(result.assets[0].uri);
      console.log('result',result)
    }
  };

  const hadleSelectPhoto4 = async () => {
    const result = (await launchImageLibrary(options))  // Asumiendo que tienes la función launchImageLibrary disponible
    setSelectPhoto4(result.assets[0].uri);
    console.log('result', result)
  };

  const hadleTakePhoto4 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = (await launchCamera(options))  // Asumiendo que tienes la función launchCamera disponible
      setTakePhoto4(result.assets[0].uri);
      console.log('result',result)
    }
  }

  const hadleSelectPhoto5 = async () => {
    const result = (await launchImageLibrary(options))  // Asumiendo que tienes la función launchImageLibrary disponible
    setSelectPhoto5(result.assets[0].uri);
    console.log('result', result)
  };

  const hadleTakePhoto5 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = (await launchCamera(options))  // Asumiendo que tienes la función launchCamera disponible
      setTakePhoto5(result.assets[0].uri);
      console.log('result',result)
    }
  };

  const hadleSelectPhoto6 = async () => {
    const result = (await launchImageLibrary(options))  // Asumiendo que tienes la función launchImageLibrary disponible
    setSelectPhoto6(result.assets[0].uri);
    console.log('result', result)
  };

  const hadleTakePhoto6 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = (await launchCamera(options))  // Asumiendo que tienes la función launchCamera disponible
      setTakePhoto6(result.assets[0].uri);
      console.log('result',result)
    }
  };

  const visualizarPDF = async () => {

    navigation.navigate('Informes');
  };


  return (
    <ScrollView >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Ingenio Madre Tierra</Text>
          
        <Image
          
          source= {require('../src/img/logo-menu-2.png')}
          style={styles.headerImage}
          
        />
      </View>
      <Text style={styles.header}></Text>
      
        
      <Text style={styles.Titulo}>Informes de Inspeccion</Text>
      <Text>Área:</Text>
      <Picker
        selectedValue={selectedArea}
        onValueChange={(itemValue) => setSelectedArea(itemValue)}
      >
        <Picker.Item label="Seleccione un área" value="" />
        {areas.map((area) => (
          <Picker.Item key={area.id} label={area.nombre} value={area.id} />
        ))}
      </Picker>
      <Text>Fecha:</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setFecha(text)}
        value={fecha}
      />
      <Text>Tipo de Inspección:</Text>
      <Picker
        selectedValue={selectedTipoInspeccion}
        onValueChange={(itemValue) => setSelectedTipoInspeccion(itemValue)}
      >
        <Picker.Item label="Seleccione un tipo de inspección" value="" />
        {tiposInspeccion.map((tipoInspeccion) => (
          <Picker.Item key={tipoInspeccion.id} label={tipoInspeccion.nombre} value={tipoInspeccion.id} />
        ))}
      </Picker>
      <Text>Hallazgos:</Text>
      <TextInput
        style={styles.textarea}
        multiline
        onChangeText={(text) => setHallazgos(text)}
        value={hallazgos}
      />
      <Text>Evidencia 1:</Text>
      
      <Button  title='Seleccionar foto' onPress={hadleSelectPhoto}/>
      <Text> </Text>
      <Button title='tomar foto' onPress={hadleTakePhoto}/>
      <Text> </Text>
      <Text>(espacio para la foto)</Text>
      <Image value={evidencia1}
      source={{uri: takePhoto ?takePhoto : selectPhoto}} style={styles.evidenceImage}/>

      <Text>Evidencia 2:</Text>
      
      <Button

       title='Seleccionar foto' onPress={hadleSelectPhoto2}/>
      <Text> </Text>
      <Button title='tomar foto' onPress={hadleTakePhoto2}/>
      <Text> </Text>
      <Text>(espacio para la foto)</Text>
      <Image value={evidencia2}
      source={{uri: takePhoto2 ?takePhoto2 : selectPhoto2}} style={styles.evidenceImage2}/>
    
      <Text>Hallazgos:</Text>
      <TextInput
        style={styles.textarea}
        multiline
        onChangeText={(text) => setHallazgos2(text)}
        value={hallazgos2}
      />
      <Text>Evidencia 1:</Text>
      
      <Button  title='Seleccionar foto' onPress={hadleSelectPhoto4}/>
      <Text> </Text>
      <Button title='tomar foto' onPress={hadleTakePhoto4}/>
      <Text> </Text>
      <Text>(espacio para la foto)</Text>
      <Image 
      source={{uri: takePhoto4 ?takePhoto4 : selectPhoto4}} style={styles.evidenceImage}/>

      <Text>Evidencia 2:</Text>
      
      <Button

       title='Seleccionar foto' onPress={hadleSelectPhoto3}/>
      <Text> </Text>
      <Button title='tomar foto' onPress={hadleTakePhoto3}/>
      <Text> </Text>
      <Text>(espacio para la foto)</Text>
      <Image 
      source={{uri: takePhoto3 ?takePhoto3 : selectPhoto3}} style={styles.evidenceImage2}/>

      <Text>Hallazgos:</Text>
      <TextInput
        style={styles.textarea}
        multiline
        onChangeText={(text) => setHallazgos3(text)}
        value={hallazgos3}
      />
      <Text>Evidencia 1:</Text>
      
      <Button  title='Seleccionar foto' onPress={hadleSelectPhoto5}/>
      <Text> </Text>
      <Button title='tomar foto' onPress={hadleTakePhoto5}/>
      <Text> </Text>
      <Text>(espacio para la foto)</Text>
      <Image 
      source={{uri: takePhoto5 ?takePhoto5 : selectPhoto5}} style={styles.evidenceImage}/>

      <Text>Evidencia 2:</Text>
      
      <Button

       title='Seleccionar foto' onPress={hadleSelectPhoto6}/>
      <Text> </Text>
      <Button title='tomar foto' onPress={hadleTakePhoto6}/>
      <Text> </Text>
      <Text>(espacio para la foto)</Text>
      <Image 
      source={{uri: takePhoto6 ?takePhoto6 : selectPhoto6}} style={styles.evidenceImage2}/>

    


      <Text> Acciones :</Text>
      <Button title="Guardar" onPress={() => { handleSave(); generatePdf(); }} />
      
      <Text> </Text>

      
      <Text> </Text>
      <Button title="visualizar" onPress={visualizarPDF} />
      {/* Agregar más botones según sea necesario */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 
  headerContainer: {
    backgroundColor: 'green',
    flexDirection: 'row',
    paddingVertical: 20,
    width: '105%',
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
    fontSize: 24,
    marginBottom: 100,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textarea: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
    
  },
  
  buttonText: {
    color: 'white',
  },
  evidenceImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    textAlign: 'center',
  },
  Titulo:{
    fontSize: 24,
    textAlign:"center",
  },

  formGroup: {
    marginBottom: 20,
  },
  
  imagen:{
    with:200,
    height:500,
  },
  evidenceImage2: {
    width: 200,
    height: 200,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  
});

