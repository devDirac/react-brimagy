import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { numericFormatter } from "react-number-format";

// Registrar fuentes
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

interface Canje {
  id: number;
  folio: string;
  nombre_usuario: string;
  email: string;
  phone: number;
  number_of_awards: string;
  size: string;
  color: string;
  category: string;
  puntos_canjeados: string;
  nombre_premio: string;
  costo_premio: string;
  sku: string;
  calle: string;
  numero_calle: string;
  colonia: string;
  codigo_postal: number;
  municipio: string;
  numero_interior: string;
  between_1: string;
  between_2: string;
  referencia_adicional: string;
  creacion_canje: string;
  estado_canje: string;
  estado_validacion: string;
}

interface PDFCanjeProps {
  canje: Canje;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 150,
    height: 110,
    marginBottom: 4,
    alignSelf: "center",
    objectFit: "contain",
  },
  header: {
    marginBottom: 15,
    textAlign: "center",
    borderBottom: "2 solid #084d6e",
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    color: "#084d6e",
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 12,
  },
  statusBox: {
    width: "30%",
    padding: 6,
    borderRadius: 3,
    textAlign: "center",
  },
  statusLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 9,
    fontWeight: "bold",
  },
  statusPendiente: {
    backgroundColor: "#fff3cd",
    border: "1 solid #ffc107",
  },
  statusAprobado: {
    backgroundColor: "#d4edda",
    border: "1 solid #28a745",
  },
  statusCancelada: {
    backgroundColor: "#f8d7da",
    border: "1 solid #dc3545",
  },
  section: {
    marginBottom: 12,
    border: "1 solid #e0e0e0",
    borderRadius: 3,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#084d6e",
    fontWeight: "bold",
    marginBottom: 8,
    borderBottom: "1 solid #e0e0e0",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  fieldContainer: {
    width: "50%",
    paddingRight: 8,
  },
  fieldContainer25: {
    width: "25%",
    paddingRight: 8,
  },
  fieldContainerFull: {
    width: "100%",
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 9,
    color: "#000",
    fontWeight: "bold",
  },
  doubleColumn: {
    flexDirection: "row",
    marginBottom: 5,
  },
  doubleContainer: {
    width: "50%",
    paddingRight: 4,
  },
  doubleLabel: {
    fontSize: 7,
    color: "#666",
    marginBottom: 1,
  },
  doubleValue: {
    fontSize: 8,
    color: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 7,
    color: "#999",
    borderTop: "1 solid #e0e0e0",
    paddingTop: 8,
  },
});

const PDFCanje: React.FC<PDFCanjeProps> = ({ canje }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CANJE DE PREMIO</Text>
          <Text style={styles.subtitle}>Folio. {canje.folio}</Text>
        </View>

        {/* Información del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Cliente</Text>
          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nombre</Text>
              <Text style={styles.fieldValue}>{canje.nombre_usuario}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Correo</Text>
              <Text style={styles.fieldValue}>{canje.email}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Teléfono</Text>
              <Text style={styles.fieldValue}>{canje.phone}</Text>
            </View>
          </View>
        </View>

        {/* Información del premio canjeado */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Premio</Text>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nombre del premio</Text>
              <Text style={styles.fieldValue}>{canje.nombre_premio}</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Tamaño</Text>
              <Text style={styles.doubleValue}>{canje.size}</Text>
            </View>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Color</Text>
              <Text style={styles.doubleValue}>{canje.color}</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Categoría</Text>
              <Text style={styles.doubleValue}>{canje.category}</Text>
            </View>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>SKU</Text>
              <Text style={styles.doubleValue}>{canje.sku}</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Costo</Text>
              <Text style={styles.doubleValue}>
                {numericFormatter(canje.costo_premio + "", {
                  thousandSeparator: ",",
                  decimalScale: 2,
                  fixedDecimalScale: true,
                  prefix: "",
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Información de la dirección de envío */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección del envío</Text>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Calle</Text>
              <Text style={styles.fieldValue}>{canje.calle}</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Número exterior</Text>
              <Text style={styles.doubleValue}>{canje.numero_calle}</Text>
            </View>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Número interior</Text>
              <Text style={styles.doubleValue}>{canje.numero_interior}</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Colonia</Text>
              <Text style={styles.doubleValue}>{canje.colonia}</Text>
            </View>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Municipio</Text>
              <Text style={styles.doubleValue}>{canje.municipio}</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Código postal</Text>
              <Text style={styles.doubleValue}>{canje.codigo_postal}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Entre calles</Text>
            </View>
          </View>

          <View style={styles.doubleColumn}>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Calle 1</Text>
              <Text style={styles.doubleValue}>{canje.between_1}</Text>
            </View>
            <View style={styles.doubleContainer}>
              <Text style={styles.doubleLabel}>Calle 2</Text>
              <Text style={styles.doubleValue}>{canje.between_2}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Documento generado el {new Date().toLocaleDateString("es-MX")} a las{" "}
            {new Date().toLocaleTimeString("es-MX")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFCanje;
