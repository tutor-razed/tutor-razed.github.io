import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../App";
import { analyzeText } from "../analysis/textHeuristics";
import { Project, Difficulty, LayoutMode, VisualStyle } from "../types";
import { Button, Card, StatChip, Select, Modal } from "../components/UI";
import { PROMPTS } from "../data/lexicons";
import { generateId } from "../utils/random";
import SymphonyCanvas from "../components/SymphonyCanvas";
import GIF from "gif.js";

const Studio: React.FC = () => {
  const { id } = useParams();
  const { projects, setProjects, settings } = useApp();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [title, setTitle] = useState("Untitled Symphony");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    settings.defaultDifficulty,
  );
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(LayoutMode.LINEAR);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>(
    VisualStyle.PAINT,
  );
  const [promptId, setPromptId] = useState("free");
  const [focusMode, setFocusMode] = useState(false);
  const [isFinaleOpen, setIsFinaleOpen] = useState(false);
  const [finaleProgress, setFinaleProgress] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [isExportingGif, setIsExportingGif] = useState(false);

  const lastInitializedId = useRef<string | null>(null);

  const projectInList = useMemo(
    () => projects.find((p) => p.id === id),
    [id, projects],
  );

  useEffect(() => {
    // If no ID is provided, we don't auto-create here to avoid navbar accidents.
    // Instead, if a user lands on /studio without an ID, we check for projects or redirect home.
    if (!id) {
      if (projects.length > 0) {
        navigate(`/studio/${projects[0].id}`, { replace: true });
      } else {
        // Only create if we really have to
        const newId = generateId();
        const newP: Project = {
          id: newId,
          title: "Untitled Symphony",
          text: "",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          difficulty: settings.defaultDifficulty,
          layoutMode: LayoutMode.LINEAR,
          visualStyle: VisualStyle.PAINT,
          promptId: "free",
          constraints: [],
        };
        setProjects([newP]);
        navigate(`/studio/${newId}`, { replace: true });
      }
      return;
    }

    if (projectInList && lastInitializedId.current !== id) {
      setText(projectInList.text);
      setTitle(projectInList.title);
      setDifficulty(projectInList.difficulty);
      setLayoutMode(projectInList.layoutMode || LayoutMode.LINEAR);
      setVisualStyle(projectInList.visualStyle || VisualStyle.PAINT);
      setPromptId(projectInList.promptId);
      lastInitializedId.current = id;
    }
  }, [
    id,
    projectInList,
    settings.defaultDifficulty,
    setProjects,
    navigate,
    projects.length,
  ]);

  const analysis = useMemo(
    () => analyzeText(text, settings.customLexicon),
    [text, settings.customLexicon],
  );

  const handleSave = () => {
    if (!id) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              text,
              title,
              difficulty,
              layoutMode,
              visualStyle,
              promptId,
              updatedAt: Date.now(),
              analysisCache: analysis,
            }
          : p,
      ),
    );
  };

  useEffect(() => {
    if (!id || lastInitializedId.current !== id) return;
    const timer = setTimeout(handleSave, 2000);
    return () => clearTimeout(timer);
  }, [text, title, difficulty, layoutMode, visualStyle, promptId, id]);

  useEffect(() => {
    let frame: number;
    if (isFinaleOpen) {
      setFinaleProgress(0);
      const duration = Math.min(
        10000,
        Math.max(4000, analysis.sentences.length * 250),
      );
      const start = Date.now();
      const animate = () => {
        const progress = Math.min(1, (Date.now() - start) / duration);
        setFinaleProgress(progress);
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      // Delay slightly to ensure setFinaleProgress(0) took effect
      const timeout = setTimeout(() => {
        frame = requestAnimationFrame(animate);
      }, 50);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timeout);
      };
    }
  }, [isFinaleOpen, analysis.sentences.length, replayKey]);

  const handleReplay = () => {
    setReplayKey((prev) => prev + 1);
  };

  const captureFinaleSnapshot = () => {
    const canvas = document.getElementById(
      "canvas-finale",
    ) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}_symphony_finale.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
    }
  };

  const handleExportGif = async () => {
    const canvas = document.getElementById(
      "canvas-finale",
    ) as HTMLCanvasElement;
    if (!canvas) return;

    setIsExportingGif(true);
    const frames: string[] = [];
    const frameCount = 20; // Capture 20 snapshots across the animation

    // We drive the progress state manually for the capture
    const originalProgress = finaleProgress;

    for (let i = 0; i <= frameCount; i++) {
      setFinaleProgress(i / frameCount);
      // Small delay to allow render
      await new Promise((resolve) => setTimeout(resolve, 100));
      frames.push(canvas.toDataURL("image/png"));
    }

    setFinaleProgress(originalProgress);

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: Math.ceil(canvas.width / (window.devicePixelRatio || 1)),
      height: Math.ceil(canvas.height / (window.devicePixelRatio || 1)),
      workerScript: "/gif.worker.js",
    });

    let loadedFrames = 0;
    frames.forEach((frameDataUrl) => {
      const img = new Image();
      img.onload = () => {
        gif.addFrame(img, { delay: 100 });
        loadedFrames++;
        if (loadedFrames === frames.length) {
          gif.render();
        }
      };
      img.src = frameDataUrl;
    });

    gif.on("finished", (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}_symphony.gif`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      setIsExportingGif(false);
    });
  };

  const avgComplexity = useMemo(() => {
    if (!analysis.sentences.length) return 0;
    return (
      (analysis.sentences.reduce((a, b) => a + b.complexityScore, 0) /
        analysis.sentences.length) *
      100
    );
  }, [analysis.sentences]);

  const lingStats = useMemo(() => {
    if (!analysis.sentences.length) return { verb: 0, adj: 0, noun: 0 };
    const n = analysis.sentences.length;
    return {
      verb:
        (analysis.sentences.reduce(
          (a, b) => a + b.linguisticProfile.verbDensity,
          0,
        ) /
          n) *
        100,
      adj:
        (analysis.sentences.reduce(
          (a, b) => a + b.linguisticProfile.adjectiveDensity,
          0,
        ) /
          n) *
        100,
      noun:
        (analysis.sentences.reduce(
          (a, b) => a + b.linguisticProfile.nounDensity,
          0,
        ) /
          n) *
        100,
    };
  }, [analysis.sentences]);

  return (
    <div
      className={`h-[calc(100vh-64px)] flex flex-col ${focusMode ? "fixed inset-0 z-50 bg-white" : ""}`}
    >
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`flex-1 flex flex-col p-6 transition-all border-r border-slate-100 ${focusMode ? "max-w-4xl mx-auto w-full shadow-2xl" : ""}`}
        >
          <div className="flex items-center gap-4 mb-6 no-print">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-2xl font-serif italic border-none focus:ring-0 bg-transparent placeholder-slate-300"
              placeholder="Symphony Name..."
            />
            <div className="flex gap-2">
              <Select
                label="Difficulty"
                value={difficulty}
                onChange={(v) => setDifficulty(v as Difficulty)}
                options={[
                  { value: Difficulty.BEGINNER, label: "Beginner" },
                  { value: Difficulty.INTERMEDIATE, label: "Intermediate" },
                  { value: Difficulty.ADVANCED, label: "Advanced" },
                ]}
              />
              <Select
                label="Prompt"
                value={promptId}
                onChange={setPromptId}
                options={PROMPTS.map((p) => ({ value: p.id, label: p.title }))}
              />
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-8 text-xl leading-relaxed font-serif border-none focus:ring-0 resize-none bg-white rounded-2xl shadow-inner scrollbar-hide"
            placeholder="Start your masterpiece..."
          />
          <div className="mt-6 flex items-center justify-between no-print">
            <div className="flex items-center gap-4">
              <StatChip label="Words" value={analysis.summary.wordCount} />
              <StatChip
                label="Paragraphs"
                value={analysis.summary.paragraphCount}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setFocusMode(!focusMode)}
                variant="outline"
              >
                {focusMode ? "Exit Focus" : "Focus Mode"}
              </Button>
              <Button
                onClick={() => setIsFinaleOpen(true)}
                disabled={text.length < 10}
              >
                Play Finale
              </Button>
            </div>
          </div>
        </div>
        {!focusMode && (
          <div className="w-[420px] bg-slate-50 p-6 flex flex-col gap-6 overflow-y-auto no-print border-l border-slate-200">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <SymphonyCanvas
                id="canvas-preview"
                analysis={analysis}
                difficulty={difficulty}
                layoutMode={layoutMode}
                visualStyle={visualStyle}
              />
            </div>

            <Card className="p-5">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">
                Composition Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: LayoutMode.LINEAR, label: "Timeline" },
                  { id: LayoutMode.SCATTER, label: "Scatter" },
                  { id: LayoutMode.CIRCULAR, label: "Mandala" },
                  { id: LayoutMode.VORTEX, label: "Vortex" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setLayoutMode(mode.id)}
                    className={`p-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-tight transition-all ${layoutMode === mode.id ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"}`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">
                Visual Style
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: VisualStyle.PAINT, label: "Splashes" },
                  { id: VisualStyle.CIRCLES, label: "Circles" },
                  { id: VisualStyle.STARS, label: "Stars" },
                  { id: VisualStyle.MIX, label: "Mix" },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setVisualStyle(style.id)}
                    className={`p-3 rounded-xl border-2 text-[10px] font-bold uppercase tracking-tight transition-all ${visualStyle === style.id ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4">
                Expressive Heuristics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span>Flow Complexity</span>
                    <span className="font-bold">
                      {avgComplexity.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-600 h-full transition-all duration-500"
                      style={{ width: `${avgComplexity}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <StatSmall
                    label="Action"
                    value={lingStats.verb.toFixed(0)}
                    unit="%"
                  />
                  <StatSmall
                    label="Descriptive"
                    value={lingStats.adj.toFixed(0)}
                    unit="%"
                  />
                  <StatSmall
                    label="Substance"
                    value={lingStats.noun.toFixed(0)}
                    unit="%"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
      <Modal
        isOpen={isFinaleOpen}
        onClose={() => setIsFinaleOpen(false)}
        title="The Visual Symphony: Live Performance"
      >
        <div className="flex flex-col gap-6 relative">
          <div className="aspect-video w-full rounded-3xl overflow-hidden bg-white shadow-2xl border-8 border-slate-100">
            <SymphonyCanvas
              id="canvas-finale"
              analysis={analysis}
              difficulty={difficulty}
              layoutMode={layoutMode}
              visualStyle={visualStyle}
              progress={finaleProgress}
              width={1280}
              height={720}
              isPoster
            />
          </div>

          {isExportingGif && (
            <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-xl text-blue-800">
                Recording Symphony GIF...
              </p>
              <p className="text-slate-500 text-sm">
                Please wait while we render the animation.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center bg-slate-50 p-6 rounded-2xl">
            <div className="flex items-center gap-6">
              <div className="text-sm font-medium text-slate-500">
                Performance:
              </div>
              <div className="w-64 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${finaleProgress * 100}%` }}
                ></div>
              </div>
              <div className="text-sm font-bold text-blue-600">
                {(finaleProgress * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReplay} variant="outline">
                Replay
              </Button>
              <Button onClick={captureFinaleSnapshot} variant="secondary">
                Snapshot (PNG)
              </Button>
              <Button
                onClick={handleExportGif}
                variant="secondary"
                disabled={isExportingGif}
              >
                {isExportingGif ? "Rendering..." : "Export GIF"}
              </Button>
              <Button onClick={() => setIsFinaleOpen(false)}>Finish</Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const StatSmall: React.FC<{ label: string; value: string; unit: string }> = ({
  label,
  value,
  unit,
}) => (
  <div className="flex flex-col items-center bg-slate-100/50 p-2 rounded-lg">
    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
      {label}
    </div>
    <div className="text-sm font-black text-slate-700">
      {value}
      {unit}
    </div>
  </div>
);

export default Studio;
