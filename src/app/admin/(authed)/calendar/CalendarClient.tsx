"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Wrench, Users, AlertCircle, X } from "lucide-react";
import type { CalendarEvent } from "./queries";

type ViewMode = "month" | "week" | "day";

interface Props {
  events: CalendarEvent[];
  initialDate: string;
  initialView: ViewMode;
}

const DAY_LABELS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const DAY_DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const WEEK_FORMATTER = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" });
const TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });

const TYPE_FILTERS = [
  { key: "all", label: "Tout" },
  { key: "visit", label: "Visites" },
  { key: "meeting", label: "Reunions" },
  { key: "deadline", label: "Echeances" },
] as const;

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getMonthGrid(d: Date): Date[][] {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);
  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + i);
      week.push(day);
    }
    weeks.push(week);
  }
  return weeks;
}

function colorForType(visitType?: string | null, type: string = "visit"): { bg: string; fg: string } {
  if (type === "meeting") return { bg: "rgba(59,130,180,0.15)", fg: "#3B82B4" };
  if (type === "deadline") return { bg: "rgba(225,16,33,0.12)", fg: "var(--color-primary)" };
  // Default: maintenance visit (copper)
  return { bg: "rgba(196,133,92,0.18)", fg: "var(--color-copper)" };
}

export function CalendarClient({ events, initialDate, initialView }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(new Date(initialDate));
  const [view, setView] = useState<ViewMode>(initialView);
  const [filter, setFilter] = useState<(typeof TYPE_FILTERS)[number]["key"]>("all");
  const [popupEvent, setPopupEvent] = useState<CalendarEvent | null>(null);

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of filteredEvents) {
      const d = startOfDay(new Date(e.start));
      const key = d.toISOString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [filteredEvents]);

  function navigate(delta: number) {
    const next = new Date(date);
    if (view === "month") next.setMonth(next.getMonth() + delta);
    else if (view === "week") next.setDate(next.getDate() + delta * 7);
    else next.setDate(next.getDate() + delta);
    setDate(next);
    router.push(`/admin/calendar?view=${view}&date=${next.toISOString()}`);
  }

  function goToday() {
    const today = new Date();
    setDate(today);
    router.push(`/admin/calendar?view=${view}&date=${today.toISOString()}`);
  }

  function changeView(v: ViewMode) {
    setView(v);
    router.push(`/admin/calendar?view=${v}&date=${date.toISOString()}`);
  }

  let label = "";
  if (view === "month") label = MONTH_FORMATTER.format(date);
  else if (view === "week") {
    const monday = new Date(date);
    const dayOfWeek = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - dayOfWeek);
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    label = `${WEEK_FORMATTER.format(monday)} → ${WEEK_FORMATTER.format(sunday)}`;
  } else {
    label = DAY_DATE_FORMATTER.format(date);
  }

  return (
    <div className="p-8 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-muted)]" style={{ border: "1px solid var(--border)", color: "var(--text)" }} aria-label="Precedent">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={goToday} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg-muted)]" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Aujourd&apos;hui
          </button>
          <button onClick={() => navigate(1)} className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-muted)]" style={{ border: "1px solid var(--border)", color: "var(--text)" }} aria-label="Suivant">
            <ChevronRight className="h-4 w-4" />
          </button>
          <h2 className="ml-2 font-display text-lg font-semibold capitalize" style={{ color: "var(--text)" }}>
            {label}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => changeView(v)}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{
                  background: view === v ? "var(--color-copper)" : "transparent",
                  color: view === v ? "white" : "var(--text-muted)",
                }}
              >
                {v === "month" ? "Mois" : v === "week" ? "Semaine" : "Jour"}
              </button>
            ))}
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-lg px-3 py-1.5 text-xs"
            style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
          >
            {TYPE_FILTERS.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>

          <Link
            href="/admin/maintenance/visits/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle visite
          </Link>
        </div>
      </div>

      {/* Calendar body */}
      {view === "month" && (
        <MonthView date={date} eventsByDay={eventsByDay} onSelect={setPopupEvent} />
      )}
      {view === "week" && (
        <WeekView date={date} eventsByDay={eventsByDay} onSelect={setPopupEvent} />
      )}
      {view === "day" && (
        <DayView date={date} events={filteredEvents.filter((e) => isSameDay(new Date(e.start), date))} onSelect={setPopupEvent} />
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
        <div className="flex items-center gap-2">
          <Wrench className="h-3 w-3" style={{ color: "var(--color-copper)" }} />
          <span>Visites maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3" style={{ color: "#3B82B4" }} />
          <span>Reunions</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-3 w-3" style={{ color: "var(--color-primary)" }} />
          <span>Echeances</span>
        </div>
      </div>

      {/* Event popup */}
      {popupEvent && (
        <EventPopup event={popupEvent} onClose={() => setPopupEvent(null)} />
      )}
    </div>
  );
}

function MonthView({ date, eventsByDay, onSelect }: { date: Date; eventsByDay: Map<string, CalendarEvent[]>; onSelect: (e: CalendarEvent) => void }) {
  const grid = getMonthGrid(date);
  const today = startOfDay(new Date());
  const currentMonth = date.getMonth();

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--border)" }}>
        {DAY_LABELS_SHORT.map((d) => (
          <div key={d} className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-center" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {grid.flat().map((day, idx) => {
          const key = startOfDay(day).toISOString();
          const dayEvents = eventsByDay.get(key) || [];
          const isToday = isSameDay(day, today);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const showCount = dayEvents.length;
          return (
            <div
              key={idx}
              className="min-h-[110px] p-2 flex flex-col"
              style={{
                borderRight: (idx + 1) % 7 !== 0 ? "1px solid var(--border)" : undefined,
                borderTop: idx >= 7 ? "1px solid var(--border)" : undefined,
                background: isToday ? "color-mix(in oklab, var(--color-copper) 6%, var(--card-bg))" : undefined,
                opacity: isCurrentMonth ? 1 : 0.4,
              }}
            >
              <div className="flex items-baseline justify-between mb-1">
                <span
                  className="text-xs font-mono"
                  style={{
                    color: isToday ? "var(--color-copper)" : "var(--text-muted)",
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {day.getDate()}
                </span>
                {showCount > 3 && (
                  <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                    +{showCount - 3}
                  </span>
                )}
              </div>
              <div className="space-y-1 flex-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((e) => {
                  const c = colorForType(e.visitType, e.type);
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelect(e)}
                      className="block w-full text-left text-[11px] rounded px-1.5 py-0.5 truncate transition-colors hover:opacity-80"
                      style={{ background: c.bg, color: c.fg }}
                      title={`${TIME_FORMATTER.format(new Date(e.start))} · ${e.title}`}
                    >
                      <span className="font-mono mr-1">{TIME_FORMATTER.format(new Date(e.start))}</span>
                      {e.title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ date, eventsByDay, onSelect }: { date: Date; eventsByDay: Map<string, CalendarEvent[]>; onSelect: (e: CalendarEvent) => void }) {
  const monday = new Date(date);
  const dayOfWeek = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - dayOfWeek);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  const today = startOfDay(new Date());
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7h to 18h

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="grid grid-cols-[60px_repeat(7,1fr)]" style={{ borderBottom: "1px solid var(--border)" }}>
        <div></div>
        {days.map((d) => {
          const isToday = isSameDay(d, today);
          return (
            <div key={d.toISOString()} className="px-2 py-2 text-center" style={{ background: isToday ? "color-mix(in oklab, var(--color-copper) 6%, var(--bg-muted))" : "var(--bg-muted)", color: isToday ? "var(--color-copper)" : "var(--text-muted)" }}>
              <div className="text-[10px] font-mono uppercase tracking-wider">{DAY_LABELS_SHORT[(d.getDay() + 6) % 7]}</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: isToday ? "var(--color-copper)" : "var(--text)" }}>{d.getDate()}</div>
            </div>
          );
        })}
      </div>
      {hours.map((h) => (
        <div key={h} className="grid grid-cols-[60px_repeat(7,1fr)]" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="px-2 py-2 text-[10px] font-mono text-right" style={{ color: "var(--text-muted)", borderRight: "1px solid var(--border)" }}>
            {String(h).padStart(2, "0")}:00
          </div>
          {days.map((d, i) => {
            const slotStart = new Date(d); slotStart.setHours(h, 0, 0, 0);
            const slotEnd = new Date(d); slotEnd.setHours(h + 1, 0, 0, 0);
            const dayKey = startOfDay(d).toISOString();
            const dayEvents = (eventsByDay.get(dayKey) || []).filter((e) => {
              const t = new Date(e.start);
              return t >= slotStart && t < slotEnd;
            });
            return (
              <div key={i} className="min-h-[44px] p-1 space-y-0.5" style={{ borderRight: i < 6 ? "1px solid var(--border)" : undefined }}>
                {dayEvents.map((e) => {
                  const c = colorForType(e.visitType, e.type);
                  return (
                    <button
                      key={e.id}
                      onClick={() => onSelect(e)}
                      className="block w-full text-left text-[10px] rounded px-1 py-0.5 truncate transition-colors hover:opacity-80"
                      style={{ background: c.bg, color: c.fg }}
                    >
                      {TIME_FORMATTER.format(new Date(e.start))} {e.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function DayView({ date, events, onSelect }: { date: Date; events: CalendarEvent[]; onSelect: (e: CalendarEvent) => void }) {
  const isToday = isSameDay(date, startOfDay(new Date()));
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7h to 20h
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
      <div className="px-4 py-3" style={{ background: isToday ? "color-mix(in oklab, var(--color-copper) 6%, var(--bg-muted))" : "var(--bg-muted)", borderBottom: "1px solid var(--border)" }}>
        <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          {events.length} evenement{events.length > 1 ? "s" : ""}
        </p>
      </div>
      {hours.map((h) => {
        const slotStart = new Date(date); slotStart.setHours(h, 0, 0, 0);
        const slotEnd = new Date(date); slotEnd.setHours(h + 1, 0, 0, 0);
        const slotEvents = events.filter((e) => {
          const t = new Date(e.start);
          return t >= slotStart && t < slotEnd;
        });
        return (
          <div key={h} className="grid grid-cols-[80px_1fr] min-h-[60px]" style={{ borderTop: "1px solid var(--border)" }}>
            <div className="px-3 py-2 text-xs font-mono text-right" style={{ color: "var(--text-muted)", borderRight: "1px solid var(--border)" }}>
              {String(h).padStart(2, "0")}:00
            </div>
            <div className="p-2 space-y-1">
              {slotEvents.map((e) => {
                const c = colorForType(e.visitType, e.type);
                return (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e)}
                    className="block w-full text-left text-sm rounded-lg px-3 py-2 transition-colors hover:opacity-90"
                    style={{ background: c.bg, color: c.fg }}
                  >
                    <span className="font-mono text-xs mr-2">{TIME_FORMATTER.format(new Date(e.start))}</span>
                    <span className="font-medium">{e.title}</span>
                    {e.subtitle && <span className="block text-xs mt-0.5 opacity-80">{e.subtitle}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventPopup({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  const c = colorForType(event.visitType, event.type);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} style={{ background: "rgba(0,0,0,0.5)" }}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl p-6 relative" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-muted)]" style={{ color: "var(--text-muted)" }}>
          <X className="h-4 w-4" />
        </button>
        <div>
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.fg }}>
            {event.type === "visit" ? `Visite · ${event.visitType}` : event.type}
          </span>
        </div>
        <h3 className="mt-2 font-display text-xl font-bold" style={{ color: "var(--text)" }}>{event.title}</h3>
        {event.subtitle && (
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{event.subtitle}</p>
        )}
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-3">
            <dt className="w-24 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Quand</dt>
            <dd style={{ color: "var(--text)" }}>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(new Date(event.start))}</dd>
          </div>
          {event.durationMinutes && (
            <div className="flex gap-3">
              <dt className="w-24 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Duree</dt>
              <dd style={{ color: "var(--text)" }}>{event.durationMinutes} min</dd>
            </div>
          )}
          {event.technician && (
            <div className="flex gap-3">
              <dt className="w-24 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Technicien</dt>
              <dd style={{ color: "var(--text)" }}>{event.technician}</dd>
            </div>
          )}
          {event.status && (
            <div className="flex gap-3">
              <dt className="w-24 font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</dt>
              <dd style={{ color: "var(--text)" }}>{event.status}</dd>
            </div>
          )}
        </dl>
        <div className="mt-6 flex justify-end">
          <Link href={event.href} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90">
            Ouvrir le detail →
          </Link>
        </div>
      </div>
    </div>
  );
}
