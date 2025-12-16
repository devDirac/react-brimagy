import { useMaterialUIController } from "context";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import env from "react-dotenv";
import DashboardLayout from "../examples/LayoutContainers/DashboardLayout";
import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, Grid } from "@mui/material";
import DefaultInfoCard from "../examples/Cards/InfoCards/DefaultInfoCard";
import { useNavigate } from "react-router-dom";
import MenuPageOptions from "../components/MenuPageOptions";
import CategoryIcon from "@mui/icons-material/Category";
import HiveIcon from "@mui/icons-material/Hive";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import WorkIcon from "@mui/icons-material/Work";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import GroupIcon from "@mui/icons-material/Group";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PostAddIcon from "@mui/icons-material/PostAdd";
import InsightsIcon from "@mui/icons-material/Insights";
import FolderIcon from "@mui/icons-material/Folder";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import WaterfallChartIcon from "@mui/icons-material/WaterfallChart";
import PaymentsIcon from "@mui/icons-material/Payments";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Filter9PlusIcon from "@mui/icons-material/Filter9Plus";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ChecklistIcon from "@mui/icons-material/Checklist";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RuleFolderIcon from "@mui/icons-material/RuleFolder";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import PublishIcon from "@mui/icons-material/Publish";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import TocIcon from "@mui/icons-material/Toc";
import PlaylistAddCircleIcon from "@mui/icons-material/PlaylistAddCircle";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import HistoryIcon from "@mui/icons-material/History";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ClassIcon from "@mui/icons-material/Class";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import DoorFrontIcon from "@mui/icons-material/DoorFront";
import InventoryIcon from "@mui/icons-material/Inventory";
import TopicIcon from "@mui/icons-material/Topic";
import DnsIcon from "@mui/icons-material/Dns";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import PaddingIcon from "@mui/icons-material/Padding";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LockIcon from "@mui/icons-material/Lock";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PeopleIcon from "@mui/icons-material/People";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import InsertChartIcon from "@mui/icons-material/InsertChart";

const iconMap: Record<string, React.ComponentType> = {
  LockIcon,
  ReceiptIcon,
  PeopleIcon,
  CarCrashIcon,
  InsertChartIcon,
  GroupIcon,
  NotificationsIcon,
  DisplaySettingsIcon,
  GroupAddIcon,
  PostAddIcon,
  InsightsIcon,
  FolderIcon,
  PaddingIcon,
  FormatListBulletedIcon,
  PlusOneIcon,
  AdminPanelSettingsIcon,
  CorporateFareIcon,
  TopicIcon,
  CategoryIcon,
  ControlCameraIcon,
  DnsIcon,
  DashboardIcon,
  InventoryIcon,
  DoorFrontIcon,
  FolderZipIcon,
  FaceRetouchingNaturalIcon,
  AutoAwesomeMotionIcon,
  ClearAllIcon,
  ClassIcon,
  HistoryIcon,
  PlaylistAddIcon,
  TocIcon,
  PlaylistAddCircleIcon,
  DriveFolderUploadIcon,
  PublishIcon,
  FolderSharedIcon,
  RuleFolderIcon,
  UploadFileIcon,
  ChecklistIcon,
  PersonPinIcon,
  AddBoxIcon,
  NoteAddIcon,
  AddRoadIcon,
  EventNoteIcon,
  TipsAndUpdatesIcon,
  ScreenSearchDesktopIcon,
  WaterfallChartIcon,
  CurrencyExchangeIcon,
  RecordVoiceOverIcon,
  Filter9PlusIcon,
  PaymentsIcon,
  WorkIcon,
  LineStyleIcon,
  AllInboxIcon,
  AssignmentIcon,
};

interface ItemProps {
  icon: keyof typeof iconMap;
  name: string;
  key: string;
  route: string;
  component: React.ReactNode | null;
  allow: number[];
}

const OpcionesMenuSeleccionadoPage: React.FC = () => {
  const ruta = useSelector((state: any) => state?.app?.ruta || null);
  const tipoUsuario = useSelector((state: any) => state?.app?.user?.data?.tipo_usuario || []);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();

  const MyComponent: React.FC<{ item: any }> = ({ item }) => {
    // If it's a string, look up the icon component
    if (typeof item === "string") {
      const IconComponent = iconMap[item];
      return IconComponent ? <IconComponent /> : null;
    }

    // If it's already a React element, return it directly
    if (React.isValidElement(item)) {
      return item;
    }

    // Otherwise return null
    return null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar isMini />
      <Card>
        <CardContent>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", mt: 3 }}
            style={
              darkMode
                ? { backgroundColor: "#1f283e", padding: "25px", minHeight: "370px" }
                : { backgroundColor: "#fff", padding: "25px", minHeight: "370px" }
            }
          >
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <h2 style={{ fontWeight: "bold", fontSize: 30, color: "rgb(52, 71, 103)" }}>
                {(ruta?.name || "").toUpperCase()}{" "}
              </h2>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                {(ruta?.collapse || [])
                  .filter((c: any) => (c?.allow || []).includes(tipoUsuario))
                  .map(({ name, route, key, href, icon, e, collapse }: any) => {
                    return (
                      <Grid item xs={12} md={4} key={key}>
                        <DefaultInfoCard
                          icon={<MyComponent item={icon} />}
                          title={name || "Sin título"}
                          elemento={e}
                          color="info"
                          onSelec={(e: any) => {
                            navigate(route);
                          }}
                        />
                        {collapse ? <MenuPageOptions item={collapse} /> : null}
                      </Grid>
                    );
                  })}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default OpcionesMenuSeleccionadoPage;
