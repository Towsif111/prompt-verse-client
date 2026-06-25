import AllPromptsPageContent from "@/components/AllPromptsPageContent";

export default async function PromptsPage() {
  const res = await fetch('http://localhost:5000/all-promts');
  const prompts = await res.json();

  return <AllPromptsPageContent prompts={prompts} />;
}