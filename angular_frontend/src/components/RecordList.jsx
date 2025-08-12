import React, { useMemo, useState } from "react";

/**
 * RecordList component displays a filterable list of records in a responsive table/card layout.
 */

// PUBLIC_INTERFACE
export default function RecordList({ records, onEdit, onDelete }) {
  /** Renders the record list with search and action buttons. */
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => {
      const name = (r.name || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [records, query]);

  if (!records || records.length === 0) {
    return (
      <div className="empty">
        <div className="empty__icon" aria-hidden="true">📄</div>
        <div className="empty__title">No records yet</div>
        <div className="empty__subtitle">Create your first record using the "New Record" button.</div>
      </div>
    );
  }

  return (
    <div className="list">
      <div className="list__toolbar">
        <input
          className="input input--search"
          placeholder="Search records…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search records"
        />
      </div>
      <div className="table">
        <div className="table__header table__row">
          <div className="table__cell table__cell--grow">Name</div>
          <div className="table__cell table__cell--grow">Description</div>
          <div className="table__cell table__cell--actions">Actions</div>
        </div>
        <div className="table__body">
          {filtered.map((r) => {
            const id = r.id || r._id || "";
            return (
              <div key={id} className="table__row">
                <div className="table__cell table__cell--grow">
                  <div className="item-title">{r.name}</div>
                  {r.createdAt && <div className="item-subtitle">Created {new Date(r.createdAt).toLocaleString()}</div>}
                </div>
                <div className="table__cell table__cell--grow">
                  <div className="item-desc">{r.description || "—"}</div>
                </div>
                <div className="table__cell table__cell--actions">
                  <button className="icon-btn" aria-label={`Edit ${r.name}`} onClick={() => onEdit?.(r)}>✎</button>
                  <button
                    className="icon-btn icon-btn--danger"
                    aria-label={`Delete ${r.name}`}
                    onClick={() => onDelete?.(r)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
