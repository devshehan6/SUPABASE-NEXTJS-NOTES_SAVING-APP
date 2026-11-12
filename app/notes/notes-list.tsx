import { DeleteNoteButton } from "./delete-note-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function NotesList() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    redirect("/auth/login");
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return <p className="text-red-600 bg-red-50 p-3 rounded">Error: {error.message}</p>;
  }

  if (!notes || notes.length === 0) {
    return <p className="text-gray-500 text-center py-10">තවම notes නෑ. උඩ "+ Add Note" click කරලා එකක් දාන්න!</p>;
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id} className="border rounded-lg p-4 hover:shadow transition">
        <h2 className="font-semibold text-lg">{note.title}</h2>
        <p className="text-gray-600 text-sm mt-1">{note.content}</p>
        <div className="flex items-center gap-3 mt-2">
            <Link
            href={`/notes/${note.id}/edit`}
            className="text-blue-600 text-sm hover:underline"
            >
            Edit
            </Link>
            <DeleteNoteButton id={note.id} />
        </div>
        </li>
      ))}
    </ul>
  );
}