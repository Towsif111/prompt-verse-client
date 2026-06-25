import { notFound } from "next/navigation";
import PromptDetailClient from "./PromptDetailClient";

export default async function PromptDetailPage({ params }) {
  const { id } = await params;

  const res = await fetch("http://localhost:5000/all-promts", {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const prompts = await res.json();
  const prompt = prompts.find((p) => p._id === id);

  if (!prompt) return notFound();

  return <PromptDetailClient prompt={prompt} />;
}
