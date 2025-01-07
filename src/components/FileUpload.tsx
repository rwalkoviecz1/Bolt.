import React from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { LotteryData } from '../types/lottery';

interface FileUploadProps {
  onDataLoaded: (data: LotteryData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const lotteryData: LotteryData[] = jsonData.map((row: any) => ({
        concurso: row.Concurso,
        dataSorteio: row['Data Sorteio'],
        numbers: [
          row.Bola1,
          row.Bola2,
          row.Bola3,
          row.Bola4,
          row.Bola5,
          row.Bola6
        ].filter(Boolean).map(Number)
      }));

      onDataLoaded(lotteryData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full max-w-md">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
        <Upload className="w-12 h-12 text-blue-500 mb-2" />
        <span className="text-sm font-medium text-gray-600">
          Importar dados do Excel
        </span>
        <input
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};