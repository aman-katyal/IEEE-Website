import React from "react";
import { Link } from "react-router";
import { PageTransition } from "../components/shared/PageTransition";

export function NotFoundPage() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-neutral-950 text-white p-4">
        <h1 className="text-8xl font-black text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
        <p className="text-neutral-400 mb-8 max-w-md text-center text-lg">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </PageTransition>
  );
}
