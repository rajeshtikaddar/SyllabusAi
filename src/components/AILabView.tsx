import React, { useState, useEffect, useRef } from 'react';
import { SyllabusDocument, SummaryItem } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: string;
  };
}

interface AILabViewProps {
  documents: SyllabusDocument[];
  summaries: SummaryItem[];
  initialPrompt?: string;
  onUploadDocument: (doc: SyllabusDocument) => void;
}

export const AILabView: React.FC<AILabViewProps> = ({
  documents,
  summaries,
  initialPrompt = '',
  onUploadDocument,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello Alex! I am your SyllabusAI Academic Assistant. I have indexed all your Fall 2024 course syllabi, grading policies, and assignment schedules. How can I assist your study sprint today?",
      timestamp: '10:00 AM',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [isThinking, setIsThinking] = useState(false);
  const [activeCourseFilter, setActiveCourseFilter] = useState<string>('all');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const quickPrompts = [
    'What is the late submission policy for CS 301?',
    'Summarize Unit 3 for MATH 201 with 5 practice problems',
    'Calculate my current grade if I score 85% on the Midterm',
    'Draft an email to Prof. Davis regarding office hours',
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsThinking(true);

    try {
      // Direct call to Gemini backend API proxy or intelligent academic synthesizer
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          syllabusContext: activeCourseFilter === 'all' ? 'All indexed Fall 2024 Syllabi' : `Course: ${activeCourseFilter}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: data.text || data.reply || generateFallbackResponse(textToSend),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Fallback simulated intelligent response
        setTimeout(() => {
          const aiMsg: Message = {
            id: `msg-${Date.now() + 1}`,
            sender: 'ai',
            text: generateFallbackResponse(textToSend),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsThinking(false);
        }, 1000);
        return;
      }
    } catch {
      setTimeout(() => {
        const aiMsg: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: generateFallbackResponse(textToSend),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsThinking(false);
      }, 1000);
      return;
    }

    setIsThinking(false);
  };

  const generateFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('late submission') || q.includes('late policy')) {
      return "According to the **CS 301 Syllabus** (Instructor: Dr. Sarah Jenkins):\n- Late submissions incur a 10% penalty per 24 hours late.\n- Maximum allowable delay is 48 hours (after which 0 credit is awarded).\n- You have 2 'Emergency Slip Days' that waive the penalty if requested 6 hours in advance.";
    }
    if (q.includes('math 201') || q.includes('linear algebra') || q.includes('unit 3')) {
      return "Here is a breakdown of **MATH 201: Unit 3 (Vector Spaces & Eigenvalues)**:\n1. **Core Concept:** A vector space $V$ over field $\\mathbb{R}$ requires closure under addition and scalar multiplication.\n2. **Characteristic Equation:** $\\det(A - \\lambda I) = 0$ finds the eigenvalues $\\lambda$.\n3. **Eigenvector computation:** Solve $(A - \\lambda I)v = 0$.\n\n**Practice Question 1:** For $A = \\begin{bmatrix} 4 & 2 \\\\ 1 & 3 \\end{bmatrix}$, find eigenvalues and verify that $\\text{Tr}(A) = \\lambda_1 + \\lambda_2 = 7$.";
    }
    if (q.includes('grade') || q.includes('calculate') || q.includes('midterm')) {
      return "Based on your grading scheme for **CS 301 (Algorithms)**:\n- Homework Assignments: 30%\n- Midterm Exam: 25%\n- Final Project: 25%\n- Final Exam: 20%\n\nIf you score 85% on the Midterm and maintain your 92% average on Homeworks, your projected course grade will stand at **89.4% (Solid A-/B+)** before the Final Exam.";
    }
    if (q.includes('email') || q.includes('prof') || q.includes('office hour')) {
      return "Here is a polished email draft for your instructor:\n\n**Subject:** CS 301 - Question regarding Dijkstra Algorithm Proof / Office Hours\n\nDear Professor Jenkins,\n\nI hope your week is going well. I am working through the Homework 3 graph problems and had a quick clarifying question regarding the proof for edge relaxation in Dijkstra's algorithm.\n\nCould I drop by your office hours this Thursday at 2:00 PM in Science Center 402, or connect briefly via Zoom if preferred?\n\nThank you for your time and guidance,\nAlex Lin (ID: 9021482)";
    }
    return `Based on your indexed syllabus documents for Fall 2024:\n\nRegarding "${query}":\n- We recommend reviewing the primary lecture slides in Module 4.\n- Be sure to verify the assignment submission format on the portal.\n- Would you like me to formulate a 3-step action checklist or generate quick flashcards for this topic?`;
  };

  const handleSimulateUpload = () => {
    const fileTitle = prompt('Enter the Syllabus or Course Document Title to index:');
    if (!fileTitle) return;
    const newDoc: SyllabusDocument = {
      id: `doc-${Date.now()}`,
      title: fileTitle,
      courseCode: 'PHYS 150',
      fileSize: '1.8 MB',
      uploadDate: 'Just now',
      parsedStatus: 'ready',
    };
    onUploadDocument(newDoc);
    alert(`Successfully parsed and indexed "${fileTitle}". You can now query its contents!`);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold font-headline-md text-white">
              AI Syllabus Lab &amp; Semantic Query
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Grounded in your uploaded course syllabi, assignment rubrics, and lecture timelines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={activeCourseFilter}
            onChange={(e) => setActiveCourseFilter(e.target.value)}
            aria-label="Filter context by course"
            className="bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:bg-white/15 cursor-pointer backdrop-blur-md"
          >
            <option value="all" className="bg-slate-900 text-white">
              All Courses Context
            </option>
            <option value="CS 301" className="bg-slate-900 text-white">
              CS 301 (Algorithms)
            </option>
            <option value="MATH 201" className="bg-slate-900 text-white">
              MATH 201 (Linear Algebra)
            </option>
            <option value="PHYS 150" className="bg-slate-900 text-white">
              PHYS 150 (Mechanics)
            </option>
          </select>

          <button
            onClick={handleSimulateUpload}
            className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload PDF</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Indexed Documents & Summary Cards */}
        <div className="space-y-6">
          {/* Indexed Documents Card */}
          <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-400 text-[20px]">
                  folder_open
                </span>
                <h3 className="font-bold text-white text-sm">Indexed Syllabi ({documents.length})</h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80">
                        {doc.courseCode}
                      </span>
                      <span className="text-[11px] text-white/50">{doc.fileSize}</span>
                    </div>
                    <p className="text-xs font-semibold text-white truncate mt-1">{doc.title}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Indexed & Ready" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Course Summaries */}
          <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400 text-[20px]">
                  auto_awesome
                </span>
                <h3 className="font-bold text-white text-sm">AI Study Summaries</h3>
              </div>
            </div>

            <div className="space-y-3">
              {summaries.map((sum) => (
                <div
                  key={sum.id}
                  onClick={() => handleSendMessage(`Provide deeper insights on: ${sum.title} (${sum.courseCode})`)}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-purple-500/10 border border-white/10 hover:border-purple-400/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-300">{sum.courseCode}</span>
                    <span className="material-symbols-outlined text-[14px] text-white/40 group-hover:text-purple-300 transition-colors">
                      north_east
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1 group-hover:text-purple-200">
                    {sum.title}
                  </h4>
                  <p className="text-[11px] text-white/60 line-clamp-2 mt-1">{sum.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Conversational AI Canvas */}
        <div className="lg:col-span-2 flex flex-col rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[560px]">
          {/* Chat Transcript Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3.5 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md border ${
                      isAi
                        ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-400/30'
                        : 'bg-white/20 text-white border-white/30'
                    }`}
                  >
                    {isAi ? 'AI' : 'AL'}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-3xl p-4.5 space-y-2 backdrop-blur-xl ${
                      isAi
                        ? 'bg-white/5 border border-white/10 text-white shadow-lg'
                        : 'bg-indigo-600/80 border border-indigo-400/30 text-white shadow-indigo-900/40 shadow-lg'
                    }`}
                  >
                    <div className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                      {m.text}
                    </div>
                    <div className="text-[10px] text-white/40 text-right">{m.timestamp}</div>
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-xs text-purple-300">
                  AI
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-white/60">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>Synthesizing syllabus knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-6 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-white/40 uppercase whitespace-nowrap">
              Suggestions:
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp)}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/70 hover:text-white whitespace-nowrap transition-all cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box Area */}
          <div className="p-4 bg-white/5 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask any question about your courses, policies, formulas, or homework..."
                  className="w-full bg-white/5 border border-white/15 rounded-2xl pl-4 pr-10 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-indigo-400 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isThinking}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 border border-white/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
