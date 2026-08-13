import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface RouterState {
  path: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterState | null>(null);

function parseHash(): string {
  const raw = window.location.hash.replace(/^#/, "");
  return raw || "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(parseHash());

  useEffect(() => {
    const onChange = () => setPath(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (to: string) => {
    if (parseHash() === to) {
      setPath(to);
      return;
    }
    window.location.hash = to;
  };

  const [base, query] = path.split("?");
  const params: Record<string, string> = {};
  if (query) {
    for (const [k, v] of new URLSearchParams(query)) params[k] = v;
  }

  return (
    <RouterContext.Provider value={{ path: base ?? "/", params, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function Link({ to, children, className, onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={() => {
        onClick?.();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}