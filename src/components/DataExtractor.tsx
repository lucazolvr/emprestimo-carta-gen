
import React from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProposalData } from '@/types';
import { extractDataFromPDF } from '@/utils/pdfExtractor';

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
  const handleExtractData = async () => {
    console.log('Iniciando extração de dados do PDF:', file.name);
    
    try {
      const extractedData = await extractDataFromPDF(file);
      onDataExtracted(extractedData);
    } catch (error) {
      console.error('Erro na extração:', error);
      // Em caso de erro, usar dados padrão para demonstração
      const fallbackData: ProposalData = {
        clientName: 'NOME NÃO EXTRAÍDO',
        cpf: '000.000.000-00',
        rg: '0000000000',
        agencia: '0000',
        conta: '00.000',
        loanValue: '0,00',
        installmentValue: '0,00',
        installmentCount: '0',
        firstInstallmentDate: '00/00/0000',
        lastInstallmentDate: '00/00/0000',
        proposalNumber: '000000000',
        conventionName: 'CONVÊNIO NÃO IDENTIFICADO',
        conventionCnpj: '00.000.000/0001-00'
      };
      onDataExtracted(fallbackData);
    }
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
            onClick={handleExtractData}
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
