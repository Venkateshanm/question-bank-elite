
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Plus, Save, RefreshCw } from 'lucide-react';

const AddQuestion = () => {
  const [question, setQuestion] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    bloomsLevel: '',
    topic: '',
    unit: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!question.question || !question.optionA || !question.optionB || !question.optionC || !question.optionD) {
      toast({
        title: "Validation Error",
        description: "Please fill in all question and option fields.",
        variant: "destructive"
      });
      return;
    }

    if (!question.correctAnswer) {
      toast({
        title: "Validation Error", 
        description: "Please select the correct answer.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to database
    console.log('Saving question:', question);
    
    toast({
      title: "Question Added",
      description: "Your MCQ has been successfully added to the question pool.",
    });

    // Reset form
    setQuestion({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      bloomsLevel: '',
      topic: '',
      unit: ''
    });
  };

  const handleReset = () => {
    setQuestion({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      bloomsLevel: '',
      topic: '',
      unit: ''
    });
    toast({
      title: "Form Reset",
      description: "All fields have been cleared.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Question</h1>
        <p className="text-gray-600 dark:text-gray-300">Create a new MCQ for your question pool</p>
      </div>

      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Question Details</span>
          </CardTitle>
          <CardDescription>Fill in all the details for your multiple choice question</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-medium">Question *</Label>
              <Textarea
                id="question"
                placeholder="Enter your question here..."
                value={question.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                className="min-h-[100px] resize-none"
                required
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="optionA" className="text-base font-medium">Option A *</Label>
                <Input
                  id="optionA"
                  placeholder="Enter option A"
                  value={question.optionA}
                  onChange={(e) => handleInputChange('optionA', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optionB" className="text-base font-medium">Option B *</Label>
                <Input
                  id="optionB"
                  placeholder="Enter option B"
                  value={question.optionB}
                  onChange={(e) => handleInputChange('optionB', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optionC" className="text-base font-medium">Option C *</Label>
                <Input
                  id="optionC"
                  placeholder="Enter option C"
                  value={question.optionC}
                  onChange={(e) => handleInputChange('optionC', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="optionD" className="text-base font-medium">Option D *</Label>
                <Input
                  id="optionD"
                  placeholder="Enter option D"
                  value={question.optionD}
                  onChange={(e) => handleInputChange('optionD', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Correct Answer */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Correct Answer *</Label>
              <RadioGroup
                value={question.correctAnswer}
                onValueChange={(value) => handleInputChange('correctAnswer', value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="A" id="answerA" />
                  <Label htmlFor="answerA">Option A</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B" id="answerB" />
                  <Label htmlFor="answerB">Option B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="C" id="answerC" />
                  <Label htmlFor="answerC">Option C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="D" id="answerD" />
                  <Label htmlFor="answerD">Option D</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Unit and Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Unit</Label>
                <Select value={question.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">Topic</Label>
                <Select 
                  value={question.topic} 
                  onValueChange={(value) => handleInputChange('topic', value)}
                  disabled={!question.unit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.unit && topics[question.unit as keyof typeof topics]?.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bloom's Level */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Bloom's Taxonomy Level</Label>
              <Select value={question.bloomsLevel} onValueChange={(value) => handleInputChange('bloomsLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {bloomsLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Save className="mr-2 h-4 w-4" />
                Save Question
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddQuestion;
