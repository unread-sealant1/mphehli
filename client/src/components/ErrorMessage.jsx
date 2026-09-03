import React from 'react';

export default function ErrorMessage({ message = "Something went wrong. Please try again later." }) {
  return (
    <div className="min-h-screen bg-[#050D1A] flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="font-display font-900 text-white text-2xl uppercase mb-2">Error</h2>
        <p className="text-[#94A3B8] mb-6">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#3B82F6] text-white font-display font-700 uppercase tracking-widest px-6 py-2 hover:bg-[#2563EB] transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
