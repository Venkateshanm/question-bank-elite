
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, BookOpen, FileQuestion, Target, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data - in real app this would come from your database
  const stats = {
    totalQuestions: 2847,
    units: 5,
    topics: 24,
    averageBloomsLevel: 3.2
  };

  const unitData = [
    { unit: 'Unit 1: Fundamentals', questions: 623, topics: 5, lastUpdated: '2024-01-15' },
    { unit: 'Unit 2: Advanced Concepts', questions: 587, topics: 4, lastUpdated: '2024-01-14' },
    { unit: 'Unit 3: Practical Applications', questions: 456, topics: 6, lastUpdated: '2024-01-13' },
    { unit: 'Unit 4: Case Studies', questions: 398, topics: 5, lastUpdated: '2024-01-12' },
    { unit: 'Unit 5: Assessment & Review', questions: 783, topics: 4, lastUpdated: '2024-01-11' }
  ];

  const bloomsDistribution = [
    { level: 'Remember', count: 845, percentage: 29.7 },
    { level: 'Understand', count: 756, percentage: 26.5 },
    { level: 'Apply', count: 623, percentage: 21.9 },
    { level: 'Analyze', count: 398, percentage: 14.0 },
    { level: 'Evaluate', count: 156, percentage: 5.5 },
    { level: 'Create', count: 69, percentage: 2.4 }
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Question Bank Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Overview of your MCQ question pool</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalQuestions.toLocaleString()}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +127 this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Units</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.units}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Active units</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Topics</CardTitle>
            <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.topics}</div>
            <p className="text-xs text-green-600 dark:text-green-400">Across all units</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg. Bloom's Level</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.averageBloomsLevel}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Difficulty distribution</p>
          </CardContent>
        </Card>
      </div>

      {/* Unit-wise Breakdown */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="text-xl">Unit-wise Question Distribution</CardTitle>
          <CardDescription>Questions organized by units and topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unitData.map((unit, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{unit.unit}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {unit.topics} topics • Last updated {unit.lastUpdated}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unit.questions}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">questions</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bloom's Taxonomy Distribution */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="text-xl">Bloom's Taxonomy Distribution</CardTitle>
          <CardDescription>Question distribution by cognitive difficulty levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bloomsDistribution.map((level, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="min-w-[80px] justify-center">
                      {level.level}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{level.count} questions</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{level.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${level.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
