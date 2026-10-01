import type { ApplicationData } from "@/lib/application-schema";

export function calculateCandidateScore(application: ApplicationData, hasPortfolioFile: boolean) {
  const portfolioScore = application.portfolioUrl || hasPortfolioFile ? 35 : 0;
  const productScore =
    application.hasPhysicalProductExperience === "yes"
      ? Math.min(
          25,
          10 +
            application.productTypes.length * 3 +
            (application.hasProfessionalMockups === "yes" ? 6 : 0),
        )
      : application.hasProfessionalMockups === "yes"
        ? 8
        : 0;
  const levelScore = { Intermediate: 7, Advanced: 12, Expert: 15 }[application.designLevel];
  const softwareScore = Math.min(
    15,
    application.softwareSkills.length * 3 + (application.softwareSkills.length >= 3 ? 3 : 0),
  );
  const experienceScore = Math.min(10, application.yearsExperience * 2);

  return Math.min(
    100,
    portfolioScore + productScore + levelScore + softwareScore + experienceScore,
  );
}
