import type { Metadata } from "next";
import MyListView from "@/components/MyListView";
import PersonalRecommendations from "@/components/PersonalRecommendations";

export const metadata: Metadata = { title: "My List" };

export default function MyListPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase">Saved on this device</p>
        <h1 className="mt-1 mb-8 text-4xl font-light">My List</h1>
        <MyListView />
      </div>
      <PersonalRecommendations />
    </>
  );
}
