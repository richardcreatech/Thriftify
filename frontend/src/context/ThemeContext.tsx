import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ThemeContextType = {
  themeColor: string;
  themeForegroundColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

function getForegroundColor(color: string) {
  const hex = color.replace("#", "");
  const linearChannel = (offset: number) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * linearChannel(0) +
    0.7152 * linearChannel(2) +
    0.0722 * linearChannel(4);

  return luminance > 0.179 ? "#17121D" : "#FFFFFF";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColor] = useState("#9419D4");
  const themeForegroundColor = getForegroundColor(themeColor);

  return (
    <ThemeContext.Provider
      value={{ themeColor, themeForegroundColor, setThemeColor }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeColor must be used inside ThemeProvider");
  }

  return context;
}