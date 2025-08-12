'use client';

import { ToasterProvider, Toaster, ToasterComponent, ThemeProvider } from '@gravity-ui/uikit';


export default function ToasterClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToasterProvider >
      <ThemeProvider theme="light">
        {children}
        <ToasterComponent />
      </ThemeProvider>
    </ToasterProvider>
  );
}
