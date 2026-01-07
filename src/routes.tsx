import LockIcon from "@mui/icons-material/Lock";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

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
        name: "Catálogo de Canjes",
        key: "catalogo-canjes",
        icon: "ShoppingBagIcon",
        route: "/catalogo-canjes",
        component: null,
        allow: [1, 2, 3, 4, 5, 6],
      },
    ],
  },
];

export default routes;
