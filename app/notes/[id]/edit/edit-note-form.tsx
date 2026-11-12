import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { updateNote } from "../../actions";

export async function EditNoteForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    redirect("/auth/login");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !note) {
    notFound();
  }

  return (
    <form action={updateNote} className="space-y-4">
      <input type="hidden" name="id" value={id} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={note.title}
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
          defaultValue={note.content ?? ""}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
      >
        Update Note
      </button>
    </form>
  );
}