// Reusable page container for consistent layout
export default function PageContainer({ title, subtitle, children, maxWidth = "max-w-4xl" }) {
  return (
    <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>}
          {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
