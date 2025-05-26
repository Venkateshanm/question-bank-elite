
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText, Database, FileSpreadsheet, File, CheckCircle, AlertCircle } from 'lucide-react';

const ImportQuestions = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [importStatus, setImportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    { 
      extension: '.csv', 
      icon: FileSpreadsheet, 
      description: 'Comma-separated values file',
      example: 'question,optionA,optionB,optionC,optionD,correctAnswer,bloomsLevel,topic,unit'
    },
    { 
      extension: '.sql', 
      icon: Database, 
      description: 'SQL database dump file',
      example: 'INSERT INTO questions (question, option_a, option_b...) VALUES (...);'
    },
    { 
      extension: '.md', 
      icon: FileText, 
      description: 'Markdown formatted file',
      example: '## Question\nWhat is...?\n### Options\nA) Option 1\nB) Option 2...'
    },
    { 
      extension: '.txt', 
      icon: File, 
      description: 'Plain text file',
      example: 'Question: What is...?\nA) Option 1\nB) Option 2\nAnswer: A'
    }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return ['.csv', '.sql', '.md', '.txt'].includes(extension);
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Some files skipped",
        description: "Only CSV, SQL, MD, and TXT files are supported.",
        variant: "destructive"
      });
    }

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processImport = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to import.",
        variant: "destructive"
      });
      return;
    }

    setImportStatus('processing');

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, you would process each file here
      let totalQuestions = 0;
      for (const file of files) {
        console.log(`Processing file: ${file.name}`);
        // Mock processing - would parse file content and extract questions
        totalQuestions += Math.floor(Math.random() * 100) + 50;
      }

      setImportStatus('success');
      toast({
        title: "Import Successful",
        description: `Successfully imported ${totalQuestions} questions from ${files.length} file(s).`,
      });

      // Reset after success
      setTimeout(() => {
        setFiles([]);
        setImportStatus('idle');
      }, 3000);

    } catch (error) {
      setImportStatus('error');
      toast({
        title: "Import Failed",
        description: "An error occurred while importing the files. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    const format = supportedFormats.find(f => f.extension === extension);
    return format?.icon || File;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Import Questions</h1>
        <p className="text-gray-600 dark:text-gray-300">Upload your existing question files in various formats</p>
      </div>

      {/* Supported Formats */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle>Supported File Formats</CardTitle>
          <CardDescription>Choose from multiple file formats to import your questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportedFormats.map((format, index) => {
              const Icon = format.icon;
              return (
                <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{format.extension}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{format.description}</p>
                  <div className="mt-2">
                    <code className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                      {format.example.substring(0, 30)}...
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drop your files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports CSV, SQL, MD, and TXT files
              </p>
            </div>
            <Button 
              className="mt-4" 
              onClick={() => fileInputRef.current?.click()}
              disabled={importStatus === 'processing'}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.sql,.md,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => {
                  const FileIcon = getFileIcon(file.name);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={importStatus === 'processing'}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Import Button */}
          {files.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={processImport}
                disabled={importStatus === 'processing'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {importStatus === 'processing' ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Questions
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Status Messages */}
          {importStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300">Import completed successfully!</span>
            </div>
          )}

          {importStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300">Import failed. Please try again.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Format */}
      <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle>Sample CSV Format</CardTitle>
          <CardDescription>Use this format when creating CSV files</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            readOnly
            value={`Question,Option A,Option B,Option C,Option D,Correct Answer,Bloom's Level,Topic,Unit
"What is the primary purpose of React?","Building user interfaces","Database management","Server configuration","Network security","A","Understand (Level 2)","React Basics","Unit 1: Fundamentals"
"Which hook is used for state management?","useEffect","useState","useContext","useReducer","B","Remember (Level 1)","React Hooks","Unit 1: Fundamentals"`}
            className="font-mono text-sm min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportQuestions;
