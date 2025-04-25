"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

interface GitHubUser {
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState(username);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedUsername(username), 600);
    return () => clearTimeout(handler);
  }, [username]);

  useEffect(() => {
    if (!debouncedUsername) return;

    const fetchUser = async () => {
      setLoading(true);
      setError("");
      setUserData(null);
      try {
        const res = await axios.get(`https://api.github.com/users/${debouncedUsername}`);
        setUserData(res.data);
      } catch {
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [debouncedUsername]);

  return (
    <div className="min-h-screen bg-blue-600 text-white p-6 flex flex-col items-center justify-start">
      <h1 className="text-3xl font-bold mb-6">GitHub User Search</h1>

      <div className="relative w-full max-w-sm mb-6">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch />
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="pl-10 pr-4 py-2 rounded border border-gray-400 w-full text-black"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-300 font-semibold">{error}</p>}

      {userData && (
        <div className="bg-white text-black shadow-lg rounded-lg p-6 max-w-md w-full text-center">
          <Image
            src={userData.avatar_url}
            alt={userData.name}
            width={100}
            height={100}
            className="rounded-full mx-auto"
          />
          <h2 className="text-xl font-bold mt-4">{userData.name}</h2>
          <p className="text-gray-600">{userData.bio}</p>
          <div className="mt-4">
            <p><strong>Repos:</strong> {userData.public_repos}</p>
            <p><strong>Followers:</strong> {userData.followers}</p>
            <a
              href={userData.html_url}
              target="_blank"
              className="text-blue-500 underline mt-2 inline-block"
            >
              View GitHub Profile
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
