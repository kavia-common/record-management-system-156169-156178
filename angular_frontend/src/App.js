import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import Modal from "./components/Modal";
import RecordForm from "./components/RecordForm";
import RecordList from "./components/RecordList";
import { createRecord, deleteRecord, fetchRecords, updateRecord } from "./api/client";

/**
 * Root application component.
 * Provides top navigation, list view, and modal form for create/edit.
 */

// PUBLIC_INTERFACE
export default function App() {
  /** Main React component for the Record Manager UI. */
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const appEnvInfo = useMemo(() => {
    const base = process.env.REACT_APP_API_BASE_URL;
    return base ? `API: ${base}` : "API: /api (default)";
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(record) {
    setEditing(record);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  async function handleSave(payload) {
    setBusy(true);
    setError("");
    try {
      if (editing) {
        const id = editing.id || editing._id;
        const updated = await updateRecord(id, payload);
        setRecords((prev) =>
          prev.map((r) => (r.id === id || r._id === id ? updated : r))
        );
        setToast("Record updated");
      } else {
        const created = await createRecord(payload);
        setRecords((prev) => [created, ...prev]);
        setToast("Record created");
      }
      closeModal();
    } catch (e) {
      setError(e.message || "Failed to save record.");
    } finally {
      setBusy(false);
      dismissToastLater();
    }
  }

  async function handleDelete(record) {
    const name = record?.name || "this record";
    const ok = window.confirm(`Delete ${name}?`);
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      const id = record.id || record._id;
      await deleteRecord(id);
      setRecords((prev) => prev.filter((r) => (r.id || r._id) !== id));
      setToast("Record deleted");
    } catch (e) {
      setError(e.message || "Failed to delete record.");
    } finally {
      setBusy(false);
      dismissToastLater();
    }
  }

  function dismissToastLater() {
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="app">
      <NavBar />
      <main className="main container" id="records">
        <div className="topbar">
          <div>
            <h1 className="title">Records</h1>
            <div className="subtitle">{appEnvInfo}</div>
          </div>
          <div className="actions">
            <button className="btn" onClick={openCreate} disabled={busy}>
              + New Record
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        {toast && (
          <div className="toast" role="status" aria-live="polite">
            {toast}
          </div>
        )}

        {loading ? (
          <div className="loader">
            <div className="spinner" aria-hidden="true" />
            <div>Loading records…</div>
          </div>
        ) : (
          <RecordList records={records} onEdit={openEdit} onDelete={handleDelete} />
        )}
      </main>

      <Modal
        open={modalOpen}
        title={editing ? "Edit Record" : "New Record"}
        onClose={busy ? undefined : closeModal}
      >
        <RecordForm
          initialData={editing}
          onCancel={closeModal}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
}
