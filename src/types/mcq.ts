
export interface MCQQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  bloomsLevel: string;
  topic: string;
  unit: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Unit {
  id: number;
  name: string;
  description?: string;
  topics: Topic[];
}

export interface Topic {
  id: number;
  name: string;
  unitId: number;
  questionCount?: number;
}

export interface QuestionStats {
  totalQuestions: number;
  totalUnits: number;
  totalTopics: number;
  averageBloomsLevel: number;
  unitStats: UnitStats[];
  bloomsDistribution: BloomsDistribution[];
}

export interface UnitStats {
  unitId: number;
  unitName: string;
  questionCount: number;
  topicCount: number;
  lastUpdated: string;
}

export interface BloomsDistribution {
  level: string;
  count: number;
  percentage: number;
}

export interface GenerateQuestionRequest {
  totalQuestions: number;
  selectedUnits: string[];
  selectedTopics: string[];
  selectedBloomLevels: string[];
  randomize: boolean;
}

export interface ImportResult {
  success: boolean;
  message: string;
  importedCount: number;
  errors?: string[];
}
