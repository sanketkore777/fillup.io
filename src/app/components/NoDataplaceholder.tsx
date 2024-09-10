"use client";

export default function NoDataPlaceholder({ data }: { data: String }) {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-gray-100 text-gray-800 p-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-600">
        No {data} Found
      </h2>
      <p className="text-lg mb-6 text-gray-500">
        Looks like there is nothing here yet!
      </p>
    </div>
  );
}
