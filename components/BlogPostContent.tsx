import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";

export default function BlogPostContent() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Content Body */}
      <div className="prose prose-lg prose-slate max-w-none text-slate-600 mb-12">
        <p>
          Look, I love Evidence-Based Medicine (EBM) as much as the next nerd. I
          memorize the p-values, I quote the Cochrane reviews at dinner parties
          (which explains why I don't get invited back), and I scoff at anything
          purely anecdotal. I wear the "Trust Science" badge with pride.
        </p>
        <p>
          But let's be real for a second. We operate in the grey zone more often
          than we'd like to admit. The patient has Stage 4 renal failure, is 94
          years old, and the specific guidelines for their condition excluded
          anyone over 65 with a creatinine clearance under 30.
        </p>

        <h2>The Art of the "Vibe Check"</h2>

        <p>
          So what do we do? We use "Clinical Judgement." It sounds prestigious.
          It sounds like something you learn in a hallowed hall from a professor
          with elbow patches.
        </p>

        <blockquote>
          "Clinical judgement is often just a polite way of saying 'I have a gut
          feeling based on that one patient I saw in 2019 who didn't die when we
          tried this'."
        </blockquote>

        <p>
          It's time we admit that pharmacokinetics is more art than science when
          the Creatinine Clearance is oscillating like a techno beat at 3 AM. We
          are making educated guesses. And that's okay. It's significantly
          better than uneducated guesses.
        </p>

        <p>
          The next time a resident asks you for the "definitive" dose for a
          patient who is basically a biological anomaly, look them in the eye
          and say: "Let's start low and pray." That is clinical judgement.
        </p>
      </div>

      {/* Engagement / Actions */}
      <div className="flex items-center justify-between border-t border-b border-slate-200 py-6 mb-12">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors group">
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-red-50 transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <span className="font-medium">142 Likes</span>
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-medical-600 transition-colors group">
            <div className="p-2 rounded-full bg-slate-50 group-hover:bg-medical-50 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="font-medium">24 Comments</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            className="p-2 text-slate-400 hover:text-medical-600 bg-slate-50 rounded-lg hover:bg-medical-50 transition-colors"
            title="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-medical-600 bg-slate-50 rounded-lg hover:bg-medical-50 transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
