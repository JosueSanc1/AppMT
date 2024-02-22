import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import PDFView from 'react-native-pdf'; //librerias//
import Share from 'react-native-share';

export default function VisualizarInformesScreen() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const informesDir = `${RNFetchBlob.fs.dirs.DownloadDir}/Informes`;

    RNFetchBlob.fs.exists(informesDir)
      .then((exists) => {
        if (!exists) {
          return RNFetchBlob.fs.mkdir(informesDir);
        }
        return Promise.resolve();
      })
      .then(() => {
        return RNFetchBlob.fs.ls(informesDir);
      })
      .then((files) => {
        const pdfFiles = files.filter((file) => file.toLowerCase().endsWith('.pdf'));
        setPdfFiles(pdfFiles);
      })
      .catch((error) => {
        console.error('Error al leer archivos en la carpeta "Informes":', error);
      });
  }, []);

  const renderPdfItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pdfItem}
      onPress={() => setSelectedPdf(item)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  const handleSharePDF = (pdfFileName) => {
    const pdfPath = `${RNFetchBlob.fs.dirs.DownloadDir}/Informes/${pdfFileName}`;
    const options = {
      type: 'application/pdf',
      url: `file://${pdfPath}`,
    };

    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <View style={styles.container}>
      {selectedPdf ? (
        <View style={styles.pdfView}>
          <PDFView
            source={{ uri: `${RNFetchBlob.fs.dirs.DownloadDir}/Informes/${selectedPdf}`, cache: true }}
            style={styles.pdfView}
          />
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleSharePDF(selectedPdf)}
          >
            <Text style={styles.shareButtonText}>Compartir PDF</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pdfFiles}
          keyExtractor={(item) => item}
          renderItem={renderPdfItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfView: {
    flex: 1,
  },
  pdfItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  shareButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
  },
});
