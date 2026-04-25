import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import QuestionForm from "../components/QuestionForm";
import { Particles } from "../components/ui/particles";
import type { Question } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export default function AskQuestion() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { quesId } = useParams();
  const isEditing = !!quesId;

  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [loading, setLoading] = useState(isEditing);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch existing question if editing
  useEffect(() => {
    if (!isEditing) return;
    async function fetchQuestion() {
      try {
        const res = await fetch(`${API_URL}/api/questions/${quesId}`);
        const data = await res.json();
        if (data.success) setQuestion(data.data);
      } catch (err) {
        console.error("Failed to fetch question", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestion();
  }, [quesId, isEditing]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen container mx-auto px-4 pb-20 pt-36 max-w-3xl">
      <Particles
        className="fixed inset-0 -z-10"
        quantity={80}
        color="#ffffff"
      />

      <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-neutral-50 to-neutral-400">
        {isEditing ? "Edit Question" : "Ask a Question"}
      </h1>
      <p className="text-neutral-500 mb-10">
        {isEditing
          ? "Update your question below."
          : "Write a good question and get great answers from the community."}
      </p>

      <QuestionForm question={question} />
    </div>
  );
}
