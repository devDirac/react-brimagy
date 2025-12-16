import React from "react";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import type { SelectFieldProps } from "./types";
import Form from "react-bootstrap/Form";
import { useSelectField } from "./useSelectField";
import "./index.scss";
import { Button, InputGroup } from "react-bootstrap";
import CheckIcon from "@mui/icons-material/Check";
import _ from "lodash";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";

const SelectField: React.FC<SelectFieldProps> = (props: SelectFieldProps) => {
  const {
    showFeedback,
    isValid,
    handleFocus,
    field,
    errorMessage,
    formik,
    darkMode,
    esError,
    btnPlus,
    newPros,
  } = useSelectField(props);

  return (
    <div className={`${showFeedback ? isValid : ""}`}>
      <div>
        {props?.label && (
          <Form.Label style={darkMode ? { color: "white", fontSize: 14 } : { fontSize: 14 }}>
            {props?.label}
            {props?.info ? (
              <Tooltip title={props?.info || ""} style={{ cursor: "help" }}>
                <QuestionMarkIcon color="info" />
              </Tooltip>
            ) : null}
          </Form.Label>
        )}

        <InputGroup
          size="sm"
          className="mb-3"
          style={
            esError
              ? { border: "solid 1px red", borderRadius: "8px" }
              : formik?.touched || (!formik?.error && !_.isEmpty(formik?.value))
              ? { border: "solid 1px #01db01", borderRadius: "8px" }
              : { borderRadius: "8px" }
          }
        >
          <Form.Select
            aria-label="Default select example"
            onFocus={handleFocus}
            {...newPros}
            {...field}
            style={
              darkMode
                ? { borderRight: "none", backgroundColor: "transparent", color: "white" }
                : { borderRight: "none" }
            }
          >
            <option style={darkMode ? { color: "black" } : {}} value={""}>
              Seleccione una opción
            </option>
            {props?.options.map((item: any, key: number) => (
              <option
                style={darkMode ? { color: "black" } : {}}
                key={key}
                value={item.value}
                disabled={item?.disabled}
              >
                {item.label}
              </option>
            ))}
          </Form.Select>
          {btnPlus ? (
            <Button
              onClick={() => props?.onAdd && props?.onAdd()}
              variant="outline-secondary"
              style={{
                border: "1px solid rgb(227 215 215)",
                borderLeft: "solid 1px rgb(227, 215, 215",
              }}
              id="button-addon1"
            >
              <AddIcon color="info" />
            </Button>
          ) : null}
          {esError || (formik?.touched && !formik?.error && !_.isEmpty(formik?.value)) ? (
            <Button
              variant="outline-secondary"
              style={{ border: "1px solid rgb(227 215 215)", borderLeft: "none" }}
              id="button-addon2"
            >
              {esError ? (
                <ErrorOutlineIcon color="error" />
              ) : formik?.touched && !formik?.error && !_.isEmpty(formik?.value) ? (
                <CheckIcon color="success" />
              ) : (
                <CheckIcon style={{ color: "transparent" }} />
              )}
            </Button>
          ) : null}
        </InputGroup>
      </div>

      <div className="flex items-center space-between">
        {showFeedback ? (
          <div
            id={`${props.id}-feedback`}
            aria-live="polite"
            className="feedback text-sm"
            style={{
              textAlign: "left",
              paddingLeft: "5px",
              color: "red",
              fontWeight: "normal",
              fontSize: "12px",
            }}
          >
            {errorMessage}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SelectField;
