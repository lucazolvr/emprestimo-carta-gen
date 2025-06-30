
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
      icon: Upload,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'extract', 
      title: 'Extração', 
      description: 'Extrair dados',
      icon: Search,
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'edit', 
      title: 'Validação', 
      description: 'Validar informações',
      icon: Edit,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'generate', 
      title: 'Geração', 
      description: 'Gerar carta',
      icon: FileDown,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const getStepIndex = (step: Step) => steps.findIndex(s => s.id === step);
  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 ml-4">
                Gerador de Cartas de Margem Consignável
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos o crédito que você precisa com a segurança e agilidade que merece!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Services Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conheça nossos serviços</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div
                  key={step.id}
                  className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                    isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      ) : (
                        <Icon className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    {isActive && !isCompleted && (
                      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
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
          <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
            <p className="text-gray-600 font-medium">Sistema de automação para geração de cartas de margem consignável</p>
            <p className="text-blue-600 font-semibold mt-2">AIACON Software</p>
            <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-500">
              <span>✓ Seguro e Confiável</span>
              <span>✓ Rápido e Eficiente</span>
              <span>✓ Fácil de Usar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
