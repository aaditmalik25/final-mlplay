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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center bg-black/60 backdrop-blur-xl border-white/10">
            <p className="text-white/70">Problem not found</p>
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navigation />
      
      {/* Animated 3D background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <Button asChild variant="ghost" className="mb-4 text-white hover:bg-white/10">
          <Link to="/topics">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Topics
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
          {/* Left Panel - Problem Description */}
          <Card className="p-6 overflow-y-auto bg-black/60 backdrop-blur-xl border-white/10" style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-3 text-white">{problem.title}</h1>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                  {problem.difficulty}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full bg-black/50 border border-white/10">
                <TabsTrigger value="description" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">Description</TabsTrigger>
                <TabsTrigger value="results" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black">Test Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2 text-white">Problem Statement</h3>
                  <p className="text-white/70 whitespace-pre-wrap">
                    {problem.description}
                  </p>
                </div>

                {problem.constraints && (
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Constraints</h3>
                    <p className="text-white/70 whitespace-pre-wrap">
                      {problem.constraints}
                    </p>
                  </div>
                )}

                {problem.input_format && (
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Input Format</h3>
                    <p className="text-white/70 whitespace-pre-wrap">
                      {problem.input_format}
                    </p>
                  </div>
                )}

                {problem.expected_output && (
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Expected Output</h3>
                    <p className="text-white/70 whitespace-pre-wrap">
                      {problem.expected_output}
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="results" className="space-y-4 mt-4">
                {testResults.length === 0 ? (
                  <p className="text-white/70">
                    Run your code to see test results here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <Card key={result.testCaseId} className={`p-4 bg-black/40 border ${result.passed ? 'border-white/30' : 'border-red-500/50'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white">
                            {result.isSample ? 'Sample ' : 'Hidden '}Test Case {index + 1}
                          </h4>
                          <Badge variant={result.passed ? "default" : "destructive"} className={result.passed ? "bg-white text-black" : ""}>
                            {result.passed ? "PASSED" : "FAILED"}
                          </Badge>
                        </div>
                        {result.isSample && (
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="text-white/70">Input:</span>
                              <pre className="bg-black/50 p-2 rounded mt-1 text-xs overflow-x-auto text-white border border-white/10">
                                {JSON.stringify(result.input, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <span className="text-white/70">Expected:</span>
                              <pre className="bg-black/50 p-2 rounded mt-1 text-xs overflow-x-auto text-white border border-white/10">
                                {JSON.stringify(result.expectedOutput, null, 2)}
                              </pre>
                            </div>
                            {!result.passed && (
                              <div>
                                <span className="text-white/70">Your Output:</span>
                                <pre className="bg-black/50 p-2 rounded mt-1 text-xs overflow-x-auto text-white border border-white/10">
                                  {JSON.stringify(result.actualOutput, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                        {result.error && (
                          <p className="text-sm text-red-400 mt-2">{result.error}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right Panel - Code Editor */}
          <Card className="p-6 flex flex-col bg-black/60 backdrop-blur-xl border-white/10" style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}>
            <div className="mb-4">
              <h3 className="font-semibold text-lg text-white">Code Editor</h3>
              <p className="text-sm text-white/60">Python 3.9</p>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 font-mono text-sm resize-none mb-4 bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
              placeholder="Write your solution here..."
            />

            <div className="flex gap-2">
              <Button 
                onClick={handleRun} 
                variant="outline" 
                className="flex-1 border-white/20 text-white hover:bg-white/10"
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
                className="flex-1 bg-white text-black hover:bg-white/90"
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
