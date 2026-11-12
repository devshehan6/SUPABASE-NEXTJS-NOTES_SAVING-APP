import { Suspense } from "react";
import Link from "next/link";
import { NotesList } from "./notes-list";

export default function NotesPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Link
          href="/notes/new"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          + Add Note
        </Link>
      </div>

      <Suspense fallback={<p className="text-gray-400">Notes load වෙනවා...</p>}>
        <NotesList />
      </Suspense>
    </div>
  );
}