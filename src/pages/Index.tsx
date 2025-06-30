
import React, { useState } from 'react';
import { FileText, ArrowRight, CheckCircle2, Upload, Search, Edit, FileDown } from 'lucide-react';
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
    { 
      id: 'upload', 
      title: 'Upload', 
      description: 'Enviar proposta PDF',
      icon: Upload
    },
    { 
      id: 'extract', 
      title: 'Extração', 
      description: 'Extrair dados',
      icon: Search
    },
    { 
      id: 'edit', 
      title: 'Validação', 
      description: 'Validar informações',
      icon: Edit
    },
    { 
      id: 'generate', 
      title: 'Geração', 
      description: 'Gerar carta',
      icon: FileDown
    }
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 p-3 rounded-xl shadow-lg mr-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <img 
                src="/lovable-uploads/7323f7c6-89e7-48fe-8d84-611c039b2381.png" 
                alt="Agilit Logo" 
                className="h-16 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-green-500 bg-clip-text text-transparent mb-2">
              Gerador de Cartas de Margem Consignável
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos o crédito que você precisa com a segurança e agilidade que merece!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Process Steps - Original Style */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${isActive ? 'text-blue-600' : isCompleted ? 'text-cyan-600' : 'text-gray-400'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      isCompleted ? 'bg-gradient-to-r from-cyan-100 to-green-100 border-cyan-500' : 
                      isActive ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-500' : 
                      'bg-gray-100 border-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className="text-sm font-medium mt-2">{step.title}</span>
                    <span className="text-xs text-gray-500 text-center">{step.description}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className={`w-6 h-6 mx-4 ${
                      index < currentStepIndex ? 'text-cyan-500' : 'text-gray-400'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-cyan-100">
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
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto border border-cyan-100">
            <p className="text-gray-600 font-medium">Sistema de automação para geração de cartas de margem consignável</p>
            <p className="bg-gradient-to-r from-blue-600 via-cyan-600 to-green-500 bg-clip-text text-transparent font-semibold mt-2">AIACON Software</p>
            <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-500">
              <span className="flex items-center"><span className="text-cyan-500 mr-1">✓</span>Seguro e Confiável</span>
              <span className="flex items-center"><span className="text-blue-500 mr-1">✓</span>Rápido e Eficiente</span>
              <span className="flex items-center"><span className="text-green-500 mr-1">✓</span>Fácil de Usar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
