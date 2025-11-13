import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Play, Send, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  constraints: string;
  input_format: string;
  expected_output: string;
  starter_code: string;
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  isSample: boolean;
  input?: any;
  expectedOutput?: any;
  actualOutput?: any;
  error?: string;
}

const ProblemDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    fetchProblem();
  }, [slug]);

  const fetchProblem = async () => {
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setProblem(data as Problem);
      setCode(data.starter_code || "");
    } catch (error) {
      console.error('Error fetching problem:', error);
      toast({
        title: "Error loading problem",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    if (!problem) return;
    
    setRunning(true);
    setTestResults([]);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to run code",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: { code, problemId: problem.id },
      });

      if (error) throw error;

      setTestResults(data.results || []);
      
      if (data.status === 'accepted') {
        toast({
          title: "All tests passed! 🎉",
          description: `Execution time: ${data.executionTime}ms`,
        });
      } else {
        toast({
          title: "Some tests failed",
          description: "Check the results below",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error running code:', error);
      toast({
        title: "Execution failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    await handleRun();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Problem not found</p>
          </Card>
        </div>
      </div>
    );
  }

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-easy/10 text-easy border-easy/20";
      case "medium": return "bg-medium/10 text-medium border-medium/20";
      case "hard": return "bg-hard/10 text-hard border-hard/20";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/topics">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Problem Description */}
          <Card className="p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-3">{problem.title}</h1>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className={getDifficultyBg(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="results" className="flex-1">Test Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Problem Statement</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {problem.description}
                  </p>
                </div>

                {problem.constraints && (
                  <div>
                    <h3 className="font-semibold mb-2">Constraints</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {problem.constraints}
                    </p>
                  </div>
                )}

                {problem.input_format && (
                  <div>
                    <h3 className="font-semibold mb-2">Input Format</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {problem.input_format}
                    </p>
                  </div>
                )}

                {problem.expected_output && (
                  <div>
                    <h3 className="font-semibold mb-2">Expected Output</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {problem.expected_output}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="results" className="space-y-4 mt-4">
                {testResults.length === 0 ? (
                  <p className="text-muted-foreground">
                    Run your code to see test results here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <Card key={result.testCaseId} className={`p-4 ${result.passed ? 'border-success' : 'border-destructive'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">
                            {result.isSample ? 'Sample ' : 'Hidden '}Test Case {index + 1}
                          </h4>
                          <Badge variant={result.passed ? "default" : "destructive"}>
                            {result.passed ? "PASSED" : "FAILED"}
                          </Badge>
                        </div>
                        {result.isSample && (
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-muted-foreground">Input:</span>
                              <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
                                {JSON.stringify(result.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Expected:</span>
                              <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
                                {JSON.stringify(result.expectedOutput, null, 2)}
                              </pre>
                            </div>
                            {!result.passed && (
                              <div>
                                <span className="text-muted-foreground">Your Output:</span>
                                <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-x-auto">
                                  {JSON.stringify(result.actualOutput, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                        {result.error && (
                          <p className="text-sm text-destructive mt-2">{result.error}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right Panel - Code Editor */}
          <Card className="p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Code Editor</h3>
              <p className="text-sm text-muted-foreground">Python 3.9</p>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 font-mono text-sm resize-none mb-4"
              placeholder="Write your solution here..."
            />

            <div className="flex gap-2">
              <Button 
                onClick={handleRun} 
                variant="outline" 
                className="flex-1"
                disabled={running}
              >
                {running ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1"
                disabled={running}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
