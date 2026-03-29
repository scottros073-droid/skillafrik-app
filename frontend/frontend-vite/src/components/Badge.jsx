export default function Badge({ children }) {
  return (
    <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
      {children}
    </span>
  );
}
