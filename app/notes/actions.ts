"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNote(formData: FormData) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    redirect("/auth/login");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") {
    return { error: "Title එක අවශ්‍යයි" };
  }

  const { error } = await supabase.from("notes").insert({
    title: title.trim(),
    content: content?.trim() || "",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(formData: FormData) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    redirect("/auth/login");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim() === "") {
    return { error: "Title එක අවශ්‍යයි" };
  }

  const { error } = await supabase
    .from("notes")
    .update({
      title: title.trim(),
      content: content?.trim() || "",
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function deleteNote(formData: FormData) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) {
    redirect("/auth/login");
  }

  const id = formData.get("id") as string;

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  redirect("/notes");
}