import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { createNote } from "../actions";

export async function NewNoteForm() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    redirect("/auth/login");
  }

  return (
    <form action={createNote} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Note එකේ මාතෘකාව..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={5}
          placeholder="Note එකේ අන්තර්ගතය..."
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
      >
        Save Note
      </button>
    </form>
  );
}