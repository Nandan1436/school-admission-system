import { Navigate, Route, Routes } from "react-router-dom";
import { ApplicationPage, ClassesPage, CreateClassPage, MyApplicationsPage } from "../pages";
import { ScrollToTop } from "./ScrollToTop";

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ClassesPage />} />
        <Route path="/classes/new" element={<CreateClassPage />} />
        <Route path="/applications/:holdId" element={<ApplicationPage />} />
        <Route path="/my-applications" element={<MyApplicationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
