import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-xl mt-4">Page not found</p>
      <Link
        to="/"
        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}
