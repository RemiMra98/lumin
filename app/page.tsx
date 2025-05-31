const [scores, setScores] = useState<Record<string, number>>({});

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LandingPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState([]);
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const tags = ['Design', 'Tech', 'Santé', 'Curiosité', 'Philo', 'Science', 'Art', 'Inspiration', 'Monde'];

  const toggleInterest = (tag) => {
    setInterests((prev) => {
      if (prev.includes(tag)) {
        const updated = prev.filter((t) => t !== tag);
        const { [tag]: _, ...rest } = scores;
        setScores(rest);
        return updated;
      } else {
        setScores((prevScores) => ({
          ...prevScores,
          [tag]: (prevScores[tag] || 0) + 1
        }));
        return [...prev, tag];
      }
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2) {
      try {
        await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, interests, scores }),
        });
        setSubmitted(true);
      } catch (error) {
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-gray-800 font-sans">
      <header className="flex items-center justify-between px-4 md:px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <img src="/logo-lumin-key.png" alt="Lumin Logo" className="h-10 w-auto" />
          <span className="text-xl md:text-2xl font-semibold tracking-tight">Lumin</span>
        </div>
        <button className="hidden sm:inline-block bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium px-4 py-2 rounded-xl shadow">
          Rejoindre la beta
        </button>
      </header>

      <main className="px-4 md:px-6 py-10 md:py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          Brisez la bulle. Ouvrez votre curiosité.
        </h1>
        <p className="text-base md:text-xl text-gray-600 mb-8">
          Lumin vous envoie chaque semaine des pépites inattendues, mais pertinentes.
          Articles, idées, rencontres ou outils — pour nourrir l’esprit et déverrouiller de nouvelles perspectives.
        </p>
        <div className="mb-12">
          <Image
            src="/illustration-bridge-light.png"
            alt="Illustration pont lumineux"
            width={500}
            height={300}
            className="mx-auto"
          />
        </div>
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-md space-y-6"
            >
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-yellow-300 transition-all duration-500 ${step === 1 ? "w-1/2" : "w-full"}`}
                ></div>
              </div>
              {step === 1 && (
                <form onSubmit={handleNext} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <input
                    type="email"
                    placeholder="Votre email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 shadow w-full sm:w-auto"
                  >
                    Suivant
                  </button>
                </form>
              )}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-medium mb-4">Choisissez vos centres d’intérêt :</h2>
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          interests.includes(tag)
                            ? "bg-yellow-300 text-yellow-900 border-yellow-400"
                            : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        } hover:bg-yellow-200`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNext}
                    className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 shadow"
                  >
                    Valider mon inscription
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-10 rounded-xl shadow-xl max-w-xl mx-auto"
            >
              <h2 className="text-2xl font-bold mb-4">Merci et bienvenue dans Lumin ✨</h2>
              <p className="text-gray-600 text-base">
                Vous recevrez bientôt votre première dose de sérendipité. Préparez-vous à penser autrement !
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
