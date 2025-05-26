
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { FileText, Download, Settings, Shuffle, RefreshCw } from 'lucide-react';

const GenerateMCQ = () => {
  const [config, setConfig] = useState({
    totalQuestions: 20,
    selectedUnits: [] as string[],
    selectedTopics: [] as string[],
    selectedBloomLevels: [] as string[],
    randomize: true,
    includeAnswerKey: true,
    exportFormat: 'pdf'
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const units = [
    'Unit 1: Fundamentals',
    'Unit 2: Advanced Concepts', 
    'Unit 3: Practical Applications',
    'Unit 4: Case Studies',
    'Unit 5: Assessment & Review'
  ];

  const topics = {
    'Unit 1: Fundamentals': ['Basic Principles', 'Core Concepts', 'Introduction', 'Definitions', 'Overview'],
    'Unit 2: Advanced Concepts': ['Complex Theories', 'Advanced Methods', 'Research Topics', 'Specialized Areas'],
    'Unit 3: Practical Applications': ['Case Studies', 'Real-world Examples', 'Implementation', 'Best Practices', 'Tools & Techniques', 'Problem Solving'],
    'Unit 4: Case Studies': ['Industry Examples', 'Historical Cases', 'Comparative Analysis', 'Success Stories', 'Failure Analysis'],
    'Unit 5: Assessment & Review': ['Evaluation Methods', 'Review Techniques', 'Quality Assurance', 'Performance Metrics']
  };

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
        : prev.selectedUnits.filter(u => u !== unit)
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
    return config.selectedUnits.flatMap(unit => 
      topics[unit as keyof typeof topics] || []
    );
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

    setIsGenerating(true);

    try {
      // Simulate question generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock generated questions
      const mockQuestions = Array.from({ length: config.totalQuestions }, (_, i) => ({
        id: i + 1,
        question: `Sample question ${i + 1} from the selected criteria?`,
        optionA: `Option A for question ${i + 1}`,
        optionB: `Option B for question ${i + 1}`,
        optionC: `Option C for question ${i + 1}`,
        optionD: `Option D for question ${i + 1}`,
        correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        bloomsLevel: config.selectedBloomLevels[Math.floor(Math.random() * config.selectedBloomLevels.length)] || 'Remember (Level 1)',
        topic: config.selectedTopics[Math.floor(Math.random() * config.selectedTopics.length)] || 'General',
        unit: config.selectedUnits[Math.floor(Math.random() * config.selectedUnits.length)]
      }));

      setGeneratedQuestions(mockQuestions);
      
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${config.totalQuestions} questions based on your criteria.`,
      });

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportQuestions = () => {
    if (generatedQuestions.length === 0) {
      toast({
        title: "No questions to export",
        description: "Please generate questions first before exporting.",
        variant: "destructive"
      });
      return;
    }

    // Mock export functionality
    const exportData = {
      questions: generatedQuestions,
      format: config.exportFormat,
      includeAnswerKey: config.includeAnswerKey,
      generatedAt: new Date().toISOString()
    };

    console.log('Exporting questions:', exportData);

    toast({
      title: "Export Started",
      description: `Downloading questions as ${config.exportFormat.toUpperCase()} file...`,
    });

    // In a real app, this would trigger file download
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
                  {units.map((unit) => (
                    <div key={unit} className="flex items-center space-x-2">
                      <Checkbox
                        id={unit}
                        checked={config.selectedUnits.includes(unit)}
                        onCheckedChange={(checked) => handleUnitChange(unit, checked as boolean)}
                      />
                      <Label htmlFor={unit} className="text-sm">{unit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics Selection */}
              {config.selectedUnits.length > 0 && (
                <div className="space-y-3">
                  <Label>Select Topics (Optional)</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getAvailableTopics().map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={config.selectedTopics.includes(topic)}
                          onCheckedChange={(checked) => handleTopicChange(topic, checked as boolean)}
                        />
                        <Label htmlFor={topic} className="text-sm">{topic}</Label>
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
                <Select value={config.exportFormat} onValueChange={(value) => setConfig(prev => ({ ...prev, exportFormat: value }))}>
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
                  disabled={isGenerating || config.selectedUnits.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
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

                  <Button onClick={exportQuestions} className="w-full mt-4">
                    <Download className="mr-2 h-4 w-4" />
                    Export as {config.exportFormat.toUpperCase()}
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
