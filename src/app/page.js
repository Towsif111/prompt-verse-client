import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUS";
import AllPromptsSection from "@/components/AllPromptsSection";
import TopCreators from "@/components/TopCreators";

export default async function Home() {
  const res = await fetch('http://localhost:5000/all-promts');
  const prompts = await res.json();

  // Aggregate prompts by creator to compute top creators
  const creatorMap = {};
  for (const prompt of prompts) {
    const key = prompt.creatorEmail;
    if (!creatorMap[key]) {
      creatorMap[key] = {
        name: prompt.creatorName,
        email: prompt.creatorEmail,
        promptCount: 0,
        totalCopies: 0,
        totalRating: 0,
      };
    }
    creatorMap[key].promptCount += 1;
    creatorMap[key].totalCopies += prompt.copyCount || 0;
    creatorMap[key].totalRating += prompt.rating || 0;
  }

  const creators = Object.values(creatorMap).map((c) => ({
    ...c,
    avgRating: c.totalRating / c.promptCount,
  }));

  // Sort by score: promptCount * avgRating + totalCopies
  creators.sort((a, b) => {
    const scoreA = a.promptCount * a.avgRating + a.totalCopies;
    const scoreB = b.promptCount * b.avgRating + b.totalCopies;
    return scoreB - scoreA;
  });

  return (
    <>
      <HeroSection />
      <AllPromptsSection prompts={prompts} />
      <TopCreators creators={creators} />
      <WhyChooseUs />
    </>
  );
}
