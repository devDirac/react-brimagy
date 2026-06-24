import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ViewListIcon from "@mui/icons-material/ViewList";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

const routes = [
  {
    type: "collapse",
    key: "perfil",
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Perfil de usuario",
        key: "perfil-usuario",
        route: "/perfil-usuario",
        component: null,
        iconText: "Lock",
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Cerrar sesión",
        key: "logout",
        route: "/logoutPage",
        component: null,
        icon: <LockIcon />,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  { type: "divider", key: "divider-0", allow: [1, 2, 3, 4, 5, 6] },
  {
    type: "collapse",
    name: "Configuración Sistema",
    key: "configuracion",
    icon: <MiscellaneousServicesIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Plataformas",
        key: "plataformas",
        icon: "ShoppingBagIcon",
        route: "/plataformas",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Variables Globales",
        key: "variables-globales",
        icon: "ShoppingBagIcon",
        route: "/variables-globales",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "usuarios",
    icon: <PeopleIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Nuevo Usuario",
        key: "nuevo-usuario",
        icon: "PeopleIcon",
        route: "/nuevo-usuario",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Lista de Usuarios",
        key: "lista-usuarios",
        route: "/lista-usuarios",
        component: null,
        icon: "FormatListBulletedIcon",
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    type: "collapse",
    name: "Productos",
    key: "productos",
    icon: <ShoppingBagIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Categorías/Proveedores",
        key: "categorias-proveedores",
        icon: "ShoppingBagIcon",
        route: "/categorias-proveedores",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Nuevo Producto",
        key: "nuevo-producto",
        icon: "ShoppingBagIcon",
        route: "/nuevo-producto",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Catálogo de Productos",
        key: "catalogo-productos",
        route: "/catalogo-productos",
        component: null,
        icon: "FormatListBulletedIcon",
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Fisicos",
        key: "productos-fisicos",
        route: "/productos-fisicos",
        component: null,
        icon: "FormatListBulletedIcon",
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Digitales",
        key: "productos-digitales",
        route: "/productos-digitales",
        component: null,
        icon: "FormatListBulletedIcon",
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    type: "collapse",
    name: "Canjes",
    key: "canjes",
    icon: <ShoppingBagIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Canjes fisicos",
        key: "canjes-fisicos",
        icon: "ShoppingBagIcon",
        route: "/canjes-fisicos",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
      {
        name: "Canjes Digitales",
        key: "canjes-digitales",
        icon: "ShoppingBagIcon",
        route: "/canjes-digitales",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    type: "collapse",
    name: "Ordenes de Compras",
    key: "ordenes-de-compras",
    icon: <ViewListIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Generar Orden de Compra",
        key: "generar-orden-de-compra",
        icon: "ViewListIcon",
        route: "/generar-orden-de-compra",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    type: "collapse",
    name: "Almacen",
    key: "almacen",
    icon: <ViewListIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Gestión de almacen",
        key: "gestion-almacen",
        icon: "ViewListIcon",
        route: "/gestion-almacen",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
  {
    type: "collapse",
    name: "Encuestas",
    key: "encuestas",
    icon: <QuestionAnswerIcon />,
    allow: [1, 2, 3, 4, 5, 6],
    collapse: [
      {
        name: "Catálogo de encuestas",
        key: "catalogo-encuestas",
        icon: "QuestionAnswerIcon",
        route: "/catalogo-encuestas",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
];

export default routes;
