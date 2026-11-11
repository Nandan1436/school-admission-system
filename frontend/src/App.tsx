import { ThemeProvider } from "./context/ThemeContext";

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-bg text-fg">School Admission</div>
    </ThemeProvider>
  );
}
