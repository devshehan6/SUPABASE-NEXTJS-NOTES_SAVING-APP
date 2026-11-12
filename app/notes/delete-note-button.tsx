"use client";

import { deleteNote } from "./actions";

export function DeleteNoteButton({ id }: { id: string }) {
  return (
    <form
      action={deleteNote}
      onSubmit={(e) => {
        if (!confirm("මේ note එක delete කරන්නද? ආයේ ගන්න බෑ.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-red-600 text-sm hover:underline"
      >
        Delete
      </button>
    </form>
  );
}