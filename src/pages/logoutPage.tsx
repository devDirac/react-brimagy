import React, { useCallback, useEffect } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { logOut } from "../actions/auth";
import { resetState } from "../actions/auth";
import "./styles.scss";

const LogoutPage: React.FC = () => {
  const dispatch = useDispatch();
  const handleCloseLogOut = useCallback(async () => {
    try {
      await logOut();
      dispatch(resetState());
    } catch (error) {
      dispatch(resetState());
    }
  }, [dispatch]);

  useEffect(() => {
    handleCloseLogOut();
  }, [handleCloseLogOut]);

  return (
    <div>
      <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default LogoutPage;
