import { createRoot } from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import "./styles/styles.scss";
import { ColorModeProvider } from "./hooks/use-color-mode";
import { SyncHoverProvider } from "./hooks/useSyncHover";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ColorModeProvider>
      <SyncHoverProvider>
        <App />
      </SyncHoverProvider>
    </ColorModeProvider>
  </QueryClientProvider>
);
