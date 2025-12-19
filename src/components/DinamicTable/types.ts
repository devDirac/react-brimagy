export interface DinamicTableProps {
  flex?: boolean;
  data: any;
  columnsToShow?: any;
  columnsToExport?: any;
  pinned?: any[];
  titulo?: string;
  actions?: boolean;
  enAccion?: (accion: string, row: any, idPermiso?: number) => void;
  opcionesRepo?: boolean;
  tituloExcel?: string;
  clickEnRow?: boolean;
  showCheckBox?: boolean;
  enCheckBox?: (rows: any) => void;
  sinFiltro?: boolean;
  sinExport?: boolean;
  ordernarColumna?: string;
  minHeight?: number;
  height?: any;
  footerRowData?: any;
  sinBusqueda?: boolean;
  gridRef?: any;
  esListaUsuarios?: boolean;
  esListaProveedores?: boolean;
  esListaProductos?: boolean;
  esListaCategorias?: boolean;
  esListaProductosExcel?: boolean;
  onImageClick?: (imageUrl: string) => void;
}
interface DataRow {
  id?: any;
  id_estatus?: any;
  activo?: any;
  revisores?: number;
  revision?: number;
  autorizar?: any;
  posicion?: any;
  disponible?: any;
  auditores?: any;
  autorizacion?: any;
  path?: any;
  estado?: string;
  status?: string;
  visible?: number;
}
export interface AccionesTableProps {
  enAccion: (accion: any) => void;
  row: DataRow;
  titulo?: boolean;
  tit?: string;
  esListaUsuarios?: boolean;
  esListaProveedores?: boolean;
  esListaProductos?: boolean;
  esListaCategorias?: boolean;
  esListaProductosExcel?: boolean;
}
