import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    cellBgColor?: string;
    groupBg?: string;
    groupText?: string;
    formatter?: (value: any) => string;
  }
}
