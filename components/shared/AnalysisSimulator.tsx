'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Satellite, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface AnalysisStep {
  label: string;
  detail: string;
}

const analysisSteps: AnalysisStep[] = [
  {
    label: 'Acquiring Sentinel-1 SAR imagery...',
    detail: 'Requesting Sentinel-1 C-band SAR scene for Sangli, Maharashtra (14 Aug 2019).',
  },
  {
    label: 'Applying VV threshold (-17 dB)...',
    detail: 'Detecting potential flooded pixels via VV backscatter thresholding.',
  },
  {
    label: 'Computing flood extent...',
    detail: 'Vectorizing detected pixels into potential flood mask (5.01 km²).',
  },
  {
    label: 'Overlaying infrastructure...',
    detail: 'Intersecting potential flood mask with road network and critical facilities.',
  },
];

interface AnalysisSimulatorProps {
  onComplete: () => void;
}

export function AnalysisSimulator({ onComplete }: AnalysisSimulatorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setIsComplete(false);
    setHasError(false);
    setCurrentStep(0);

    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    setIsAnalyzing(false);
    setIsComplete(true);
    onComplete();
  }, [onComplete]);

  const progressValue = isAnalyzing
    ? ((currentStep + 1) / analysisSteps.length) * 100
    : isComplete
      ? 100
      : 0;

  return (
    <Card className="border-primary/20 bg-card">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                <Satellite className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Sentinel-1 Analysis Engine
                </h3>
                <p className="text-xs text-muted-foreground">
                  Google Earth Engine / Sentinel-1 SAR flood detection for Sangli, Maharashtra
                </p>
              </div>
            </div>
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : isComplete ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Re-run Analysis
                </>
              ) : (
                <>
                  <Satellite className="mr-2 h-4 w-4" />
                  Analyze Satellite Data
                </>
              )}
            </Button>
          </div>

          {(isAnalyzing || isComplete || hasError) && (
            <div className="space-y-3">
              <Progress value={progressValue} className="h-2" />

              <div className="space-y-2">
                {analysisSteps.map((step, index) => {
                  const isDone = isComplete || (isAnalyzing && index < currentStep);
                  const isActive = isAnalyzing && index === currentStep;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-risk-low" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
                      ) : (
                        <div className="h-4 w-4 shrink-0 rounded-full border border-muted-foreground/30" />
                      )}
                      <span
                        className={
                          isDone
                            ? 'text-foreground'
                            : isActive
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground'
                        }
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {isComplete && (
                <div className="flex items-center gap-2 rounded-md border border-risk-low/30 bg-risk-low/10 px-3 py-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-risk-low" />
                  <span className="text-risk-low font-medium">
                    Analysis Complete — Potential flooded area: 5.01 km². Results updated below.
                  </span>
                </div>
              )}

              {hasError && (
                <div className="flex items-center gap-2 rounded-md border border-risk-critical/30 bg-risk-critical/10 px-3 py-2 text-xs">
                  <AlertCircle className="h-4 w-4 text-risk-critical" />
                  <span className="text-risk-critical">
                    Analysis failed. Please try again.
                  </span>
                </div>
              )}

              <p className="text-[11px] text-muted-foreground">
                Flooded area (5.01 km²) is derived from Sentinel-1 SAR VV thresholding (-17 dB).
                Road, population, and facility impacts are estimated/simulated overlays.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
