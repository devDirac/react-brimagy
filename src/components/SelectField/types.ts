export interface SelectFieldProps {
  label?: string;
  id: string;
  value?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onInput?: (e: any) => void;
  onChange?: (e: any) => void;
  InputProps?: any;
  formik?: any;
  options: any;
  btnPlus?: boolean;
  onAdd?: () => void;
  info?: string;
}
