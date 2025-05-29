
import React, { useState } from 'react';
import { Download, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProposalData, LETTER_TEMPLATES, LetterTemplate } from '@/types';

interface LetterGeneratorProps {
  data: ProposalData;
  onReset: () => void;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({ data, onReset }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);

  // Auto-select template based on CNPJ
  React.useEffect(() => {
    const template = LETTER_TEMPLATES.find(t => t.cnpj === data.conventionCnpj);
    if (template) {
      setSelectedTemplate(template);
    }
  }, [data.conventionCnpj]);

  const generateLetter = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    // Simula geração da carta
    await new Promise(resolve => setTimeout(resolve, 1500));

    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const letterContent = `
São Mateus do Maranhão, ${formattedDate}

Ao
Banco do Brasil S.A
Agência ${data.agencia} de São Mateus do Maranhão MA

Referente a Empréstimo de Consignação em Folha Pagamento - Confirmação de 
Reserva de Margem Consignável.

DADOS DO EMPREGADO:

NOME: ${data.clientName}
CPF: ${data.cpf}   Ag: ${data.agencia}   C/C: ${data.conta}
RG: ${data.rg}

DADOS DO EMPREGADOR:

NOME: ${selectedTemplate.name}
CNPJ: ${selectedTemplate.cnpj}

DADOS DO EMPRÉSTIMO:

Valor do Empréstimo R$: ${data.loanValue}  Número de Prestações: ${data.installmentCount}
Valor das Prestações R$: ${data.installmentValue}
Data da Primeira Prestação: ${data.firstInstallmentDate}
Data da Última Prestação: ${data.lastInstallmentDate}

Informo-lhe que recebemos de nosso empregado em referência, comunicado sobre
Operação de Crédito Número ${data.proposalNumber}, conforme dados acima com pagamento
mediante consignação em folha de Pagamento com esse Banco, autorizado os
devidos descontos das prestações mensais em Folha de Pagamento e o posterior
repasse a esta Instituição Financeira.

Dessa forma, ao tempo em que confirmamos a existência de margem consignável
suficiente para amparar os valores que serão consignados, informamos que a
autorização de nosso Empregado estará sendo integralmente atendida.

Assumimos desde já, o compromisso de consignar e repassar a esse Banco na forma
da legislação em vigor, os valores mensais, inclusive aqueles eventualmente
decorrentes de verbas rescisórias, no caso de desligamento do empregado do quadro
da nossa empresa.

Atenciosamente,

___________________________________________________________________

${selectedTemplate.signatoryRole}
${selectedTemplate.signatory}

CPF: ${selectedTemplate.signatoryCpf}
    `;

    setGeneratedLetter(letterContent);
    setIsGenerating(false);
  };

  const downloadPDF = () => {
    // Em uma implementação real, você usaria uma biblioteca como jsPDF
    // para gerar o PDF da carta
    console.log('Gerando PDF da carta...');
    
    // Simula download
    const element = document.createElement('a');
    const file = new Blob([generatedLetter || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `carta-reserva-margem-${data.proposalNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Card className="w-full animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-finance-600" />
          <span>Gerar Carta de Confirmação</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Modelo da Carta
            </label>
            <Select
              value={selectedTemplate?.id || ''}
              onValueChange={(value) => {
                const template = LETTER_TEMPLATES.find(t => t.id === value);
                setSelectedTemplate(template || null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha o modelo baseado no convênio" />
              </SelectTrigger>
              <SelectContent>
                {LETTER_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Modelo Selecionado</span>
              </div>
              <p className="text-sm text-green-700">
                {selectedTemplate.name} - CNPJ: {selectedTemplate.cnpj}
              </p>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={generateLetter}
              disabled={!selectedTemplate || isGenerating}
              className="flex-1 bg-finance-600 hover:bg-finance-700"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Gerando...</span>
                </div>
              ) : (
                'Gerar Carta'
              )}
            </Button>

            {generatedLetter && (
              <Button
                onClick={downloadPDF}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            )}
          </div>

          {generatedLetter && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Prévia da Carta:</h3>
              <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {generatedLetter}
                </pre>
              </div>
            </div>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full mt-4"
          >
            Processar Nova Proposta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LetterGenerator;
