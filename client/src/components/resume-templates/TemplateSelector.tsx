import React from "react";

interface TemplateSelectorProps {
  templates: { key: string; name: string; preview: React.ReactNode }[];
  selected: string;
  onSelect: (key: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, selected, onSelect }) => (
  <div className="no-print flex flex-wrap gap-4 mb-6">
    {templates.map(t => (
      <button
        key={t.key}
        className={`border-2 rounded-lg p-3 min-w-[120px] transition-colors ${selected === t.key ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"}`}
        onClick={() => onSelect(t.key)}
        aria-label={`Select ${t.name} template`}
      >
        <div className="text-center">
          {t.preview}
          <div className="mt-2 text-sm font-medium">{t.name}</div>
        </div>
      </button>
    ))}
  </div>
);

export default TemplateSelector;
