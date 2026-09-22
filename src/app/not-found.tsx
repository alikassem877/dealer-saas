import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl">Page not found</h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn btn-primary mt-6 inline-flex">
          Go home
        </Link>
      </div>
    </main>
  );
}