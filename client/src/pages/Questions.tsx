import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShimmerButton } from "../components/ui/shimmer-button";
import QuestionCard from "../components/QuestionCard";
import Pagination from "../components/Pagination";
import { Particles } from "../components/ui/particles";
import { Input } from "../components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import type { Question } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const Questions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tagFromUrl = searchParams.get("tag") || "";
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tag, setTag] = useState(tagFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    if (tagFromUrl !== tag) {
      setTag(tagFromUrl);
    }
  }, [tagFromUrl]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch(`${API_URL}/api/v1/questions/tags`);
        const data = await res.json();
        if (data.success) setAllTags(data.data);
      } catch (err) {
        console.error("Failed to fetch tags", err);
      }
    }
    fetchTags();
  }, []);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/v1/questions?`;
        if (tag) url += `tag=${tag}&`;
        if (searchQuery) url += `search=${searchQuery}&`;
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setQuestions(data.data);
        } else {
          setError(data.error);
        }
      } catch {
        setError("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [tag, searchQuery]);

  const filteredSidebarTags = allTags.filter(t => 
    t.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  const paginated = questions.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="relative min-h-screen container mx-auto px-4 pb-20 pt-36">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        color="#ffffff"
      />

      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-neutral-50 to-neutral-500 mb-2">
            All Questions
          </h1>
          <div className="flex items-center gap-4 mt-4 max-w-xl">
             <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input 
                  placeholder="Search questions by title or content..." 
                  className="pl-10 h-10 bg-white/5 border-white/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>
        <Link to="/questions/ask">
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
              Ask a Question
            </span>
          </ShimmerButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl">
              {error}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10">
              <p className="text-neutral-400 mb-4">
                No questions found. Try a different search or tag.
              </p>
              <Link to="/questions/ask">
                <ShimmerButton>
                  <span className="text-sm font-medium text-white">
                    Ask a Question
                  </span>
                </ShimmerButton>
              </Link>
            </div>
          ) : (
            paginated.map((ques) => <QuestionCard key={ques._id} ques={ques} />)
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block space-y-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Filter by Tag</h3>
            
            <div className="relative mb-4">
              <IconSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500" />
              <Input 
                placeholder="Find a tag..." 
                className="pl-7 h-8 text-xs bg-white/5 border-white/10"
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {filteredSidebarTags.length > 0 ? (
                filteredSidebarTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      const newTag = tag === t ? "" : t;
                      setSearchParams(newTag ? { tag: newTag } : {});
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      tag === t
                        ? "bg-orange-500 text-white"
                        : "bg-white/10 hover:bg-white/20 text-neutral-400"
                    }`}
                  >
                    #{t}
                  </button>
                ))
              ) : (
                <p className="text-xs text-neutral-500">No tags match</p>
              )}
            </div>
            {tag && (
              <button
                onClick={() => {
                  setSearchParams({});
                  setPage(1);
                }}
                className="mt-3 text-sm text-orange-400 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          <div className="p-6 bg-linear-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-2xl">
            <h3 className="text-xl font-bold mb-2">Build Together</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Support fellow developers and grow your reputation.
            </p>
            <Link
              to="/users"
              className="text-orange-500 font-bold text-sm hover:underline"
            >
              View Contributors →
            </Link>
          </div>
        </div>
      </div>

      {questions.length > LIMIT && (
        <div className="mt-10">
          <Pagination
            total={questions.length}
            limit={LIMIT}
            page={page}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Questions;
