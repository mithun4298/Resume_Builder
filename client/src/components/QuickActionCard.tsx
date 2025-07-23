import React from "react";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export default function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center mb-2">
        <div className="text-blue-600 mr-2">{icon}</div>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}