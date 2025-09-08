import AboutClientPage from "./AboutClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Learn about the mission, vision, and creative passion that drives Vincent Designs Studio. Discover the heart behind our world-class design.",
};

export default function AboutPage() {
  return <AboutClientPage />;
}
