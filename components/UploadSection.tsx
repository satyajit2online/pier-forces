import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onFileUpload: (content: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileUpload(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Data Source</h2>
          <p className="text-sm text-slate-500">Upload a Pier Forces CSV file to analyze. Default data is loaded initially.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Upload size={18} />
                <span>Upload CSV</span>
            </button>
            <input 
                type="file" 
                ref={fileInputRef}
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
      </div>
    </div>
  );
};
