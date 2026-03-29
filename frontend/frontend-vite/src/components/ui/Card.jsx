// Reusable card component
export default function Card({ children, className = "", padding = "p-6", hover = false }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${padding} ${hover ? "hover:shadow-md transition-shadow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
