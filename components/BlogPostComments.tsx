import { ThumbsUp } from "lucide-react";

export default function BlogPostComments() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        Discussion{" "}
        <span className="text-sm font-normal text-slate-400">
          (Civilized arguing only)
        </span>
      </h3>

      {/* Input Area */}
      <div className="flex gap-4 mb-10">
        <div className="w-10 h-10 rounded-full bg-medical-100 flex items-center justify-center text-medical-600 font-bold flex-shrink-0">
          Me
        </div>
        <div className="flex-grow">
          <textarea
            rows={3}
            placeholder="Add your sarcastic remark..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-100 outline-none transition-all resize-none text-sm"
          ></textarea>
          <div className="flex justify-end mt-2">
            <button className="px-4 py-2 bg-medical-600 text-white rounded-lg text-sm font-medium hover:bg-medical-700 transition-colors shadow-md shadow-medical-600/20">
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comment Stream */}
      <div className="space-y-8">
        {/* Comment 1 */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0 mt-1">
            JD
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-slate-900 text-sm">
                John Doe, PharmD
              </p>
              <span className="text-xs text-slate-400">2h ago</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-2">
              I feel attacked. But also, you&apos;re absolutely right. Vancomycin
              dosing in the ICU is basically just witchcraft with a calculator.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <button className="hover:text-medical-600 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> 12
              </button>
              <button className="hover:text-medical-600">Reply</button>
            </div>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold flex-shrink-0 mt-1">
            AS
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-1">
              <p className="font-bold text-slate-900 text-sm">Amy S.</p>
              <span className="text-xs text-slate-400">5h ago</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-2">
              Guidelines are suggestions. The patient is the reality. If we
              followed every guideline perfectly, we&apos;d never get anything done.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
              <button className="hover:text-medical-600 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> 8
              </button>
              <button className="hover:text-medical-600">Reply</button>
            </div>

            {/* Nested Reply */}
            <div className="mt-4 flex gap-4 border-l-2 border-slate-100 pl-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs flex-shrink-0 mt-1">
                MJ
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-900 text-xs">Mike J.</p>
                  <span className="text-xs text-slate-400">1h ago</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Bold of you to assume I read the guidelines. I just read the
                  summary box on UpToDate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
