"use client";

import { ErrorBoundary } from "./error-boundary";

export default function Home() {
  return (
    <ErrorBoundary>
    <main>
      <h1>Portfolio</h1>
    </main>
    </ErrorBoundary>
  );
}
