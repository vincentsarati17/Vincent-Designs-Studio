
import type { Metadata } from "next";
import AddProjectPage from "./AddProjectPage";

export const metadata: Metadata = {
  title: "Add New Project",
  description: "Add a new project to your portfolio.",
};

export default function NewProjectPage() {
  return <AddProjectPage />;
}
