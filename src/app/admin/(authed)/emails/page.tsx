import { redirect } from "next/navigation";

export default function EmailsIndexPage() {
  redirect("/admin/emails/templates");
}
