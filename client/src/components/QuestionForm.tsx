import RTE from "@/components/RTE";
import { Meteors } from "@/components/ui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import confetti from "canvas-confetti";
import type { Question } from "@/types";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
        className,
      )}
    >
      <Meteors number={30} />
      {children}
    </div>
  );
};

const API_URL = import.meta.env.VITE_API_URL;

const QuestionForm = ({ question }: { question?: Question }) => {
  const { jwt } = useAuthStore();
  const [tag, setTag] = React.useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    tags: new Set((question?.tags || []) as string[]),
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.title.length < 15) {
      setError("Title must be at least 15 characters long");
      return;
    }

    if (formData.content.length < 30) {
      setError("Body must be at least 30 characters long to explain your problem clearly");
      return;
    }

    if (formData.tags.size === 0) {
      setError("Please add at least one tag to categorize your question");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = question
        ? `${API_URL}/api/v1/questions/${question._id}`
        : `${API_URL}/api/v1/questions`;
      const method = question ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: Array.from(formData.tags),
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (!question) loadConfetti();
        navigate(`/questions/${data.data._id}/${slugify(formData.title)}`);
      } else {
        throw new Error(data.error || "Internal Server Error");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-center">
          {error}
        </div>
      )}

      <LabelInputContainer>
        <Label htmlFor="title" className="text-xl font-bold">
          Title
          <br />
          <small className="text-neutral-500 font-normal">
            Be specific and imagine you&apos;re asking a question to another
            person.
          </small>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. How to use Mongoose virtuals in Next.js?"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="content" className="text-xl font-bold">
          Body
          <br />
          <small className="text-neutral-500 font-normal">
            Include all the information someone would need to answer your
            question.
          </small>
        </Label>
        <RTE
          value={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value || "" }))
          }
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag" className="text-xl font-bold">
          Tags
          <br />
          <small className="text-neutral-500 font-normal">
            Add up to 5 tags to describe what your question is about.
          </small>
        </Label>
        <div className="flex w-full gap-4">
          <Input
            id="tag"
            name="tag"
            placeholder="e.g. javascript, react, mongodb"
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (tag.trim()) {
                  setFormData((prev) => ({
                    ...prev,
                    tags: new Set([...Array.from(prev.tags), tag.trim()]),
                  }));
                  setTag("");
                }
              }
            }}
          />
          <button
            className="px-8 py-2 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors"
            type="button"
            onClick={() => {
              if (tag.trim()) {
                setFormData((prev) => ({
                  ...prev,
                  tags: new Set([...Array.from(prev.tags), tag.trim()]),
                }));
                setTag("");
              }
            }}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {Array.from(formData.tags).map((t, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full border border-white/10"
            >
              <span className="text-sm font-medium">{t}</span>
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: new Set(
                      Array.from(prev.tags).filter((item) => item !== t),
                    ),
                  }))
                }
                type="button"
                className="hover:text-red-500 transition-colors"
              >
                <IconX size={14} />
              </button>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      <button
        className="w-full py-4 bg-linear-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : question
            ? "Update Question"
            : "Publish Question"}
      </button>
    </form>
  );
};

export default QuestionForm;
