import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "../components/ui/input";

const API_URL = import.meta.env.VITE_API_URL;

export default function Tags() {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/questions/tags`);
        const data = await response.json();
        if (data.success) {
          setTags(data.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredTags = tags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold text-white">Tags</h1>
        <p className="text-neutral-400 max-w-2xl">
          A tag is a keyword or label that categorizes your question with other,
          similar questions. Using the right tags makes it easier for others to
          find and answer your question.
        </p>
      </div>

      <div className="relative mb-8 max-w-md">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
        <Input
          placeholder="Filter by tag name"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => (
              <Link
                key={tag}
                to={`/questions?tag=${tag}`}
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <span className="inline-block px-2 py-1 rounded-md bg-orange-500/10 text-orange-500 text-sm font-medium mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {tag}
                </span>
                <p className="text-xs text-neutral-500">
                  Click to see all questions tagged with {tag}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-neutral-500 col-span-full text-center py-10">
              No tags found matching your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
