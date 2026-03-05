/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.2
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { ReactNode } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Declaring props types for DefaultInfoCard
interface Props {
  color?: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark";
  icon: ReactNode;
  title: string;
  description?: string;
  value?: string | number;
  [key: string]: any;
  iconColor?: string;
}

function DefaultInfoCard({
  color,
  icon,
  title,
  description,
  value,
  onSelec,
  elemento,
  esAjustesSitio,
  colorAjusteSitio,
  iconColor,
}: Props): JSX.Element {
  return (
    <MDBox p={0} mx={0} display="flex" justifyContent="center">
      <MDBox
        onClick={() => {
          onSelec(elemento);
        }}
        sx={{
          cursor: "pointer",
          ...(iconColor && { backgroundColor: iconColor }),
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            ...(iconColor && {
              backgroundColor: iconColor,
              filter: "brightness(1.1)",
            }),
          },
        }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgColor={!iconColor ? color : undefined}
        color="white"
        width="100%"
        height="10rem"
        shadow="md"
        borderRadius="lg"
        variant="gradient"
      >
        <MDBox sx={{ fontSize: "60px", display: "flex", alignItems: "center" }}>
          {typeof icon === "string" ? (
            <Icon sx={{ fontSize: "inherit" }}>{icon}</Icon>
          ) : React.isValidElement(icon) ? (
            React.cloneElement(icon as React.ReactElement<any>, {
              fontSize: "inherit",
            })
          ) : null}
        </MDBox>
        <MDTypography
          pt={1}
          variant="h6"
          fontWeight="medium"
          textTransform="capitalize"
          style={{ lineHeight: "20px" }}
        >
          {title}
        </MDTypography>
        {description && (
          <MDTypography variant="caption" color="text" fontWeight="regular">
            {description}
          </MDTypography>
        )}
        {value && (
          <MDTypography variant="h5" fontWeight="medium">
            {value}
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
}

// Declaring default props for DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelec: PropTypes.func,
  elemento: PropTypes.object,
  esAjustesSitio: PropTypes.bool,
  colorAjusteSitio: PropTypes.string,
  ajustaIconoSize: PropTypes.bool,
};

export default DefaultInfoCard;
