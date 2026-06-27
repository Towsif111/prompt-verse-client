import AllPromptsCard from "./AllPromptsCard";

async function getPrompts() {
  try {
    const res = await fetch("https://prompt-verse-server.vercel.app/all-promts", {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch prompts: ${res.status} ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return data.prompts || data || [];
  } catch (err) {
    console.error("Failed to fetch prompts:", err.message);
    return [];
  }
}

export default async function AllPromptsSection() {
  const prompts = await getPrompts();

  return (
    <section id="all-prompts" className="container-shell py-16">
      <div className="mx-auto max-w-2xl text-center mb-12">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-primary">
          Explore
        </p>
        <h2 className="mt-2 text-4xl font-black">All Prompts</h2>
        <p className="mt-3" style={{ color: 'var(--color-text-secondary)' }}>
          Browse our curated collection of AI prompts crafted by the community
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt, index) => (
          <AllPromptsCard
            key={prompt._id}
            prompt={prompt}
            eagerImage={index < 3}
          />
        ))}
      </div>

      {prompts.length === 0 ? (
        <p className="text-center text-sm text-default-500">
          No prompts found.
        </p>
      ) : null}
    </section>
  );
}
