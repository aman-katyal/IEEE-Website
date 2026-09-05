import { Link } from "react-router";
import { PageTransition } from "../components/shared/PageTransition";

export function NotFoundPage() {
  return (
    <PageTransition>
      <div className="relative flex flex-col items-center justify-center min-h-[70vh] bg-[var(--boiler-black)] text-[var(--text-primary)] p-4 overflow-hidden">
        <div className="ieee-grid-bg absolute inset-0 opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-8xl font-black text-[var(--electric-blue)] mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-md text-center text-lg">
            We couldn't find the page you were looking for. It might have been
            moved or doesn't exist.
          </p>
          <Link
            to="/"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
