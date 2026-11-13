import React, { useState } from 'react';
import { 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Send,
  ShieldAlert
} from 'lucide-react';
import { ClarificationQuestion, QuestionState } from '../../types/rulebook';

interface Props {
  questions: ClarificationQuestion[];
  onAnswerQuestion: (id: string, answer: string, answeredBy: string) => void;
  onUpdateQuestionState: (id: string, newState: QuestionState) => void;
}

export const ClarificationQuestionsSection: React.FC<Props> = ({
  questions,
  onAnswerQuestion,
  onUpdateQuestionState
}) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [responderName, setResponderName] = useState('Pragatheeswaran Kasinathan');

  const handleAnswerSubmit = (e: React.FormEvent, qId: string) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    onAnswerQuestion(qId, answerText.trim(), responderName.trim() || 'Reviewer');
    setAnswerText('');
    setActiveQuestionId(null);
  };

  const openQuestionsCount = questions.filter(q => q.state === 'Open').length;
  const blockingCount = questions.filter(q => q.blocking && q.state === 'Open').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Status Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Clarifications & Gaps
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {openQuestionsCount} open questions · {blockingCount} blocking
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            {blockingCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>{blockingCount} Blocking Delivery</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>All Blockers Resolved</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div 
            key={q.id}
            className={`bg-white rounded-xl border p-5 shadow-2xs space-y-4 transition-colors ${
              q.blocking && q.state === 'Open'
                ? 'border-rose-300 ring-1 ring-rose-200'
                : 'border-slate-200/80'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-400">
                  {q.id}
                </span>

                {q.blocking && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Blocking Delivery</span>
                  </span>
                )}

                <span className="text-slate-500 font-mono text-[11px]">
                  Impact: {q.blocking ? 'High (Blocking)' : 'Advisory'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${q.state === 'Answered' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {q.state === 'Answered' ? 'Answered' : 'Awaiting Clarification'}
                </span>

                <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => onUpdateQuestionState(q.id, 'Deferred')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      q.state === 'Deferred' ? 'bg-slate-700 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Defer
                  </button>
                  <button
                    onClick={() => onUpdateQuestionState(q.id, 'Open')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      q.state === 'Open' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Reopen
                  </button>
                </div>
              </div>
            </div>

            {/* Question Body */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                {q.question}
              </h3>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs space-y-1">
                <p className="text-slate-600">
                  <strong className="text-slate-700">Specification Basis:</strong> {q.basis}
                </p>
                <p className="text-slate-600">
                  <strong className="text-slate-700">Delivery Impact:</strong> {q.impact}
                </p>
              </div>
            </div>

            {/* Answer Display or Form */}
            {q.state === 'Answered' && q.answer ? (
              <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-900 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clarification Resolved</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700">
                    by {q.answeredBy} · {q.answeredAt}
                  </span>
                </div>
                <p className="text-emerald-950 leading-relaxed pt-1">
                  {q.answer}
                </p>
              </div>
            ) : (
              <div className="pt-1">
                {activeQuestionId === q.id ? (
                  <form onSubmit={(e) => handleAnswerSubmit(e, q.id)} className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">Provide Resolution / Clarification</label>
                      <textarea
                        rows={2}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="State the clarifying rule, confirmed parameter, or stakeholder decision..."
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveQuestionId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit Answer</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      setActiveQuestionId(q.id);
                      setAnswerText('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Answer / Resolve Gap</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
