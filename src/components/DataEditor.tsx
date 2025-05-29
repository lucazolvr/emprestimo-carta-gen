
import React from 'react';
import { Edit3, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProposalData } from '@/types';

interface DataEditorProps {
  data: ProposalData;
  onDataChange: (data: ProposalData) => void;
  onConfirm: () => void;
}

const DataEditor: React.FC<DataEditorProps> = ({
  data,
  onDataChange,
  onConfirm
}) => {
  const handleInputChange = (field: keyof ProposalData, value: string) => {
    onDataChange({
      ...data,
      [field]: value
    });
  };

  return (
    <Card className="w-full animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Edit3 className="h-5 w-5 text-finance-600" />
          <span>Validar e Editar Dados</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={data.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={data.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              value={data.rg}
              onChange={(e) => handleInputChange('rg', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agencia">Agência</Label>
            <Input
              id="agencia"
              value={data.agencia}
              onChange={(e) => handleInputChange('agencia', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conta">Conta</Label>
            <Input
              id="conta"
              value={data.conta}
              onChange={(e) => handleInputChange('conta', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loanValue">Valor do Empréstimo (R$)</Label>
            <Input
              id="loanValue"
              value={data.loanValue}
              onChange={(e) => handleInputChange('loanValue', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="installmentValue">Valor das Prestações (R$)</Label>
            <Input
              id="installmentValue"
              value={data.installmentValue}
              onChange={(e) => handleInputChange('installmentValue', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="installmentCount">Número de Prestações</Label>
            <Input
              id="installmentCount"
              value={data.installmentCount}
              onChange={(e) => handleInputChange('installmentCount', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstInstallmentDate">Data da Primeira Prestação</Label>
            <Input
              id="firstInstallmentDate"
              value={data.firstInstallmentDate}
              onChange={(e) => handleInputChange('firstInstallmentDate', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastInstallmentDate">Data da Última Prestação</Label>
            <Input
              id="lastInstallmentDate"
              value={data.lastInstallmentDate}
              onChange={(e) => handleInputChange('lastInstallmentDate', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proposalNumber">Número da Proposta</Label>
            <Input
              id="proposalNumber"
              value={data.proposalNumber}
              onChange={(e) => handleInputChange('proposalNumber', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conventionName">Nome do Convênio</Label>
            <Input
              id="conventionName"
              value={data.conventionName}
              onChange={(e) => handleInputChange('conventionName', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="conventionCnpj">CNPJ do Convênio</Label>
            <Input
              id="conventionCnpj"
              value={data.conventionCnpj}
              onChange={(e) => handleInputChange('conventionCnpj', e.target.value)}
              className="focus:ring-finance-500 focus:border-finance-500"
            />
          </div>
        </div>

        <Button
          onClick={onConfirm}
          className="w-full bg-finance-600 hover:bg-finance-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Confirmar Dados e Gerar Carta
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataEditor;
