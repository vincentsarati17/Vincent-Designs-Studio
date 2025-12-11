import ProjectManagementPage from "./ProjectManagementPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Management",
  description: "Manage your projects.",
};

export default function ProjectsPage() {
  return <ProjectManagementPage />;
}
