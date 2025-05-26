
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Settings, Shuffle, RefreshCw } from 'lucide-react';
import { useUnits } from '@/hooks/useUnits';
import { useGenerateQuestions } from '@/hooks/useQuestions';
import { useExportQuestions } from '@/hooks/useFileOperations';
import { MCQQuestion } from '@/types/mcq';
import { toast } from '@/hooks/use-toast';

const GenerateMCQ = () => {
  const [config, setConfig] = useState({
    totalQuestions: 20,
    selectedUnits: [] as string[],
    selectedTopics: [] as string[],
    selectedBloomLevels: [] as string[],
    randomize: true,
    includeAnswerKey: true,
    exportFormat: 'pdf' as 'pdf' | 'txt' | 'md'
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<MCQQuestion[]>([]);

  const { data: units, isLoading: unitsLoading } = useUnits();
  const generateMutation = useGenerateQuestions();
  const exportMutation = useExportQuestions();

  const bloomsLevels = [
    'Remember (Level 1)',
    'Understand (Level 2)', 
    'Apply (Level 3)',
    'Analyze (Level 4)',
    'Evaluate (Level 5)',
    'Create (Level 6)'
  ];

  const exportFormats = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'txt', label: 'Text File' },
    { value: 'md', label: 'Markdown File' }
  ];

  const handleUnitChange = (unit: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      selectedUnits: checked 
        ? [...prev.selectedUnits, unit]
        : prev.selectedUnits.filter(u => u !== unit),
      selectedTopics: [] // Reset topics when units change
    }));
  };

  const handleTopicChange = (topic: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      selectedTopics: checked 
        ? [...prev.selectedTopics, topic]
        : prev.selectedTopics.filter(t => t !== topic)
    }));
  };

  const handleBloomLevelChange = (level: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      selectedBloomLevels: checked 
        ? [...prev.selectedBloomLevels, level]
        : prev.selectedBloomLevels.filter(l => l !== level)
    }));
  };

  const getAvailableTopics = () => {
    if (!units) return [];
    
    return config.selectedUnits.flatMap(unitName => {
      const unit = units.find(u => u.name === unitName);
      return unit?.topics || [];
    });
  };

  const generateQuestions = async () => {
    if (config.selectedUnits.length === 0) {
      toast({
        title: "No units selected",
        description: "Please select at least one unit to generate questions from.",
        variant: "destructive"
      });
      return;
    }

    try {
      const questions = await generateMutation.mutateAsync({
        totalQuestions: config.totalQuestions,
        selectedUnits: config.selectedUnits,
        selectedTopics: config.selectedTopics,
        selectedBloomLevels: config.selectedBloomLevels,
        randomize: config.randomize,
      });

      setGeneratedQuestions(questions);
      
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${questions.length} questions based on your criteria.`,
      });

    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const exportQuestions = async () => {
    if (generatedQuestions.length === 0) {
      toast({
        title: "No questions to export",
        description: "Please generate questions first before exporting.",
        variant: "destructive"
      });
      return;
    }

    try {
      await exportMutation.mutateAsync({
        questions: generatedQuestions,
        format: config.exportFormat,
        includeAnswers: config.includeAnswerKey,
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const resetGeneration = () => {
    setGeneratedQuestions([]);
    setConfig({
      totalQuestions: 20,
      selectedUnits: [],
      selectedTopics: [],
      selectedBloomLevels: [],
      randomize: true,
      includeAnswerKey: true,
      exportFormat: 'pdf'
    });
  };

  if (unitsLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate MCQ Paper</h1>
          <p className="text-gray-600 dark:text-gray-300">Loading units and topics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate MCQ Paper</h1>
        <p className="text-gray-600 dark:text-gray-300">Create customized question papers from your question pool</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Generation Settings</span>
              </CardTitle>
              <CardDescription>Configure your MCQ paper generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Number of Questions */}
              <div className="space-y-2">
                <Label htmlFor="totalQuestions">Number of Questions</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  min="1"
                  max="100"
                  value={config.totalQuestions}
                  onChange={(e) => setConfig(prev => ({ ...prev, totalQuestions: parseInt(e.target.value) || 20 }))}
                />
              </div>

              {/* Units Selection */}
              <div className="space-y-3">
                <Label>Select Units</Label>
                <div className="space-y-2">
                  {units?.map((unit) => (
                    <div key={unit.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={unit.name}
                        checked={config.selectedUnits.includes(unit.name)}
                        onCheckedChange={(checked) => handleUnitChange(unit.name, checked as boolean)}
                      />
                      <Label htmlFor={unit.name} className="text-sm">{unit.name}</Label>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No units available</p>
                  )}
                </div>
              </div>

              {/* Topics Selection */}
              {config.selectedUnits.length > 0 && (
                <div className="space-y-3">
                  <Label>Select Topics (Optional)</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getAvailableTopics().map((topic) => (
                      <div key={topic.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic.name}
                          checked={config.selectedTopics.includes(topic.name)}
                          onCheckedChange={(checked) => handleTopicChange(topic.name, checked as boolean)}
                        />
                        <Label htmlFor={topic.name} className="text-sm">{topic.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bloom's Levels */}
              <div className="space-y-3">
                <Label>Difficulty Levels (Optional)</Label>
                <div className="space-y-2">
                  {bloomsLevels.map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={config.selectedBloomLevels.includes(level)}
                        onCheckedChange={(checked) => handleBloomLevelChange(level, checked as boolean)}
                      />
                      <Label htmlFor={level} className="text-sm">{level}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <Label>Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="randomize"
                      checked={config.randomize}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, randomize: checked as boolean }))}
                    />
                    <Label htmlFor="randomize" className="text-sm">Randomize question order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="answerKey"
                      checked={config.includeAnswerKey}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeAnswerKey: checked as boolean }))}
                    />
                    <Label htmlFor="answerKey" className="text-sm">Include answer key</Label>
                  </div>
                </div>
              </div>

              {/* Export Format */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={config.exportFormat} onValueChange={(value: 'pdf' | 'txt' | 'md') => setConfig(prev => ({ ...prev, exportFormat: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exportFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>{format.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={generateQuestions} 
                  disabled={generateMutation.isPending || config.selectedUnits.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {generateMutation.isPending ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Shuffle className="mr-2 h-4 w-4" />
                      Generate Questions
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={resetGeneration} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Questions Preview */}
        <div className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Generated Questions</span>
                </div>
                {generatedQuestions.length > 0 && (
                  <Badge variant="secondary">{generatedQuestions.length} questions</Badge>
                )}
              </CardTitle>
              <CardDescription>Preview of your generated MCQ paper</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No questions generated yet</p>
                  <p className="text-sm">Configure settings and click generate to see questions here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-96 overflow-y-auto space-y-4">
                    {generatedQuestions.slice(0, 3).map((question, index) => (
                      <div key={question.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {index + 1}. {question.question}
                            </h4>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {question.bloomsLevel.split(' ')[0]}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <div>A) {question.optionA}</div>
                            <div>B) {question.optionB}</div>
                            <div>C) {question.optionC}</div>
                            <div>D) {question.optionD}</div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{question.topic}</span>
                            {config.includeAnswerKey && (
                              <span className="font-medium">Answer: {question.correctAnswer}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {generatedQuestions.length > 3 && (
                      <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
                        ... and {generatedQuestions.length - 3} more questions
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={exportQuestions} 
                    disabled={exportMutation.isPending}
                    className="w-full mt-4"
                  >
                    {exportMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Export as {config.exportFormat.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateMCQ;
