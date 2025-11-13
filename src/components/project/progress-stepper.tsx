"use client";

import { canProceedToNext, steps, type Project } from "./utils";

interface ProgressStepperProps {
  project: Project | null;
  currentStep: number;
  onGoToStep: (step: number) => void;
}

export function ProgressStepper({
  project,
  currentStep,
  onGoToStep,
}: ProgressStepperProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:hidden">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const canNavigate =
              step.id <= currentStep ||
              (step.id === currentStep + 1 &&
                canProceedToNext(project, currentStep));

            return (
              <div key={step.id} className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => canNavigate && onGoToStep(step.id)}
                    disabled={!canNavigate}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors touch-manipulation flex-shrink-0
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }
                      ${canNavigate ? "cursor-pointer hover:opacity-80 active:opacity-70" : "cursor-not-allowed opacity-50"}
                    `}
                    aria-label={`Step ${step.id + 1}: ${step.name} - ${step.description}`}
                  >
                    {isCompleted ? "✓" : step.id + 1}
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-px h-4 mt-2 ${isCompleted ? "bg-green-500" : "bg-border"}`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-2 pb-4">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                    {isCompleted && <span className="ml-1 text-xs">✓</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden md:flex lg:hidden items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const canNavigate =
              step.id <= currentStep ||
              (step.id === currentStep + 1 &&
                canProceedToNext(project, currentStep));

            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => canNavigate && onGoToStep(step.id)}
                  disabled={!canNavigate}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }
                    ${canNavigate ? "cursor-pointer hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : "cursor-not-allowed opacity-50"}
                  `}
                  aria-label={`Step ${step.id + 1}: ${step.name} - ${step.description}`}
                >
                  {isCompleted ? "✓" : step.id + 1}
                </button>
                <div className="ml-2 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isCurrent
                        ? "text-foreground"
                        : isCompleted
                          ? "text-green-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                    {isCompleted && <span className="ml-1 text-xs">✓</span>}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 min-w-[20px] ${isCompleted ? "bg-green-500" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const canNavigate =
              step.id <= currentStep ||
              (step.id === currentStep + 1 &&
                canProceedToNext(project, currentStep));

            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className="flex items-center">
                  <button
                    onClick={() => canNavigate && onGoToStep(step.id)}
                    disabled={!canNavigate}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors flex-shrink-0
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }
                      ${canNavigate ? "cursor-pointer hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" : "cursor-not-allowed opacity-50"}
                    `}
                    aria-label={`Step ${step.id + 1}: ${step.name} - ${step.description}`}
                  >
                    {isCompleted ? "✓" : step.id + 1}
                  </button>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium whitespace-nowrap ${
                        isCurrent
                          ? "text-foreground"
                          : isCompleted
                            ? "text-green-600"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                      {isCompleted && <span className="ml-1 text-xs">✓</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 xl:w-16 h-px mx-4 xl:mx-6 flex-shrink-0 ${isCompleted ? "bg-green-500" : "bg-border"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
