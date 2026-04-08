import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserContextProvider } from "./contexts/UserContext";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserContextProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserContextProvider>
  </QueryClientProvider>,
);
