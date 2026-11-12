import { Suspense } from "react";
import Link from "next/link";
import { NewNoteForm } from "./new-note-form";

export default function NewNotePage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Note</h1>
        <Link href="/notes" className="text-gray-600 hover:underline">
          ← Back
        </Link>
      </div>

      <Suspense fallback={<p className="text-gray-400">Load වෙනවා...</p>}>
        <NewNoteForm />
      </Suspense>
    </div>
  );
}