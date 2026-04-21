import { Topbar } from "@/components/admin/Topbar";
import { CalendarClient } from "./CalendarClient";
import { getCalendarEvents } from "./queries";

export const dynamic = "force-dynamic";

interface SearchParams {
  date?: string;
  view?: "month" | "week" | "day";
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const view = sp.view || "month";
  const baseDate = sp.date ? new Date(sp.date) : new Date();

  // Compute range based on view (with padding for month grid)
  let from: Date;
  let to: Date;
  if (view === "month") {
    const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const last = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59);
    // Pad: include preceding/following weeks shown in grid
    from = new Date(first);
    from.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    to = new Date(last);
    to.setDate(last.getDate() + (6 - ((last.getDay() + 6) % 7)));
    to.setHours(23, 59, 59);
  } else if (view === "week") {
    const monday = new Date(baseDate);
    const day = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - day);
    monday.setHours(0, 0, 0, 0);
    from = monday;
    to = new Date(monday);
    to.setDate(monday.getDate() + 6);
    to.setHours(23, 59, 59);
  } else {
    from = new Date(baseDate); from.setHours(0, 0, 0, 0);
    to = new Date(baseDate); to.setHours(23, 59, 59);
  }

  const events = await getCalendarEvents(from, to);

  return (
    <>
      <Topbar title="Planning" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Planning" }]} />
      <CalendarClient events={events} initialDate={baseDate.toISOString()} initialView={view} />
    </>
  );
}
