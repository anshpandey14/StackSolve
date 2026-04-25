import React, { useState } from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/auth";
import RTE, { MarkdownPreview } from "./RTE";
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import { Link } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";
import type { Answer } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const Answers = ({
  answers: _answers,
  questionId,
}: {
  answers: Answer[];
  questionId: string;
}) => {
  const [answers, setAnswers] = useState<Answer[]>(_answers);
  const [newAnswer, setNewAnswer] = useState("");
  const { user, jwt } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newAnswer.length < 20) {
      alert("Answer must be at least 20 characters long");
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/questions/${questionId}/answers`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content: newAnswer,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewAnswer("");
        setAnswers(prev => [data.data, ...prev]);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      alert(error.message || "Error creating answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`${API_URL}/answers/${answerId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
      });

      if (response.ok) {
        setAnswers(prev => prev.filter(a => a._id !== answerId));
      }
    } catch (error: any) {
      alert("Error deleting answer");
    }
  };

  return (
    <div className="mt-12">
      <h2 className="mb-8 text-2xl font-bold">{answers.length} Answers</h2>
      <div className="space-y-12">
        {answers.map((answer) => (
            <div key={answer._id} className="flex gap-6 pb-12 border-b border-white/5 last:border-0">
                <div className="flex shrink-0 flex-col items-center gap-4">
                    <VoteButtons
                    type="answer"
                    id={answer._id}
                    initialVotes={answer.votes}
                    authorId={answer.author._id}
                    />
                    {user?._id === answer.author._id && (
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/20 p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                        onClick={() => deleteAnswer(answer._id)}
                    >
                        <IconTrash size={20} />
                    </button>
                    )}
                </div>
                <div className="w-full flex-1 min-w-0">
                    <div className="bg-white/5 rounded-2xl p-6 mb-6 overflow-hidden wrap-break-word">
                        <MarkdownPreview source={answer.content} />
                    </div>
                    
                    <div className="flex items-center justify-end gap-3 mb-8">
                        <div className="flex flex-col items-end">
                            <Link to={`/users/${answer.author._id}/${slugify(answer.author.name)}`}
                                className="text-orange-500 font-bold hover:underline"
                            >
                                {answer.author.name}
                            </Link>
                            <span className="text-sm font-bold text-neutral-500">{answer.author.reputation} rep</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-orange-500/20 to-yellow-500/20 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20 shrink-0">
                            {answer.author.name.charAt(0)}
                        </div>
                    </div>
                    
                    <Comments
                        comments={[]} // Logic for comments to be added
                        type="answer"
                        typeId={answer._id}
                    />
                </div>
            </div>
        ))}
      </div>

      {user ? (
        <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h2 className="mb-6 text-2xl font-bold">Your Answer</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
              <RTE
              value={newAnswer}
              onChange={(value) => setNewAnswer(value || "")}
              />
              <button 
                disabled={isSubmitting}
                className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                  {isSubmitting ? "Posting..." : "Post Your Answer"}
              </button>
          </form>
        </div>
      ) : (
        <div className="mt-12 p-12 text-center bg-linear-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-3xl">
          <h2 className="text-2xl font-bold mb-4">Want to help?</h2>
          <p className="text-neutral-400 mb-8 max-w-md mx-auto">
            You must be logged in to post an answer. Join the community to start contributing!
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-all">
              Log In
            </Link>
            <Link to="/register" className="px-8 py-3 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Answers;




