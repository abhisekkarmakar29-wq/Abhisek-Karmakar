import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  FileQuestion,
  Video,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I submit my customer interview video or pitch?',
      a: 'Upload your video to YouTube (as "Unlisted" or "Public"), Loom, Vimeo, or Google Drive (set sharing to "Anyone with the link can view"). Paste the URL directly into the Video URL field in the activity wizard. The portal will automatically display an interactive deliverable preview.'
    },
    {
      q: 'Can I edit my activity answers after saving?',
      a: 'Yes! As long as the activity is in "Draft" state, you can modify any response and click "Save Draft". Answers are also automatically auto-saved every few seconds. Once you click "Complete & Submit Activity", your assignment is submitted for faculty review.'
    },
    {
      q: 'How are assignments graded?',
      a: 'Wadhwani Foundation venture coaches evaluate submissions based on evidence of customer validation, rigor of secondary research, clarity of unit economics, and feasibility of prototype execution.'
    },
    {
      q: 'What should I do if a required link is not loading for my evaluator?',
      a: 'Ensure link sharing permissions do not require sign-in to an internal organization domain. Test your link in an incognito browser window before final submission.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    setTicketSubmitted(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setTicketSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Support Center
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
          Help, Guidelines &amp; Academic Support
        </h1>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Frequently asked questions, assignment deliverable guidelines, and direct instructor ticketing.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <FileQuestion className="w-4 h-4 text-emerald-600" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed bg-gray-50/50 border-t border-gray-100">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Ticket */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-red-600" />
            <span>Submit a Support Request to Faculty</span>
          </h2>
          <p className="text-xs text-gray-500">Need clarification on an assignment prompt or deadline?</p>
        </div>

        {ticketSubmitted && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your request has been dispatched to your venture coach. Expect a response within 24 hours.</span>
          </div>
        )}

        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              placeholder="e.g. Clarification regarding Customer Journey Map format..."
              className="w-full px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Message Details</label>
            <textarea
              rows={4}
              required
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your question or issue in detail..."
              className="w-full p-3.5 text-xs bg-white border border-gray-300 rounded-lg input-green-focus focus:outline-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="btn-primary-red px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Support Ticket</span>
          </button>
        </form>
      </div>
    </div>
  );
};
