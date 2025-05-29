
import React from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalData } from '@/types';

interface DataExtractorProps {
  file: File;
  onDataExtracted: (data: ProposalData) => void;
  isProcessing: boolean;
}

const DataExtractor: React.FC<DataExtractorProps> = ({
  file,
  onDataExtracted,
  isProcessing
}) => {
  const extractDataFromPDF = async () => {
    // Simula a extração de dados do PDF
    // Em uma implementação real, você usaria uma biblioteca como pdf-lib ou pdf2pic
    // e um serviço de OCR para extrair os dados
    
    console.log('Iniciando extração de dados do PDF:', file.name);
    
    // Dados mockados baseados no exemplo fornecido
    const mockData: ProposalData = {
      clientName: 'MARIA GICELMA OLIVEIRA DA SILVA',
      cpf: '005.534.623-50',
      rg: '191849520010',
      agencia: '2651',
      conta: '23.321',
      loanValue: '77.995,11',
      installmentValue: '2.267,16',
      installmentCount: '120',
      firstInstallmentDate: '25/07/2025',
      lastInstallmentDate: '25/06/2035',
      proposalNumber: '181816970',
      conventionName: 'SECRETARIA MUNICIPAL DE EDUCACAO - MUNICIP',
      conventionCnpj: '31.043.226/0001-01'
    };

    // Simula tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onDataExtracted(mockData);
  };

  return (
    <Card className="w-full animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-finance-600" />
          <span>Extração de Dados</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">
              Arquivo selecionado: {file.name}
            </span>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-medium mb-1">O que será extraído:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Dados do cliente (Nome, CPF, RG, Agência, Conta)</li>
                <li>Informações do empréstimo (Valor, parcelas, datas)</li>
                <li>Número da proposta</li>
                <li>Dados do convênio (Nome e CNPJ)</li>
              </ul>
            </div>
          </div>

          <Button
            onClick={extractDataFromPDF}
            disabled={isProcessing}
            className="w-full bg-finance-600 hover:bg-finance-700"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Extraindo dados...</span>
              </div>
            ) : (
              'Extrair Dados do PDF'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExtractor;
