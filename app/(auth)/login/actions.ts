"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Sign up the user
  const { error: signUpError } = await supabase.auth.signUp(data);

  if (signUpError) {
    redirect("/error");
  }

  // Since email verification is disabled, we can immediately sign in
  const { error: signInError } = await supabase.auth.signInWithPassword(data);

  if (signInError) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
