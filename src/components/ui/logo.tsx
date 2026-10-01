"use client";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`logo-badge ${className ?? ""}`}
      aria-hidden="true"
    >
      <svg
        className="brimus-logo"
        width="32"
        height="50"
        viewBox="0 0 94 147"
        role="img"
        aria-label="Brimus Consultancy Ltd"
        xmlns="http://www.w3.org/2000/svg"
      >
        <use href="/images/brimus_logo.svg#Layer_1" />
      </svg>
    </span>
  );
}
