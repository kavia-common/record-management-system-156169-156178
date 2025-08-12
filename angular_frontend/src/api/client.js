//
// API Client for CRUD operations against backend REST API
//

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_API_BASE_URL.trim() !== ""
    ? process.env.REACT_APP_API_BASE_URL
    : "/api";

/**
 * Build a full URL for the API endpoint.
 * @param {string} path path starting with "/"
 * @returns {string} full URL
 */
function url(path) {
  return `${API_BASE_URL}${path}`;
}

/**
 * Parse the JSON body safely (supports empty 204 responses).
 * @param {Response} response fetch response
 * @returns {Promise<any|null>}
 */
async function parseJSON(response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Handle HTTP errors by throwing an informative error.
 * @param {Response} response
 */
async function handleIfError(response) {
  if (!response.ok) {
    let detail = "";
    try {
      const body = await parseJSON(response);
      detail = body && (body.message || JSON.stringify(body));
    } catch {
      // ignore parse failures
    }
    const msg = `Request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`;
    const error = new Error(msg);
    error.status = response.status;
    throw error;
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch list of records.
 * A record minimally contains id (or _id), name, description.
 * @returns {Promise<Array<{id?: string,_id?: string,name: string,description?: string,createdAt?: string}>>}
 */
export async function fetchRecords() {
  /** Fetches all records from `${API_BASE_URL}/records`. */
  const res = await fetch(url("/records"), { headers: { Accept: "application/json" } });
  await handleIfError(res);
  const data = await parseJSON(res);
  return Array.isArray(data) ? data : [];
}

// PUBLIC_INTERFACE
/**
 * Create a new record.
 * @param {{name: string, description?: string}} payload record data
 * @returns {Promise<object>} created record
 */
export async function createRecord(payload) {
  /** Creates a new record at `${API_BASE_URL}/records`. */
  const res = await fetch(url("/records"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  await handleIfError(res);
  return parseJSON(res);
}

// PUBLIC_INTERFACE
/**
 * Update an existing record.
 * @param {string} id record id (supports either id or _id from backend)
 * @param {{name?: string, description?: string}} payload partial record data
 * @returns {Promise<object>} updated record
 */
export async function updateRecord(id, payload) {
  /** Updates a record at `${API_BASE_URL}/records/:id`. */
  const res = await fetch(url(`/records/${encodeURIComponent(id)}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  await handleIfError(res);
  return parseJSON(res);
}

// PUBLIC_INTERFACE
/**
 * Delete a record.
 * @param {string} id record id
 * @returns {Promise<void>}
 */
export async function deleteRecord(id) {
  /** Deletes a record at `${API_BASE_URL}/records/:id`. */
  const res = await fetch(url(`/records/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  await handleIfError(res);
}
