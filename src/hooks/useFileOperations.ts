
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importAPI, exportAPI } from '@/services/api';
import { MCQQuestion } from '@/types/mcq';
import { toast } from '@/hooks/use-toast';

export const useImportQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, format }: { file: File; format: 'csv' | 'sql' | 'md' | 'txt' }) =>
      importAPI.importQuestions(file, format),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-stats'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      
      toast({
        title: "Import Completed",
        description: `Successfully imported ${result.importedCount} questions`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: `Failed to import questions: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useExportQuestions = () => {
  return useMutation({
    mutationFn: ({ questions, format, includeAnswers }: { 
      questions: MCQQuestion[]; 
      format: 'pdf' | 'txt' | 'md'; 
      includeAnswers: boolean;
    }) => exportAPI.exportQuestions(questions, format, includeAnswers),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mcq_questions.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Questions exported as ${variables.format.toUpperCase()} file`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Export Failed",
        description: `Failed to export questions: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
