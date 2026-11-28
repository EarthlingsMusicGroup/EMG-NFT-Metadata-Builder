import type { PageId, Tour, TourStep } from "./config";

export function pageFromPath(pathname: string): PageId {
  if (pathname === "/") return "landing";
  if (pathname.startsWith("/p/")) return "project";
  if (pathname.startsWith("/settings")) return "settings";
  return "home";
}

export function stepMatchesPage(step: TourStep, page: PageId): boolean {
  if (!step.pages || step.pages.length === 0) return true;
  return step.pages.includes(page);
}

export function isStepShowable(
  step: TourStep,
  page: PageId,
  hasTarget: (step: TourStep) => boolean,
): boolean {
  if (!stepMatchesPage(step, page)) return false;
  if (step.targets.length === 0) return true;
  if (hasTarget(step)) return true;
  return step.allowMissing === true;
}

export function firstShowable(
  tour: Tour,
  page: PageId,
  hasTarget: (step: TourStep) => boolean,
  startIndex = 0,
): TourStep | null {
  for (let index = startIndex; index < tour.steps.length; index += 1) {
    const step = tour.steps[index];
    if (isStepShowable(step, page, hasTarget)) return step;
  }
  return null;
}

export function previousShowable(
  tour: Tour,
  page: PageId,
  hasTarget: (step: TourStep) => boolean,
  beforeId: string,
): TourStep | null {
  const current = tour.steps.findIndex((step) => step.id === beforeId);
  for (let index = current - 1; index >= 0; index -= 1) {
    const step = tour.steps[index];
    if (isStepShowable(step, page, hasTarget)) return step;
  }
  return null;
}

export function showableSteps(
  tour: Tour,
  page: PageId,
  hasTarget: (step: TourStep) => boolean,
): TourStep[] {
  return tour.steps.filter((step) => isStepShowable(step, page, hasTarget));
}
