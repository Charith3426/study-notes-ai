"use client"; // This tells Next.js this is a client-side component

import { useEffect, useState } from "react";

// Define the type for our Topic object
type Topic = {
  id: string;
  title: string;
  notes: string;
  status: string;
  createdAt: string;
};

export default function Home() {
  // --- State Variables ---
  // 'topics' will hold the list of all topics from the database
  const [topics, setTopics] = useState<Topic[]>([]);
  
  // 'title' and 'notes' will track what the user types into the form
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  // State for AI Summary
  const [aiSummary, setAiSummary] = useState<{ [key: string]: string }>({});
  const [isLoadingAI, setIsLoadingAI] = useState<string | null>(null);

  // --- Data Fetching (READ) ---
  const fetchTopics = async () => {
    const res = await fetch("/api/topics"); // Calls GET /api/topics
    const data = await res.json();
    setTopics(data);
  };

  // --- Data Mutation (CREATE) ---
  const addTopic = async () => {
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    await fetch("/api/topics", {
      method: "POST", // Calls POST /api/topics
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, notes, status: "Planned" }),
    });
    // Clear the form and refresh the list
    setTitle("");
    setNotes("");
    fetchTopics();
  };

  // --- Data Mutation (DELETE) ---
  const deleteTopic = async (id: string) => {
    await fetch(`/api/topics/${id}`, {
      method: "DELETE", // Calls DELETE /api/topics/[id]
    });
    // Refresh the list
    fetchTopics();
  };

  // --- AI Function (Improved) ---
  const getAiSummary = async (topicId: string, notesToSummarize: string) => {
    if (!notesToSummarize) {
      alert("There are no notes to summarize.");
      return;
    }

    setIsLoadingAI(topicId); // Start loading this specific topic
    setAiSummary(prev => ({ ...prev, [topicId]: "" })); // Clear old summary

    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesToSummarize }),
      });

      const data = await res.json();

      if (res.ok) {
        setAiSummary(prev => ({ ...prev, [topicId]: data.summary }));
      } else {
        setAiSummary(prev => ({ ...prev, [topicId]: "Error: Could not generate summary." }));
      }
    } catch (error) {
      setAiSummary(prev => ({ ...prev, [topicId]: "Error: Failed to reach AI service." }));
    } finally {
      setIsLoadingAI(null); // Stop loading
    }
  };


  // --- useEffect Hook ---
  useEffect(() => {
    fetchTopics();
  }, []);

  // --- JSX (The HTML for the page) ---
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        AI Study Notes Tracker
      </h1>

      {/* Form to Add New Topic */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Add New Topic</h2>
        <input
          type="text"
          className="border p-2 w-full mb-3 rounded-md"
          placeholder="Topic Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-3 rounded-md"
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          onClick={addTopic}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Topic
        </button>
      </div>

      {/* List of Topics */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">My Topics</h2>
        {topics.map((t) => (
          <div key={t.id} className="border p-4 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-blue-800">{t.title}</h3>
              <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                {t.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{t.notes}</p>
            
            {/* --- AI Button and Delete Button (Final Version) --- */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => getAiSummary(t.id, t.notes)} // Pass ID and notes
                disabled={isLoadingAI === t.id} // Disable only this button
                className="text-green-600 text-sm hover:underline disabled:text-gray-400"
              >
                {isLoadingAI === t.id ? "Summarizing..." : "Summarize Notes"}
              </button>
              
              <button
                onClick={() => deleteTopic(t.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>

            {/* Display AI Summary for this specific topic */}
            {aiSummary[t.id] && (
              <div className="mt-3 p-3 bg-gray-100 rounded-md border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-800 mb-1">AI Summary:</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiSummary[t.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* --- MANDATORY FOOTER --- */}
      {/* !! IMPORTANT: Change "Your Name" and the links !! */}
      <footer className="text-center text-sm text-gray-500 mt-10 pt-5 border-t">
        © 2025 Your Name |{"Koka Jnana Charith "}
        <a
          href="https://github.com/Charith3426"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600"
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          href="https://www.linkedin.com/in/jnana-charith-koka-a99a79373/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-600"
        >
          LinkedIn
        </a>
      </footer>
    </div>
  );
}