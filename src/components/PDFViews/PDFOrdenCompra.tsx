import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { numericFormatter } from "react-number-format";

// Registrar fuentes
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

interface Producto {
  id: number;
  id_canje: number;
  folio: string;
  nombre_usuario: string;
  email: string;
  phone: number;
  number_of_awards: number;
  size: string;
  color: string;
  category: string;
  puntos_canjeados: number;
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
  nombre_producto: string;
  marca: string;
  nombre_proveedor: string;
  razon_social: string;
  fecha_validacion?: string;
  fee_brimagy: number;
  costo_sin_iva: number;
  costo_con_iva: number;
  iva: number;
  estatus_proveedor: number;
  porcentaje_descuento: number;
  cantidad_producto: number;
  precio_unitario: number;
  estatus_almacen: number;
  importe_total: number;
  subtotal: number;
}
interface OrdenCompraResponse {
  orden_compra: {
    id: number;
    no_orden: string;
    estatus: string;
    observaciones: string;
    nombre_vendedor: string;
    primer_apellido: string;
    segundo_apellido: string;
    created_at: string;
    updated_at: string;
  };
  proveedor: {
    id: number;
    nombre: string;
    razon_social: string;
    descripcion: string;
    nombre_contacto: string;
    telefono: string;
    correo: string;
  };
  totales: {
    subtotal: number;
    iva: number;
    total: number;
  };
  productos: Producto[];
}

interface PDFOrdenCompraProps {
  ordenCompra: OrdenCompraResponse;
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
  // Estilos para la tabla de canjes
  table: {
    marginTop: 10,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#084d6e",
    padding: 6,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tableHeaderText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e0e0e0",
    padding: 6,
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1 solid #e0e0e0",
    padding: 6,
    backgroundColor: "#f9f9f9",
  },
  tableCell: {
    fontSize: 7,
    color: "#000",
    textAlign: "center",
  },
  tableCellLeft: {
    fontSize: 7,
    color: "#000",
    textAlign: "left",
  },
  tableCellRight: {
    fontSize: 7,
    color: "#000",
    textAlign: "right",
  },
  // Anchos de columna
  colProducto: {
    width: "30%",
    paddingRight: 4,
  },
  colCantidad: {
    width: "10%",
    paddingRight: 4,
  },
  colPrecio: {
    width: "15%",
    paddingRight: 4,
  },
  colDescuento: {
    width: "12%",
    paddingRight: 4,
  },
  colIVA: {
    width: "10%",
    paddingRight: 4,
  },
  colTotal: {
    width: "18%",
    paddingRight: 4,
  },
  // Totales
  totalesContainer: {
    marginTop: 10,
    alignSelf: "flex-end",
    width: "40%",
    border: "1 solid #e0e0e0",
    borderRadius: 3,
    padding: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 9,
    color: "#666",
  },
  totalValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000",
  },
  totalFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: "1 solid #084d6e",
    paddingTop: 6,
    marginTop: 4,
  },
  totalFinalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#084d6e",
  },
  totalFinalValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#084d6e",
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

const PDFOrdenCompra: React.FC<PDFOrdenCompraProps> = ({ ordenCompra }) => {
  // Función para formatear moneda
  const formatCurrency = (value: number) => {
    return numericFormatter(value.toString(), {
      thousandSeparator: ",",
      decimalSeparator: ".",
      prefix: "$",
      decimalScale: 2,
      fixedDecimalScale: true,
    });
  };
  // Calcular IVA (16%)
  const calcularIVA = (cantidad: number, precioUnitario: number, descuento: number) => {
    const subtotal = cantidad * precioUnitario;
    const descuentoAplicado = subtotal * (descuento / 100);
    const subtotalConDescuento = subtotal - descuentoAplicado;
    return subtotalConDescuento * 0.16;
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>ORDEN DE COMPRA</Text>
          <Text style={styles.subtitle}>No. {ordenCompra?.orden_compra?.no_orden}</Text>
        </View>

        {/* Información Brimagy */}
        <View style={styles.doubleColumn}>
          <View style={styles.doubleContainer}></View>
          <View style={styles.doubleContainer}>
            <Text style={styles.doubleValue}>BRIMAGY INC</Text>
            <Text style={styles.doubleValue}>PARQUE DE LA GRANADA #71</Text>
            <Text style={styles.doubleValue}>52783 HUIXQUILUCAN, CDMX</Text>
            <Text style={styles.doubleValue}>México</Text>
            <Text style={styles.doubleValue}>BRIMAGY INC</Text>
          </View>
        </View>

        {/* Información Brimagy */}
        <View style={styles.doubleColumn}>
          <View style={styles.doubleContainer}>
            <Text style={styles.doubleLabel}>Fecha de orden de compra</Text>
            <Text style={styles.doubleValue}>{ordenCompra?.orden_compra?.updated_at}</Text>
          </View>
          <View style={styles.doubleContainer}>
            <Text style={styles.doubleLabel}>Vendedor</Text>
            <Text style={styles.doubleValue}>
              {ordenCompra?.orden_compra?.nombre_vendedor}{" "}
              {ordenCompra?.orden_compra?.primer_apellido}{" "}
              {ordenCompra?.orden_compra?.segundo_apellido}
            </Text>
          </View>
        </View>

        {/* Tabla de Canjes/Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle de los Canjes</Text>

          <View style={styles.table}>
            {/* Encabezados de tabla */}
            <View style={styles.tableHeader}>
              <View style={styles.colProducto}>
                <Text style={styles.tableHeaderText}>Producto</Text>
              </View>
              <View style={styles.colCantidad}>
                <Text style={styles.tableHeaderText}>Cant.</Text>
              </View>
              <View style={styles.colPrecio}>
                <Text style={styles.tableHeaderText}>P. Unitario</Text>
              </View>
              <View style={styles.colDescuento}>
                <Text style={styles.tableHeaderText}>Desc. %</Text>
              </View>
              <View style={styles.colIVA}>
                <Text style={styles.tableHeaderText}>IVA 16%</Text>
              </View>
              <View style={styles.colTotal}>
                <Text style={styles.tableHeaderText}>Importe Total</Text>
              </View>
            </View>

            {/* Filas de canjes */}
            {ordenCompra?.productos
              ?.filter((canje) => canje.estatus_proveedor === 1)
              ?.map((canje, index) => {
                const iva = calcularIVA(
                  canje.cantidad_producto,
                  canje.precio_unitario,
                  canje.porcentaje_descuento
                );

                return (
                  <View
                    key={canje.id}
                    style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                  >
                    <View style={styles.colProducto}>
                      <Text style={styles.tableCellLeft}>{canje?.nombre_premio}</Text>
                    </View>
                    <View style={styles.colCantidad}>
                      <Text style={styles.tableCell}>{canje?.cantidad_producto}</Text>
                    </View>
                    <View style={styles.colPrecio}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(canje?.precio_unitario)}
                      </Text>
                    </View>
                    <View style={styles.colDescuento}>
                      <Text style={styles.tableCell}>{canje?.porcentaje_descuento}%</Text>
                    </View>
                    <View style={styles.colIVA}>
                      <Text style={styles.tableCellRight}>{formatCurrency(iva)}</Text>
                    </View>
                    <View style={styles.colTotal}>
                      <Text style={styles.tableCellRight}>
                        {formatCurrency(canje?.importe_total)}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>

          {/* Totales */}
          <View style={styles.totalesContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(ordenCompra?.totales?.subtotal || 0)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA (16%):</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(ordenCompra?.totales?.iva || 0)}
              </Text>
            </View>
            <View style={styles.totalFinalRow}>
              <Text style={styles.totalFinalLabel}>TOTAL:</Text>
              <Text style={styles.totalFinalValue}>
                {formatCurrency(ordenCompra?.totales?.total || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* Observaciones si existen */}
        {ordenCompra?.orden_compra?.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.fieldValue}>{ordenCompra.orden_compra.observaciones}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Orden de compra generada el {new Date().toLocaleDateString("es-MX")} a las{" "}
            {new Date().toLocaleTimeString("es-MX")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PDFOrdenCompra;
