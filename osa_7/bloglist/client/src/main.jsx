import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserContextProvider } from "./contexts/UserContext";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
