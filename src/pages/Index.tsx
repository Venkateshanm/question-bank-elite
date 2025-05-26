
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Plus, Upload, FileText, BarChart3, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Database,
      title: 'Question Pool Management',
      description: 'Organize thousands of MCQs by units, topics, and difficulty levels',
      link: '/dashboard'
    },
    {
      icon: Plus,
      title: 'Add Questions',
      description: 'Create new MCQs with our intuitive form interface',
      link: '/add-question'
    },
    {
      icon: Upload,
      title: 'Import Questions',
      description: 'Import from CSV, SQL, MD, and TXT files seamlessly',
      link: '/import'
    },
    {
      icon: FileText,
      title: 'Generate MCQs',
      description: 'Create customized question papers with randomization',
      link: '/generate'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            MCQ Question Bank
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Professional question management system for educators. Create, import, organize, and generate MCQ papers with ease.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link to="/dashboard">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/add-question">
              <Plus className="mr-2 h-5 w-5" />
              Add Questions
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">{feature.description}</CardDescription>
                <Button asChild variant="ghost" className="w-full">
                  <Link to={feature.link}>Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-8 border-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2000+</div>
            <div className="text-gray-600 dark:text-gray-300">Questions Ready</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">5</div>
            <div className="text-gray-600 dark:text-gray-300">Units Covered</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Multiple</div>
            <div className="text-gray-600 dark:text-gray-300">Import Formats</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <Zap className="h-12 w-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-blue-100 max-w-2xl mx-auto">
          Import your existing questions or start creating new ones. Our system supports CSV, SQL, MD, and TXT formats.
        </p>
        <Button asChild variant="secondary" size="lg" className="mt-4">
          <Link to="/import">
            <Upload className="mr-2 h-5 w-5" />
            Import Questions
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
