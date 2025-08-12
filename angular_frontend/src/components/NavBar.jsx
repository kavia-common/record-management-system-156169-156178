import React from "react";

/**
 * Top navigation bar component.
 * Minimal, responsive header with brand/title.
 */

// PUBLIC_INTERFACE
export default function NavBar() {
  /** Renders the top navigation bar with brand title "Record Manager". */
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <div className="brand">
          <span className="brand__logo" aria-hidden="true">▦</span>
          <span className="brand__text">Record Manager</span>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          <a className="nav-link" href="#records">Records</a>
        </nav>
      </div>
    </header>
  );
}
