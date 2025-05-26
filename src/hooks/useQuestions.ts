
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionAPI } from '@/services/api';
import { MCQQuestion, GenerateQuestionRequest } from '@/types/mcq';
import { toast } from '@/hooks/use-toast';

export const useQuestions = (filters?: { unit?: string; topic?: string; bloomsLevel?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['questions', filters],
    queryFn: () => questionAPI.getQuestions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionAPI.getQuestion(id),
    enabled: !!id,
  });
};

export const useQuestionStats = () => {
  return useQuery({
    queryKey: ['question-stats'],
    queryFn: () => questionAPI.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (question: Omit<MCQQuestion, 'id' | 'createdAt' | 'updatedAt'>) =>
      questionAPI.createQuestion(question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-stats'] });
      toast({
        title: "Success",
        description: "Question created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create question: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, question }: { id: number; question: Partial<MCQQuestion> }) =>
      questionAPI.updateQuestion(id, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-stats'] });
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update question: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => questionAPI.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question-stats'] });
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete question: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useGenerateQuestions = () => {
  return useMutation({
    mutationFn: (request: GenerateQuestionRequest) =>
      questionAPI.generateQuestions(request),
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: `Failed to generate questions: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
