import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const VoteButtons = ({
  type,
  id,
  initialVotes = 0,
  authorId,
  className,
}: {
  type: "question" | "answer";
  id: string;
  initialVotes?: number;
  authorId?: string;
  className?: string;
}) => {
  const [voteStatus, setVoteStatus] = useState<"upvoted" | "downvoted" | null>(null);
  const [voteCount, setVoteCount] = useState<number>(initialVotes);
  const { user, jwt } = useAuthStore();
  const navigate = useNavigate();

  const handleVote = async (status: "upvoted" | "downvoted") => {
    if (!user) return navigate("/login");

    if (user._id === authorId) {
      alert("You cannot vote on your own post");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          type,
          typeId: id,
          voteStatus: status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Optimistic update for vote count
        if (voteStatus === status) {
          // Undo vote
          setVoteStatus(null);
          setVoteCount(prev => status === "upvoted" ? prev - 1 : prev + 1);
        } else {
          const delta = status === "upvoted" ? 1 : -1;
          const undoPrev = voteStatus === "upvoted" ? -1 : voteStatus === "downvoted" ? 1 : 0;
          setVoteCount(prev => prev + delta + undoPrev);
          setVoteStatus(status);
        }
      } else {
        alert(data.error || "Failed to vote");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-y-2", className)}>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
          voteStatus === "upvoted"
            ? "border-orange-500 bg-orange-500/10 text-orange-500"
            : "border-white/20 hover:bg-white/10"
        )}
        onClick={() => handleVote("upvoted")}
      >
        <IconCaretUpFilled size={24} />
      </button>
      <span className="font-bold text-lg">{voteCount}</span>
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
          voteStatus === "downvoted"
            ? "border-orange-500 bg-orange-500/10 text-orange-500"
            : "border-white/20 hover:bg-white/10"
        )}
        onClick={() => handleVote("downvoted")}
      >
        <IconCaretDownFilled size={24} />
      </button>
    </div>
  );
};

export default VoteButtons;




