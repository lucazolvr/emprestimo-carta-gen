
import { ProposalData } from '@/types';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar o worker do PDF.js de forma mais robusta
const PDFJS_VERSION = '4.0.379';
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// Função principal atualizada
export async function extractDataFromPDF(file: File): Promise<ProposalData> {
  try {
    // 1. Usa a nova função para extrair LINHAS de texto
    const lines = await extractTextLinesFromPDF(file);
    
    if (!lines || lines.length === 0) {
      throw new Error('Não foi possível extrair texto do PDF');
    }

    // 2. Usa a nova função para parsear as LINHAS
    const extractedData = parseExtractedLines(lines);
    
    console.log('Dados finais extraídos:', extractedData);
    return extractedData;
    
  } catch (error) {
    console.error('ERRO na extração:', error);
    // Lança o erro para que o componente React possa tratá-lo
    throw new Error(`Falha na extração do PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

// Nova função para extrair texto linha por linha
async function extractTextLinesFromPDF(file: File): Promise<string[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const allLines: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];

    if (items.length === 0) continue;

    // Agrupa itens de texto por linha (coordenada Y)
    const linesMap = new Map<number, any[]>();
    for (const item of items) {
      // Usa a posição Y (transform[5]) arredondada como chave
      const y = Math.round(item.transform[5]);
      if (!linesMap.has(y)) {
        linesMap.set(y, []);
      }
      linesMap.get(y)!.push(item);
    }

    // Ordena as linhas pela posição Y (de cima para baixo)
    const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);

    // Para cada linha, ordena os itens por X (da esquerda para a direita) e junta o texto
    for (const y of sortedY) {
      const lineItems = linesMap.get(y)!;
      lineItems.sort((a, b) => a.transform[4] - b.transform[4]);
      const lineText = lineItems.map(item => item.str).join(' ');
      allLines.push(lineText);
    }
    allLines.push('\n--- PAGE BREAK ---\n'); // Adiciona um separador de página
  }
  
  console.log("--- LINHAS EXTRAÍDAS DO PDF ---");
  console.log(allLines);
  return allLines;
}

// Nova função de parsing que trabalha com um array de linhas
export function parseExtractedLines(lines: string[]): ProposalData {
    const data: Partial<ProposalData> = {};

    // Itera pelas linhas com um índice para poder olhar a linha seguinte
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // --- Lógica para dados em linhas separadas ---

        // Procura por "CPF" e "Nome" na mesma linha
        if (line.includes('CPF') && line.includes('Nome')) {
            const valuesLine = lines[i + 1]; // Pega a linha seguinte
            if (valuesLine) {
                // Extrai CPF com regex para garantir o formato
                const cpfMatch = valuesLine.match(/\d{3}\.\d{3}\.\d{3}\.\d{2}/);
                if (cpfMatch) {
                    data.cpf = cpfMatch[0];
                    // O nome é o resto da string, sem o CPF
                    data.clientName = valuesLine.replace(cpfMatch[0], '').trim();
                }
            }
        }
        
        // Procura por "Documento de Identificação", "Agência" e "Conta"
        if (line.includes('Documento de Identificação') && line.includes('Agência')) {
            const valuesLine = lines[i + 1]; // Pega a linha seguinte
            if (valuesLine) {
                 // Divide a linha de valores por 2 ou mais espaços
                const parts = valuesLine.trim().split(/\s{2,}/);
                if (parts.length >= 3) {
                    // Extrai o RG, que é a primeira parte
                    data.rg = parts[0].replace('RG', '').trim();
                    // A agência é a segunda parte
                    data.agencia = parts[1];
                    // A conta é a terceira parte
                    data.conta = parts[2];
                }
            }
        }

      
        
        const patterns = {
            proposalNumber: /Número da proposta:\s*(\d+)/i,
            loanValue: /Valor solicitado\s+([0-9.,]+)/i,
            installmentValue: /Valor Parcela\s+([0-9.,]+)/i,
            installmentCount: /Prazo em Meses:\s*(\d+)/i,
            firstInstallmentDate: /Data do Débito da Primeira Parcela:\s*(\d{2}\.\d{2}\.\d{4})/i,
            lastInstallmentDate: /Data do Débito Da Última Parcela:\s*(\d{2}\.\d{2}\.\d{4})/i,
            conventionName: /Nome do convênio\s+([\w\s-]+?)\s{2,}/i,
        };

        // Aplica os padrões se o dado ainda não foi encontrado
        if (!data.proposalNumber) data.proposalNumber = line.match(patterns.proposalNumber)?.[1].trim();
        if (!data.loanValue) data.loanValue = line.match(patterns.loanValue)?.[1].trim();
        if (!data.installmentValue) data.installmentValue = line.match(patterns.installmentValue)?.[1].trim();
        if (!data.installmentCount) data.installmentCount = line.match(patterns.installmentCount)?.[1].trim();
        if (!data.firstInstallmentDate) data.firstInstallmentDate = line.match(patterns.firstInstallmentDate)?.[1].trim();
        if (!data.lastInstallmentDate) data.lastInstallmentDate = line.match(patterns.lastInstallmentDate)?.[1].trim();
        if (!data.conventionName) data.conventionName = line.match(patterns.conventionName)?.[1].trim();
    }

    // Retorna os dados encontrados com valores padrão para o que faltou
    return {
        clientName: data.clientName || 'NOME NÃO ENCONTRADO',
        cpf: data.cpf || '000.000.000-00',
        rg: data.rg || '0000000000',
        agencia: data.agencia || '0000',
        conta: data.conta || '00.000',
        loanValue: data.loanValue || '0,00',
        installmentValue: data.installmentValue || '0,00',
        installmentCount: data.installmentCount || '0',
        firstInstallmentDate: data.firstInstallmentDate || '00/00/0000',
        lastInstallmentDate: data.lastInstallmentDate || '00/00/0000',
        proposalNumber: data.proposalNumber || '000000000',
        conventionName: data.conventionName || 'CONVÊNIO NÃO IDENTIFICADO',
        conventionCnpj: data.conventionCnpj || '00.000.000/0001-00', // Nota: Lógica para CNPJ do convênio não foi adicionada, pois não está claro no log.
    };
}

function extractWithPatterns(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const result = match[1].trim();
      if (result.length > 0) {
        console.log(`Match encontrado para pattern ${pattern}: "${result}"`);
        return result;
      }
    }
  }
  return null;
}

function cleanCurrency(value: string | null): string {
  if (!value) return '0,00';
  return value.replace(/[R$\s]/g, '').trim();
}
