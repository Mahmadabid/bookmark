import { useSelector } from "react-redux";
import { State } from "./Types/SliceTypes";
import * as React from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

interface ThemeProps {
  children: React.ReactNode
}

export const Theme = ({ children }: ThemeProps) => {
  
  const islit = useSelector((state: State) => state.themes.value);

  const theme = createMuiTheme({
    palette: {
      type: islit ? "light" : "dark",
    },
  });

  return (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );
}
