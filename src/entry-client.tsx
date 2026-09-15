import { Component, type ReactNode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import "./styles.css";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  basepath: import.meta.env.BASE_URL.replace(/\/$/, ''),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  override state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override componentDidCatch(error: unknown) {
    console.error(error);
  }
  override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            textAlign: "center",
            fontFamily: "system-ui, sans-serif",
            background: "#f6f1e4",
            color: "#1b2b4b",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Vaya, algo falló al cargar</h1>
            <p style={{ marginBottom: 20, opacity: 0.8 }}>Prueba a recargar la página.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "#1f5fa6",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>,
  );
}
