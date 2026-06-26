import AllPromptsPageContent from "@/components/AllPromptsPageContent";

export default async function PromptsPage() {
  const res = await fetch('http://localhost:5000/all-promts');
  const data = await res.json();
  const prompts = data.prompts || data;

  return <AllPromptsPageContent prompts={prompts} />;
}