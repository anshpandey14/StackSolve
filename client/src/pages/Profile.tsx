import { useEffect, useState } from "react";
import { MagicCard, MagicContainer } from "../components/ui/magic-card";
import { NumberTicker } from "../components/ui/number-ticker";
import { Particles } from "../components/ui/particles";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import type { User } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const { userId } = useParams();
  const { jwt } = useAuthStore();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId || userId === "undefined") {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/${userId}`, {
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
        });
        const data = await res.json();
        if (data.success) {
          setUserData(data.data);
        } else {
          setError(data.error || "User not found");
        }
      } catch {
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId, jwt]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (error || !userData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">{error || "User not found"}</h1>
      </div>
    );

  return (
    <div className="container mx-auto px-6 pt-36 pb-20">
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
        color="#ffffff"
      />

      {/* Avatar & name */}
      <div className="flex flex-col items-center mb-16">
        {userData.avatar ? (
          <img 
            src={userData.avatar} 
            alt={userData.name} 
            className="w-24 h-24 rounded-3xl object-cover mb-4 shadow-xl"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-orange-500 to-yellow-500 flex items-center justify-center text-4xl text-white font-bold mb-4 shadow-xl">
            {userData.name.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="text-4xl font-bold">{userData.name}</h1>
        <p className="text-neutral-500">{userData.email}</p>
      </div>

      {/* Stats cards */}
      <MagicContainer className="flex h-auto w-full flex-col gap-8 lg:flex-row">
        <MagicCard className="flex-1 flex flex-col items-center justify-center p-12 bg-black/50 border-white/10">
          <h2 className="text-xl font-medium text-neutral-400 mb-2">
            Reputation
          </h2>
          <p className="text-5xl font-bold text-orange-500">
            <NumberTicker value={userData.reputation} />
          </p>
        </MagicCard>

        <MagicCard className="flex-1 flex flex-col items-center justify-center p-12 bg-black/50 border-white/10">
          <h2 className="text-xl font-medium text-neutral-400 mb-2">
            Member Since
          </h2>
          <p className="text-2xl font-bold text-blue-400">
            {new Date(userData.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </MagicCard>
      </MagicContainer>

      {/* About & Activity */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">About</h3>
          <p className="text-neutral-400">
            {userData.bio || "No bio provided."}
          </p>
        </div>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4">Activity</h3>
          <p className="text-neutral-500">
            Member since {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
