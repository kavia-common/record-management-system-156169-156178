import React, { useEffect, useState } from "react";

/**
 * Record form for creating and editing.
 * Fields: name (required), description (optional).
 */

// PUBLIC_INTERFACE
export default function RecordForm({ initialData, onCancel, onSave }) {
  /** Renders a controlled form for record data. */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setDescription(initialData.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData]);

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = "Name is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave?.({ name: name.trim(), description: description.trim() });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form__field">
        <label className="form__label" htmlFor="name">Name</label>
        <input
          id="name"
          className={`input ${errors.name ? "input--error" : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Record name"
          disabled={saving}
          required
        />
        {errors.name && <div className="form__error">{errors.name}</div>}
      </div>

      <div className="form__field">
        <label className="form__label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={4}
          disabled={saving}
        />
      </div>

      <div className="form__actions">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
