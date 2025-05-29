
import React, { useState } from 'react';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import DataExtractor from '@/components/DataExtractor';
import DataEditor from '@/components/DataEditor';
import LetterGenerator from '@/components/LetterGenerator';
import { ProposalData } from '@/types';

type Step = 'upload' | 'extract' | 'edit' | 'generate';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ProposalData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCurrentStep('extract');
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setCurrentStep('upload');
    setExtractedData(null);
  };

  const handleDataExtracted = (data: ProposalData) => {
    setExtractedData(data);
    setCurrentStep('edit');
  };

  const handleDataConfirmed = () => {
    setCurrentStep('generate');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setCurrentStep('upload');
    setIsProcessing(false);
  };

  const steps = [
    { id: 'upload', title: 'Upload', description: 'Enviar proposta PDF' },
    { id: 'extract', title: 'Extração', description: 'Extrair dados' },
    { id: 'edit', title: 'Validação', description: 'Validar informações' },
    { id: 'generate', title: 'Geração', description: 'Gerar carta' }
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-finance-50 via-white to-finance-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-finance-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Gerador de Cartas de Margem Consignável
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Automatize a criação de cartas de confirmação de reserva de margem consignável
            a partir de propostas de empréstimo em PDF
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      index <= currentStepIndex
                        ? 'bg-finance-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mx-4 mt-[-20px]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'upload' && (
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              onClearFile={handleClearFile}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'extract' && selectedFile && (
            <DataExtractor
              file={selectedFile}
              onDataExtracted={handleDataExtracted}
              isProcessing={isProcessing}
            />
          )}

          {currentStep === 'edit' && extractedData && (
            <DataEditor
              data={extractedData}
              onDataChange={setExtractedData}
              onConfirm={handleDataConfirmed}
            />
          )}

          {currentStep === 'generate' && extractedData && (
            <LetterGenerator
              data={extractedData}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Sistema de automação para geração de cartas de margem consignável</p>
          <p>Suporte aos modelos: Prefeitura de São Mateus e IPAM</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
