import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import type { Comment } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

const Comments = ({
  comments: _comments,
  type,
  typeId,
  className,
}: {
  comments: Comment[];
  type: "question" | "answer";
  typeId: string;
  className?: string;
}) => {
  const [comments, setComments] = useState<Comment[]>(_comments);
  const [newComment, setNewComment] = useState("");
  const { user, jwt } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.length < 5) {
      alert("Comment must be at least 5 characters long");
      return;
    }
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          content: newComment,
          type,
          typeId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setNewComment("");
        setComments(prev => [data.data, ...prev]);
      }
    } catch (error: any) {
      alert("Error creating comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if(!window.confirm("Delete comment?")) return;
    try {
      await fetch(`${API_URL}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error: any) {
      alert("Error deleting comment");
    }
  };

  return (
    <div className={cn("mt-6 space-y-4", className)}>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="text-sm pb-3 border-b border-white/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-neutral-300 wrap-break-word">{comment.content}</span>
              <span className="mx-2 opacity-20">|</span>
              <Link to={`/users/${comment.author._id}/${slugify(comment.author.name)}`}
                className="text-orange-500 hover:underline font-medium inline-block"
              >
                {comment.author.name}
              </Link>{" "}
              <span className="text-neutral-500 ml-2 inline-block">
                {convertDateToRelativeTime(new Date(comment.createdAt))}
              </span>
            </div>
            {user?._id === comment.author._id && (
              <button
                onClick={() => deleteComment(comment._id)}
                className="text-neutral-600 hover:text-red-500 transition-colors shrink-0 mt-1"
              >
                <IconTrash size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-orange-500/50 transition-colors"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button 
            disabled={isSubmitting}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "..." : "Add"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Comments;




