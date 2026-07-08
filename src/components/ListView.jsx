import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import AddItemForm from "./AddItemForm.jsx";
import ItemCard from "./ItemCard.jsx";
import ProgressBar from "./ProgressBar.jsx";
import FilterBar from "./FilterBar.jsx";
import profilePhoto from "../assets/profile.jpeg";

export const CATEGORIES = [
  "Travel",
  "Adventure",
  "Food & Drink",
  "Home",
  "Milestones",
  "Movies",
  "Other",
];

export default function ListView({ listId, name, onSwitch }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("active"); // 'active' | 'done' | 'all'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'oldest' | 'az' | 'za'

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    const q = query(
      collection(db, "lists", listId, "items"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
        setLoadError(
          error.message || "Something went wrong loading this list.",
        );
        setLoading(false);
      },
    );
    return () => unsub();
  }, [listId]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = items.filter((it) => {
      if (filterCategory !== "All" && it.category !== filterCategory)
        return false;
      if (filterStatus === "active" && it.completed) return false;
      if (filterStatus === "done" && !it.completed) return false;
      if (q) {
        const haystack = `${it.title} ${it.notes || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    const getTime = (it) => it.createdAt?.toMillis?.() ?? 0;
    const sorted = [...result];
    if (sortBy === "newest") sorted.sort((a, b) => getTime(b) - getTime(a));
    else if (sortBy === "oldest")
      sorted.sort((a, b) => getTime(a) - getTime(b));
    else if (sortBy === "az")
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "za")
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    return sorted;
  }, [items, filterCategory, filterStatus, searchQuery, sortBy]);

  const doneCount = items.filter((i) => i.completed).length;

  async function handleAdd(data) {
    await addDoc(collection(db, "lists", listId, "items"), {
      ...data,
      completed: false,
      completedBy: null,
      completedAt: null,
      addedBy: name,
      createdAt: serverTimestamp(),
    });
  }

  async function handleUpdate(id, data) {
    await updateDoc(doc(db, "lists", listId, "items", id), data);
    setEditingItem(null);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "lists", listId, "items", id));
  }

  async function handleToggleComplete(item) {
    await updateDoc(doc(db, "lists", listId, "items", item.id), {
      completed: !item.completed,
      completedBy: !item.completed ? name : null,
      completedAt: !item.completed ? serverTimestamp() : null,
    });
  }

  return (
    <div className="h-screen flex flex-col bg-ink overflow-hidden">
      <header className="max-w-4xl w-full mx-auto px-6 pt-12 pb-6 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display italic text-muted text-sm tracking-widest uppercase mb-1">
              list &middot; {listId}
            </p>
            <h1 className="font-display text-4xl text-parchment font-semibold">
              Our Bucket List
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2">
            {listId === "0401" && (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border border-surfacealt"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-muted text-sm mt-2">
            Signed in as <span className="text-parchment">{name}</span>
          </p>
          <button
            onClick={onSwitch}
            className="text-[9px] uppercase tracking-wider hover:text-parchment border border-surfacealt rounded-full px-3 py-1.5 text-muted transition"
          >
            Switch List
          </button>
        </div>

        <div className="mt-8">
          <ProgressBar total={items.length} done={doneCount} />
        </div>
      </header>

      <div className="max-w-4xl w-full mx-auto px-6 flex-shrink-0">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <FilterBar
            categories={CATEGORIES}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-gold text-ink font-semibold rounded-full px-5 py-2 text-sm hover:brightness-110 transition whitespace-nowrap"
          >
            {showForm ? "Close form" : "+ Add"}
          </button>
        </div>

        {showForm && (
          <AddItemForm
            categories={CATEGORIES}
            onCancel={() => setShowForm(false)}
            onSubmit={handleAdd}
          />
        )}
      </div>

      <main className="max-w-4xl w-full mx-auto px-6 pb-24 flex-1 min-h-0 overflow-y-auto">
        {loading && <p className="text-muted text-sm">Loading your list…</p>}

        {!loading && loadError && (
          <div className="text-center py-16 border border-rose/40 rounded-2xl bg-rose/5">
            <p className="font-display text-2xl text-parchment mb-2">
              Couldn't load this list.
            </p>
            <p className="text-muted text-sm max-w-sm mx-auto">{loadError}</p>
            <p className="text-muted text-xs mt-3">
              Check your Firebase config and Firestore rules, then reload.
            </p>
          </div>
        )}

        {!loading && !loadError && filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-surfacealt rounded-2xl">
            <p className="font-display text-2xl text-parchment mb-2">
              A blank page.
            </p>
            <p className="text-muted text-sm">
              Nothing here yet — add the first thing you both want to do.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((item) =>
            editingItem === item.id ? (
              <AddItemForm
                key={item.id}
                categories={CATEGORIES}
                initial={item}
                onCancel={() => setEditingItem(null)}
                onSubmit={(data) => handleUpdate(item.id, data)}
              />
            ) : (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={() => handleToggleComplete(item)}
                onEdit={() => setEditingItem(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ),
          )}
        </div>
      </main>
    </div>
  );
}
