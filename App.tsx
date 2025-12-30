import React, { useState } from 'react';
import { UploadedImage, ProcessingState } from './types';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import { transferTowelColor } from './services/geminiService';
import { Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<UploadedImage | null>(null);
  const [referenceImage, setReferenceImage] = useState<UploadedImage | null>(null);
  
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    resultImage: null
  });

  const handleProcess = async () => {
    if (!sourceImage || !referenceImage) return;

    setProcessingState({
      isLoading: true,
      error: null,
      resultImage: null
    });

    try {
      const resultBase64 = await transferTowelColor(
        referenceImage.base64,
        referenceImage.mimeType,
        sourceImage.base64,
        sourceImage.mimeType,
        referenceImage.width,
        referenceImage.height
      );

      setProcessingState({
        isLoading: false,
        error: null,
        resultImage: resultBase64
      });

    } catch (error) {
      setProcessingState({
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        resultImage: null
      });
    }
  };

  const isReady = sourceImage !== null && referenceImage !== null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TowelMatch</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Google Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-3">
            Transfer Towel Colors Instantly
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Upload a reference towel for the shape, and a source towel for the color. 
            We'll preserve the texture while updating the look.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">1</span>
                Upload Images
              </h3>
              
              <div className="space-y-6">
                <ImageUploader 
                  id="reference-upload"
                  label="Reference Towel"
                  subLabel="The shape, folds, and texture you want to keep."
                  image={referenceImage}
                  onImageChange={setReferenceImage}
                />

                <div className="flex justify-center lg:hidden text-slate-300">
                    <ArrowRight className="transform rotate-90" />
                </div>

                <ImageUploader 
                  id="source-upload"
                  label="Source Towel"
                  subLabel="The color and pattern you want to apply."
                  image={sourceImage}
                  onImageChange={setSourceImage}
                />
              </div>

              <div className="mt-8">
                <button
                  onClick={handleProcess}
                  disabled={!isReady || processingState.isLoading}
                  className={`
                    w-full py-3.5 px-4 rounded-xl font-semibold text-white shadow-sm flex items-center justify-center gap-2 transition-all
                    ${isReady && !processingState.isLoading 
                      ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md cursor-pointer' 
                      : 'bg-slate-300 cursor-not-allowed'}
                  `}
                >
                  {processingState.isLoading ? (
                     <>Processing...</>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Match
                    </>
                  )}
                </button>
                {!isReady && (
                   <p className="text-center text-xs text-slate-400 mt-2">
                     Upload both images to continue
                   </p>
                )}
              </div>
            </div>
          </div>

          {/* Arrow / Connector (Desktop) */}
          <div className="hidden lg:flex lg:col-span-1 h-[34rem] items-center justify-center">
            <ArrowRight className="w-8 h-8 text-slate-300" />
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">2</span>
                  Result
                </h3>
                <ResultDisplay 
                  isLoading={processingState.isLoading}
                  error={processingState.error}
                  resultImage={processingState.resultImage}
                  onRetry={handleProcess}
                />
             </div>
          </div>

        </div>

        {/* Instructions / Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
             <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
               <span className="text-xl">💡</span>
             </div>
             <h4 className="font-semibold text-slate-900 mb-2">Better Lighting</h4>
             <p className="text-sm text-slate-600">Ensure the reference towel has clear lighting and defined folds for the best texture preservation.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
             <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
               <span className="text-xl">🎨</span>
             </div>
             <h4 className="font-semibold text-slate-900 mb-2">Distinct Colors</h4>
             <p className="text-sm text-slate-600">The source towel should have a clear, dominant color or pattern for accurate transfer.</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
             <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
               <span className="text-xl">⚡</span>
             </div>
             <h4 className="font-semibold text-slate-900 mb-2">Fast Processing</h4>
             <p className="text-sm text-slate-600">Powered by Gemini 2.5 Flash, results are generated in seconds.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
