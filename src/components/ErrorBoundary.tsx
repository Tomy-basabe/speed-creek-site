import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0a0a1a",
                    color: "#fff",
                    fontFamily: "Inter, system-ui, sans-serif",
                    padding: "2rem",
                }}>
                    <div style={{ maxWidth: "600px", textAlign: "center" }}>
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#ff4444" }}>
                            ⚠️ Error en la aplicación
                        </h1>
                        <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
                            Algo salió mal. Intenta recargar la página.
                        </p>
                        <div style={{
                            background: "#1a1a2e",
                            borderRadius: "8px",
                            padding: "1rem",
                            textAlign: "left",
                            fontSize: "0.85rem",
                            color: "#ff6b6b",
                            marginBottom: "1.5rem",
                            overflow: "auto",
                            maxHeight: "200px",
                        }}>
                            <strong>Error:</strong> {this.state.error?.message}
                            {this.state.errorInfo && (
                                <pre style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#888" }}>
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                // Clear service worker caches and reload
                                if ('caches' in window) {
                                    caches.keys().then(names => {
                                        names.forEach(name => caches.delete(name));
                                    });
                                }
                                if (navigator.serviceWorker) {
                                    navigator.serviceWorker.getRegistrations().then(registrations => {
                                        registrations.forEach(reg => reg.unregister());
                                    });
                                }
                                window.location.reload();
                            }}
                            style={{
                                padding: "0.75rem 2rem",
                                background: "linear-gradient(135deg, #00d9ff, #6366f1)",
                                border: "none",
                                borderRadius: "12px",
                                color: "#fff",
                                fontWeight: 600,
                                cursor: "pointer",
                                fontSize: "1rem",
                            }}
                        >
                            🔄 Recargar página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
