export interface InputFieldProps {
  label?: string;
  id: string;
  value?: string;
  ref?: any;
  name: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "hidden"
    | "textArea"
    | "file"
    | "date"
    | "color"
    | "month"
    | "week"
    | "time"
    | "tel";
  onInput?: (e: any) => void;
  onChange?: (e: any) => void;
  InputProps?: any;
  formik?: any;
  onEdit?: () => void;
  max?: any;
  min?: any;
  onChangeExtern?: () => void;
  onKeyPress?: (a: any) => void;
  info?: string;
  tipoInput?: string;
  onBlur?: (e: React.FocusEvent<any>) => void;
}
