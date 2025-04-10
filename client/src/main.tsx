import { createRoot } from "react-dom/client";
import { QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import "./index.css";
import { ColorModeProvider } from "./hooks/use-color-mode";
import { SyncHoverProvider } from "./hooks/use-sync-hover";
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
