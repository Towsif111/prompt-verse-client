import AllPromptsPageContent from "@/components/AllPromptsPageContent";

export const dynamic = 'force-dynamic';

export default async function PromptsPage() {
  let prompts = [];

  try {
    const res = await fetch("https://prompt-verse-server.vercel.app/all-promts", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    prompts = data.prompts || data || [];

  } catch (err) {
    console.error("Failed to fetch prompts:", err.message);
  }

  return <AllPromptsPageContent prompts={prompts} />;
}