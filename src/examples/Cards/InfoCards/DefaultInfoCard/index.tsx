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
}: Props): JSX.Element {
  return (
    <Card
      style={{ border: "solid rgba(0, 0, 0, 0.125)", cursor: "pointer" }}
      onClick={() => {
        onSelec(elemento);
      }}
    >
      <MDBox p={2} mx={3} display="flex" justifyContent="center">
        <MDBox
          sx={{ cursor: "pointer" }}
          display="grid"
          justifyContent="center"
          alignItems="center"
          bgColor={color}
          color="white"
          width="4rem"
          height="4rem"
          shadow="md"
          borderRadius="lg"
          variant="gradient"
        >
          {typeof icon === "string" ? (
            <Icon fontSize="large">{icon}</Icon>
          ) : React.isValidElement(icon) ? (
            React.cloneElement(icon as React.ReactElement<any>, { fontSize: "large" })
          ) : null}
        </MDBox>
      </MDBox>
      <MDBox pb={2} px={2} textAlign="center">
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
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
    </Card>
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
