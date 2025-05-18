import { redirect } from "next/navigation";

export default function Home() {
  // This is a server component; we can't use hooks. We'll just immediately redirect to a placeholder
  redirect("/chat");
}