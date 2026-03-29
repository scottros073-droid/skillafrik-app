/**
 * Skeleton loaders for loading states
 * Reusable components for improved UX during data fetching
 */

import React from "react";

/**
 * Generic Skeleton Component
 */
export const Skeleton = ({ width = "100%", height = "20px", className = "" }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
    style={{ width, height }}
  />
);

/**
 * Profile Skeleton Loader
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Avatar and Name */}
      <div className="flex gap-6 items-start">
        <Skeleton width="120px" height="120px" className="rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton width="60%" height="24px" />
          <Skeleton width="40%" height="18px" />
          <Skeleton width="80%" height="18px" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton width="100%" height="18px" />
            <Skeleton width="100%" height="24px" />
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="space-y-3">
        <Skeleton width="30%" height="20px" />
        <Skeleton width="100%" height="60px" className="rounded" />
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <Skeleton width="20%" height="20px" />
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} width="100px" height="32px" className="rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Job Card Skeleton Loader
 */
export function JobCardSkeleton() {
  return (
    <div className="p-4 space-y-3 border border-gray-200 dark:border-gray-700 rounded-lg">
      <Skeleton width="80%" height="20px" />
      <Skeleton width="100%" height="40px" />
      <div className="flex gap-2">
        <Skeleton width="30%" height="24px" className="rounded-full" />
        <Skeleton width="30%" height="24px" className="rounded-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton width="30%" height="20px" />
        <Skeleton width="20%" height="20px" />
      </div>
    </div>
  );
}

/**
 * Dashboard Stats Skeleton
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Skeleton width="60%" height="14px" />
          <Skeleton width="100%" height="28px" />
          <Skeleton width="40%" height="12px" />
        </div>
      ))}
    </div>
  );
}

/**
 * List Skeleton Loader
 */
export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-3 space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg">
          <Skeleton width="70%" height="18px" />
          <Skeleton width="100%" height="14px" />
        </div>
      ))}
    </div>
  );
}

/**
 * Card Skeleton Loader
 */
export function CardSkeleton() {
  return (
    <div className="p-4 space-y-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <Skeleton width="80%" height="20px" />
      <div className="space-y-2">
        <Skeleton width="100%" height="12px" />
        <Skeleton width="100%" height="12px" />
        <Skeleton width="60%" height="12px" />
      </div>
      <Skeleton width="40%" height="36px" />
    </div>
  );
}

/**
 * Grid Skeleton Loader
 */
export function GridSkeleton({ cols = 3, count = 6 }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols > 2 ? 2 : 1} lg:grid-cols-${cols} gap-4`}>
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Table Skeleton Loader
 */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <table className="w-full">
      <tbody>
        {[...Array(rows)].map((_, rowIdx) => (
          <tr key={rowIdx} className="border-b border-gray-200 dark:border-gray-700">
            {[...Array(cols)].map((_, colIdx) => (
              <td key={colIdx} className="p-3">
                <Skeleton width="90%" height="16px" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default {
  Skeleton,
  ProfileSkeleton,
  JobCardSkeleton,
  StatsSkeleton,
  ListSkeleton,
  CardSkeleton,
  GridSkeleton,
  TableSkeleton,
};
