import { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Play, Send } from "lucide-react";

const ProblemDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [code, setCode] = useState(`import numpy as np
from sklearn.linear_model import LinearRegression

def solve(X_train, y_train, X_test):
    """
    Implement a linear regression model
    
    Args:
        X_train: Training features (numpy array)
        y_train: Training labels (numpy array)
        X_test: Test features (numpy array)
    
    Returns:
        predictions: Predicted values for X_test
    """
    # Your code here
    model = LinearRegression()
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    
    return predictions
`);

  const handleRun = () => {
    toast({
      title: "Running tests...",
      description: "Executing your code against sample test cases",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Submission received!",
      description: "Your solution is being evaluated...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Problem Description */}
          <Card className="p-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-3">Linear Regression Basics</h1>
              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className="bg-easy/10 text-easy border-easy/20">
                  Easy
                </Badge>
                <Badge variant="outline">Regression</Badge>
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="examples" className="flex-1">Examples</TabsTrigger>
                <TabsTrigger value="solution" className="flex-1">Solution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Problem Statement</h3>
                  <p className="text-muted-foreground">
                    Implement a simple linear regression model to predict continuous values. 
                    Given training data with features X_train and labels y_train, train your model 
                    and make predictions on the test set X_test.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Constraints</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>You may use scikit-learn or implement from scratch</li>
                    <li>Training data: 1 ≤ n_samples ≤ 10,000</li>
                    <li>Features: 1 ≤ n_features ≤ 50</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Input Format</h3>
                  <p className="text-muted-foreground">
                    X_train: numpy array of shape (n_samples, n_features)<br />
                    y_train: numpy array of shape (n_samples,)<br />
                    X_test: numpy array of shape (n_test_samples, n_features)
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Expected Output</h3>
                  <p className="text-muted-foreground">
                    Return a numpy array of predictions with shape (n_test_samples,)
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Example 1</h3>
                  <Card className="p-4 bg-muted">
                    <pre className="text-sm">
{`X_train = [[1], [2], [3], [4]]
y_train = [2, 4, 6, 8]
X_test = [[5]]

Output: [10]`}
                    </pre>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Example 2</h3>
                  <Card className="p-4 bg-muted">
                    <pre className="text-sm">
{`X_train = [[1, 2], [2, 3], [3, 4]]
y_train = [5, 8, 11]
X_test = [[4, 5]]

Output: [14] (approximately)`}
                    </pre>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="solution" className="mt-4">
                <p className="text-muted-foreground">
                  Solve the problem to unlock the solution and explanation.
                </p>
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
              <Button onClick={handleRun} variant="outline" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Run Tests
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Solution
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
