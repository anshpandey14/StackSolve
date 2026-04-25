import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import slugify from "@/utils/slugify";
import { Particles } from "../components/ui/particles";
import { Input } from "../components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import type { User } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/v1/users?search=${searchQuery}`);
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.error || "Failed to load users");
        }
      } catch {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen container mx-auto px-4 pb-20 pt-36">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={60}
        color="#ffffff"
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-neutral-50 to-neutral-500 mb-2">
            Top Members
          </h1>
          <p className="text-neutral-500">
            Showcasing the top 10 most reputable contributors
          </p>
        </div>
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input 
            placeholder="Search users..." 
            className="pl-10 bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-center py-20 text-neutral-400">No users yet.</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/users/${user._id}/${slugify(user.name)}`}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-linear-to-tr from-orange-500 to-yellow-500 flex items-center justify-center text-xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-orange-400">
                  {user.reputation} reputation
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
