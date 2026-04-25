import Answers from "../components/Answers";
import Comments from "../components/Comments";
import { MarkdownPreview } from "../components/RTE";
import VoteButtons from "../components/VoteButtons";
import { Particles } from "../components/ui/particles";
import { ShimmerButton } from "../components/ui/shimmer-button";
import convertDateToRelativeTime from "../utils/relativeTime";
import slugify from "../utils/slugify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import type { Question, Answer, Comment } from "../types";
import { IconPencil, IconTrash } from "@tabler/icons-react";

const API_URL = import.meta.env.VITE_API_URL;

const QuestionDetail = () => {
  const { quesId } = useParams();
  const { user, jwt } = useAuthStore();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        // Fetch question with answers
        const res = await fetch(`${API_URL}/api/questions/${quesId}`);
        const data = await res.json();
        if (data.success) {
          setQuestion(data.data);
          setAnswers(data.data.answers || []);
        }

        // Fetch comments for the question
        const cRes = await fetch(
          `${API_URL}/api/comments?type=question&typeId=${quesId}`,
        );
        const cData = await cRes.json();
        if (cData.success) setComments(cData.data);
      } catch (err) {
        console.error("Failed to fetch question", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [quesId]);

  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(`${API_URL}/api/questions/${quesId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        navigate("/questions");
      } else {
        alert(data.error || "Failed to delete question");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("An error occurred while deleting the question");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!question)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Question not found</h1>
        <p className="text-neutral-500 mb-8">
          This question might have been deleted or moved.
        </p>
        <Link to="/questions">
          <ShimmerButton>
            <span className="text-sm font-medium text-white">
              Back to Questions
            </span>
          </ShimmerButton>
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-6 pb-20 pt-36">
      <Particles
        className="fixed inset-0 -z-10"
        quantity={80}
        color="#ffffff"
      />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-neutral-50 to-neutral-500">
              {question.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
              <p>
                Asked{" "}
                <span className="text-neutral-300">
                  {convertDateToRelativeTime(new Date(question.createdAt))}
                </span>
              </p>
              <p>
                Answers{" "}
                <span className="text-neutral-300">
                  {question.answersCount}
                </span>
              </p>
              <p>
                Votes <span className="text-neutral-300">{question.votes}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            {user?._id === question.author._id && (
              <div className="flex gap-2">
                <Link
                  to={`/questions/${question._id}/${slugify(question.title)}/edit`}
                >
                  <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-full hover:bg-white/10 transition-colors text-sm font-medium">
                    <IconPencil size={16} /> Edit
                  </button>
                </Link>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 rounded-full hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                  <IconTrash size={16} /> Delete
                </button>
              </div>
            )}
            <Link to="/questions/ask">
              <ShimmerButton className="shadow-2xl">
                <span className="text-sm font-medium text-white lg:text-lg">
                  Ask Question
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Vote column */}
          <div className="lg:col-span-1 border-r border-white/5 pr-4">
            <VoteButtons
              type="question"
              id={question._id}
              initialVotes={question.votes}
              authorId={question.author._id}
              className="w-full"
            />
          </div>

          {/* Content column */}
          <div className="lg:col-span-11 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <MarkdownPreview source={question.content} />

              <div className="mt-8 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/questions?tag=${tag}`}
                    className="px-4 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-sm hover:bg-orange-500/20 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Author card */}
              <div className="mt-12 flex justify-end">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 min-w-50">
                  <p className="text-xs text-neutral-500 mb-2">
                    asked{" "}
                    {convertDateToRelativeTime(new Date(question.createdAt))}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
                      {question.author.name.charAt(0)}
                    </div>
                    <div>
                      <Link
                        to={`/users/${question.author._id}/${slugify(question.author.name)}`}
                        className="text-orange-500 font-bold hover:underline"
                      >
                        {question.author.name}
                      </Link>
                      <p className="text-xs text-neutral-400 font-bold">
                        {question.author.reputation} reputation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question comments */}
              <Comments
                comments={comments}
                type="question"
                typeId={question._id}
                className="mt-8"
              />
            </div>

            {/* Answers */}
            <Answers answers={answers} questionId={question._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
