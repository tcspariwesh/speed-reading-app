import React, { useEffect, useMemo, useRef, useState } from "react";

const HINT_MAP = {
  sun: { emoji: "☀️", label: "Sun" },
  moon: { emoji: "🌙", label: "Moon" },
  star: { emoji: "⭐", label: "Star" },
  tree: { emoji: "🌳", label: "Tree" },
  book: { emoji: "📘", label: "Book" },
  pen: { emoji: "✍️", label: "Pen" },
  ball: { emoji: "⚽", label: "Ball" },
  car: { emoji: "🚗", label: "Car" },
  bus: { emoji: "🚌", label: "Bus" },
  house: { emoji: "🏠", label: "House" },
  door: { emoji: "🚪", label: "Door" },
  chair: { emoji: "🪑", label: "Chair" },
  table: { emoji: "🪟", label: "Table" },
  water: { emoji: "💧", label: "Water" },
  food: { emoji: "🍽️", label: "Food" },
  milk: { emoji: "🥛", label: "Milk" },
  apple: { emoji: "🍎", label: "Apple" },
  bird: { emoji: "🐦", label: "Bird" },
  fish: { emoji: "🐟", label: "Fish" },
  hand: { emoji: "✋", label: "Hand" },
  foot: { emoji: "🦶", label: "Foot" },
  eye: { emoji: "👁️", label: "Eye" },
  ear: { emoji: "👂", label: "Ear" },
  nose: { emoji: "👃", label: "Nose" },
  school: { emoji: "🏫", label: "School" },
  friend: { emoji: "🤝", label: "Friend" },
  family: { emoji: "👨‍👩‍👧‍👦", label: "Family" },
};

function getHint(word) {
  const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  return HINT_MAP[normalized] || { emoji: "🔎", label: "Hint" };
}

export default function SpeedReadingApp1() {
  const [inputText, setInputText] = useState(
    "Paste text here and press Start. The app will show one word at a time at the speed you choose."
  );
  const [wpm, setWpm] = useState(250);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [words, setWords] = useState([]);

  const timerRef = useRef(null);

  const intervalMs = useMemo(() => Math.max(60, Math.round(60000 / wpm)), [wpm]);
  const currentWord = words[currentIndex] || "Ready";
  const currentHint = getHint(currentWord);

  useEffect(() => {
    if (!isRunning || words.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, intervalMs, words.length]);

  const startReading = () => {
    const parsedWords = inputText.trim().split(/\s+/).filter(Boolean);
    setWords(parsedWords);
    setCurrentIndex(0);
    if (parsedWords.length > 0) setIsRunning(true);
  };

  const pauseReading = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetReading = () => {
    pauseReading();
    setCurrentIndex(0);
    setWords([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Speed Reading</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold">Read text one word at a time</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Paste any text, adjust the reading speed, and control playback from the UI.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <label className="mb-3 block text-sm font-medium text-slate-300">Paste text</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your article, notes, or paragraph here..."
              className="h-72 w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-base leading-7 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={startReading} className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">Start</button>
              <button onClick={pauseReading} className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:bg-slate-800">Pause</button>
              <button onClick={resetReading} className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-100 transition hover:bg-slate-800">Reset</button>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium text-slate-300">Word speed</label>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-cyan-300">{wpm} WPM</span>
              </div>
              <input type="range" min="100" max="1000" step="10" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="mt-4 w-full accent-cyan-400" />
              <p className="mt-2 text-sm text-slate-400">Current interval: {intervalMs} ms per word</p>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <p className="text-sm font-medium text-slate-300">Current word</p>
              <div className="mt-4 flex min-h-44 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 p-6 text-center">
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-4xl shadow-lg">{currentHint.emoji}</div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{currentHint.label}</p>
                  </div>
                  <p className="text-4xl md:text-6xl font-bold tracking-wide text-cyan-300">{currentWord}</p>
                  <p className="mt-3 text-sm text-slate-400">Word {words.length === 0 ? 0 : currentIndex + 1} of {words.length || 0}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
              <p className="text-sm font-medium text-slate-300">Status</p>
              <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                {isRunning
                  ? "Reading in progress. Use Pause or Reset anytime."
                  : words.length > 0
                  ? currentIndex >= words.length - 1
                    ? "Reading completed. Press Start to begin again."
                    : "Paused. Press Start to continue from the beginning."
                  : "Paste text and press Start."}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
