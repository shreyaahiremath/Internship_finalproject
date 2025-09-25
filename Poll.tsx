
'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const religions = [
  "🙏 Hinduism",
  "☪️ Islam",
  "✝️ Christianity",
  "🪯 Sikhism",
  "☸️ Buddhism",
  "🕉️ Jainism",
  "🌍 Other",
];

interface PollProps {
  headline: string;
  details: string;
  image?: string;
  url?: string;
}

interface PollOption {
  text: string;
  selected: boolean;
}

export default function Poll({ headline, details, image, url }: PollProps) {
  // ---------- Added states ----------
  const [selectedNews, setSelectedNews] = useState<{ title: string; description: string }>({ title: '', description: '' });
  const [selectedReligion, setSelectedReligion] = useState('🙏 Hinduism');
  const [generatedQuestion, setGeneratedQuestion] = useState('');
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  // --------------------------------------------------

  const [pollQuestion, setPollQuestion] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emojiList = ["✨", "🔥", "🌿", "💡", "🌸", "🌍", "⭐", "🕊️"];

  const generatePoll = async () => {
    setLoading(true);
    setPollQuestion(null);
    setPollOptions([]);
    setSubmitted(false);

    try {
      const message = `
News: ${headline}
Details: ${details}
${selectedReligion ? "Selected Religion: " + selectedReligion : "Selected Religion: General"}

Task: Generate 1 faith-based multiple choice poll question with 4 options, clearly numbered, reflecting ethical and belief-oriented choices.Dont use markdown language for question. Provide options in a JSON format like: ["Option 1","Option 2","Option 3","Option 4"].
`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data?.message) {
        let options: string[] = [];
        let question = "";

        try {
          const match = data.message.match(/\[.*\]/);
          if (match) options = JSON.parse(match[0]);

          question = data.message
            .replace(match?.[0] || "", "")
            .replace(/###.*$/, "")
            .replace(/\*\*Options:\*\*.*$/, "")
            .trim();
        } catch (err) {
          console.error("Failed to parse poll response:", err);
          question = "No poll question generated";
        }

        const randomizedOptions = options.map((opt, i) => {
          const emoji = emojiList[i % emojiList.length];
          return `${emoji} ${opt}`;
        });

        setPollQuestion(question);
        setPollOptions(randomizedOptions.map((opt) => ({ text: opt, selected: false })));

        // ---------- Set generated question & options for database ----------
        setGeneratedQuestion(question);
        setGeneratedOptions(options);
        setSelectedNews({ title: headline, description: details });
        // ------------------------------------------------------------------
      }
    } catch (err) {
      console.error("Error generating poll:", err);
      setPollQuestion("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index: number) => {
    const selectedText = pollOptions[index].text; // fix: get correct text
    setPollOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, selected: i === index }))
    );
    setChosenOption(selectedText); // no longer rely on old state
  };

  const [chosenOption, setChosenOption] = useState('');

  const handleSubmitAnswer = async () => {
    const selected = pollOptions.find((opt) => opt.selected)?.text;
    if (!selected) {
      alert("Please select an option to submit.");
      return;
    }

    setSubmitted(true);

    try {
      // Save poll answer to your existing endpoint (optional)
      await fetch("/api/savePollAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline,
          question: pollQuestion,
          selectedOption: selected,
          religion: selectedReligion || "General",
        }),
      });

      // ---------- Save poll to Supabase ----------
      await savePoll(selected);
      // ------------------------------------------
    } catch (err) {
      console.error("Error saving poll answer:", err);
      alert("Failed to submit your answer. Try again.");
    }
  };

  // ---------- Updated savePoll function ----------
  const savePoll = async (selectedOption: string) => {
    try {
      const response = await fetch('/components/save-poll', { // fix: correct path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: selectedNews.title,
          description: selectedNews.description,
          religion: selectedReligion,
          poll_question: generatedQuestion,
          options: generatedOptions, // array
          user_choice: selectedOption
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('Poll saved!', data.data);
      } else {
        console.error('Failed to save poll', data.error);
      }
    } catch (err) {
      console.error('Error saving poll:', err);
    }
  };
  // ------------------------------------------------------

  // ---------- Added LibreTranslate functions ----------
  async function translateText(text: string, lang: string) {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang: lang })
    });

    const data = await res.json();
    return data.translatedText;
  }

  const handleTranslate = async () => {
    const translated = await translateText("Hello world", "es");
    console.log(translated); // Hola mundo
  };
  // ------------------------------------------------------

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-800 via-purple-700 to-indigo-900 rounded-2xl shadow-xl p-6 text-white max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {image && (
        <img
          src={image}
          alt={headline}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}

      <div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold hover:text-yellow-300 transition"
          >
            {headline}
          </a>
        ) : (
          <h2 className="text-xl font-bold">{headline}</h2>
        )}

        <p className="text-gray-200 text-sm mt-2">{details}</p>

        <h3 className="text-md font-semibold mt-4">Select your religion:</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {religions.map((religion) => (
            <button
              key={religion}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                selectedReligion === religion
                  ? "bg-yellow-500 text-black font-semibold shadow-lg"
                  : "bg-white/20 hover:bg-white/30"
              }`}
              onClick={() => setSelectedReligion(religion)}
            >
              {religion}
            </button>
          ))}
        </div>

        <button
          onClick={generatePoll}
          disabled={loading}
          className="mt-5 w-full py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 disabled:opacity-50 transition"
        >
          {loading ? "✨ Generating..." : "🙏 Generate Faith Poll"}
        </button>

        <AnimatePresence>
          {pollQuestion && (
            <motion.div
              className="mt-5 p-4 bg-white/10 rounded-lg"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h4 className="font-semibold mb-3 text-lg">📜 {pollQuestion}</h4>
              <div className="flex flex-col gap-2">
                {pollOptions.map((opt, index) => (
                  <button
                    key={index}
                    className={`px-3 py-2 rounded-lg border text-sm text-left transition ${
                      opt.selected
                        ? "bg-blue-600 border-blue-400 shadow-md"
                        : "bg-white/20 hover:bg-white/30 border-white/30"
                    }`}
                    onClick={() => handleSelectOption(index)}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {!submitted && pollOptions.length > 0 && (
                <button
                  onClick={handleSubmitAnswer}
                  className="mt-4 w-full py-2 bg-blue-500 text-black rounded-lg font-semibold hover:bg-blue-400 transition"
                >
                  🚀 Submit Answer
                </button>
              )}

              {submitted && (
                <motion.div
                  className="mt-5 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <p className="text-green-300 font-bold text-lg">
                    🎉 Your answer has been submitted! 🙌
                  </p>
                  <motion.div
                    className="mt-3 flex justify-center gap-3 text-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span>🎊</span>
                    <span>✨</span>
                    <span>🕊️</span>
                    <span>🌟</span>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
