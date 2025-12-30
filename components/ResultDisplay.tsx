import React from 'react';
import { Download, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
  onRetry: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, resultImage, onRetry }) => {
  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'towel-match-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Result
      </label>
      <p className="text-xs text-slate-500 mb-2">The source color applied to the reference shape</p>

      <div className={`
        relative border-2 rounded-xl h-64 md:h-[34rem] flex flex-col items-center justify-center transition-all duration-200 overflow-hidden
        ${resultImage ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50/50'}
      `}>
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Processing...</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-2">
              Analysing textures and applying color transfer. This might take a few seconds.
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center p-6 text-center">
             <div className="bg-red-50 p-3 rounded-full mb-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
             </div>
             <h3 className="text-slate-900 font-medium">Processing Failed</h3>
             <p className="text-sm text-red-500 mt-1 max-w-xs mb-4">{error}</p>
             <button 
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
             >
               <RefreshCw size={16} />
               Try Again
             </button>
          </div>
        )}

        {!isLoading && !error && !resultImage && (
          <div className="text-center p-6 opacity-60">
             <div className="bg-slate-200/50 p-4 rounded-full inline-block mb-3">
                <ImageIcon size={32} className="text-slate-400" />
             </div>
             <p className="text-sm text-slate-500">Result will appear here</p>
          </div>
        )}

        {!isLoading && resultImage && (
          <div className="relative w-full h-full group">
            <img 
              src={resultImage} 
              alt="Processed Result" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
               <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg text-sm font-medium text-slate-900 hover:bg-indigo-50 transition-colors"
               >
                 <Download size={16} />
                 Download Image
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple icon placeholder for the empty state
const ImageIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);

export default ResultDisplay;
