import { Link } from "react-router-dom";
import { ShimmerButton } from "../components/ui/shimmer-button";
import { MagicCard } from "../components/ui/magic-card";
import { Particles } from "../components/ui/particles";
import { useAuthStore } from "../store/auth";
import { IconMessage, IconCode, IconUsers } from "@tabler/icons-react";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
        staticity={50}
        color="#ffffff"
      />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-24">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 mb-6">
          Stack<span className="text-orange-500">Solve</span>
        </h1>
        <p className="max-w-2xl text-neutral-400 text-lg mb-10">
          Ask questions, find answers, and collaborate with developers
          worldwide. The premium destination for solving code.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/questions">
            <ShimmerButton className="shadow-2xl">
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tighter text-white lg:text-lg">
                Browse Questions
              </span>
            </ShimmerButton>
          </Link>
          {!user && (
            <Link
              to="/register"
              className="px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors font-medium"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-linear-to-r from-neutral-50 to-neutral-400">
          Everything you need to solve code
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MagicCard className="p-10 flex flex-col items-start bg-black/50 border-neutral-800">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
              <IconMessage className="text-orange-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Interactive Q&A</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Get detailed answers to your toughest coding problems from a community of expert developers.
            </p>
          </MagicCard>

          <MagicCard className="p-10 flex flex-col items-start bg-black/50 border-neutral-800">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <IconCode className="text-blue-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Rich Text Editor</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Write clean, formatted code with our full Markdown support and live preview system.
            </p>
          </MagicCard>

          <MagicCard className="p-10 flex flex-col items-start bg-black/50 border-neutral-800">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
              <IconUsers className="text-green-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Community Driven</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Build your reputation, earn badges, and contribute to the collective knowledge of the web.
            </p>
          </MagicCard>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="p-12 bg-white/5 border border-white/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-neutral-400 mb-8">
            Join the community and start asking or answering questions today.
          </p>
          <Link to="/questions">
            <ShimmerButton>
              <span className="text-sm font-medium text-white lg:text-lg">
                Explore Questions →
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
