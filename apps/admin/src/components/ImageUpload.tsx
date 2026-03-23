import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  folder = 'uploads',
  label = 'Image',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, error } = useImageUpload();
  const [previewError, setPreviewError] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    setPreviewError(false);

    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (err) {
      setLocalError((err as Error).message);
    }

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-300 uppercase">{label}</label>

      {/* Upload Area */}
      <div
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          disabled || uploading
            ? 'border-gray-600 bg-gray-900/20 cursor-not-allowed'
            : 'border-[#FFBD01]/30 bg-[#FFBD01]/5 hover:bg-[#FFBD01]/10 cursor-pointer'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled || uploading}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 text-[#FFBD01] animate-spin" />
            <p className="text-sm text-gray-400">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-[#FFBD01]" />
            <p className="text-sm font-semibold text-white">
              Cliquez pour uploader une image
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (max 5MB)</p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {localError && (
        <div className="p-3 rounded-lg bg-[#FF0000]/20 border border-[#FF0000]/50">
          <p className="text-[#FF0000] text-sm font-semibold">{localError}</p>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-[#FF0000]/20 border border-[#FF0000]/50">
          <p className="text-[#FF0000] text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* Preview */}
      {value && !previewError && (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            onError={() => setPreviewError(true)}
            className="w-full h-40 object-cover rounded-xl border border-white/10"
          />
          {!disabled && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setPreviewError(false);
              }}
              className="absolute top-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-black text-[#FF0000] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      {previewError && value && (
        <div className="h-40 rounded-xl bg-white/5 border border-[#FF0000]/30 flex items-center justify-center">
          <p className="text-[#FF0000] text-sm">Erreur de chargement de l'image</p>
        </div>
      )}

      {/* Info */}
      {value && (
        <p className="text-xs text-gray-500">
          ✅ Image uploadée avec succès
        </p>
      )}
    </div>
  );
}
