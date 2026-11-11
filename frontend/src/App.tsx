import { Footer, Navbar } from "./components/layout";
import { ErrorBoundary } from "./components/ui";
import { StudentBarContainer } from "./containers";
import { StudentProvider } from "./context/StudentContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <div className="flex min-h-screen flex-col bg-bg text-fg">
          <Navbar />
          <StudentBarContainer />
          <main className="mx-auto w-full max-w-[1240px] flex-1 px-4 min-[901px]:px-10">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </StudentProvider>
    </ThemeProvider>
  );
}
