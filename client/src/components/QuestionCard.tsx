import React from "react";
import { BorderBeam } from "./ui/border-beam";
import { Link } from "react-router-dom";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import type { Question } from "@/types";

const QuestionCard = ({ ques }: { ques: Question }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/20 bg-white/5 p-4 duration-200 hover:bg-white/10 sm:flex-row"
    >
      <BorderBeam size={height} duration={12} delay={9} />
      <div className="relative shrink-0 text-sm sm:text-right min-w-25">
        <p className="font-semibold text-neutral-300">{ques.votes} votes</p>
        <p className="text-neutral-500">{ques.answersCount} answers</p>
      </div>
      <div className="relative w-full">
        <Link to={`/questions/${ques._id}/${slugify(ques.title)}`}
          className="text-orange-500 duration-200 hover:text-orange-600 transition-colors"
        >
          <h2 className="text-xl font-bold mb-2">{ques.title}</h2>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {ques.tags.map((tag: string) => (
            <Link key={tag}
              to={`/questions?tag=${tag}`}
              className="inline-block rounded-lg bg-orange-500/10 text-orange-400 px-3 py-1 duration-200 hover:bg-orange-500/20"
            >
              #{tag}
            </Link>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-linear-to-tr from-orange-500 to-yellow-500 flex items-center justify-center text-[10px] text-white font-bold">
                {ques.author.name.charAt(0)}
            </div>
            <Link to={`/users/${ques.author._id}/${slugify(ques.author.name)}`}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              {ques.author.name}
            </Link>
            <span className="text-neutral-500 font-bold">({ques.author.reputation})</span>
          </div>
          <span className="text-neutral-500">
            asked {convertDateToRelativeTime(new Date(ques.createdAt))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;





