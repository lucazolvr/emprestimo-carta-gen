
import React, { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  onClearFile,
  isProcessing
}) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileSelect(file);
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="p-6">
        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-finance-300 rounded-lg p-8 text-center hover:border-finance-400 transition-colors duration-200"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="mx-auto h-12 w-12 text-finance-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Faça upload da proposta de empréstimo
            </h3>
            <p className="text-gray-600 mb-4">
              Arraste e solte o arquivo PDF aqui ou clique para selecionar
            </p>
            <Button
              onClick={() => document.getElementById('file-input')?.click()}
              className="bg-finance-600 hover:bg-finance-700"
              disabled={isProcessing}
            >
              Selecionar arquivo PDF
            </Button>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 bg-finance-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-finance-600" />
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFile}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
