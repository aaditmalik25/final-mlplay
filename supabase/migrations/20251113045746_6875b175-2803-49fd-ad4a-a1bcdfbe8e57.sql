-- Create topics table for organizing learning paths
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create problems table
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description TEXT NOT NULL,
  constraints TEXT,
  input_format TEXT,
  expected_output TEXT,
  starter_code TEXT NOT NULL,
  solution_code TEXT,
  solution_explanation TEXT,
  acceptance_rate DECIMAL(5,2) DEFAULT 0,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create test_cases table
CREATE TABLE public.test_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  expected_output JSONB NOT NULL,
  is_sample BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT true,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded')),
  execution_time INTEGER,
  memory_used INTEGER,
  test_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topics (public read)
CREATE POLICY "Topics are viewable by everyone"
  ON public.topics FOR SELECT
  USING (true);

-- RLS Policies for problems (public read)
CREATE POLICY "Problems are viewable by everyone"
  ON public.problems FOR SELECT
  USING (true);

-- RLS Policies for test_cases (only sample cases visible to users)
CREATE POLICY "Sample test cases are viewable by everyone"
  ON public.test_cases FOR SELECT
  USING (is_sample = true);

-- RLS Policies for submissions (users can view and create their own)
CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_problems_topic ON public.problems(topic_id);
CREATE INDEX idx_test_cases_problem ON public.test_cases(problem_id);
CREATE INDEX idx_submissions_user ON public.submissions(user_id);
CREATE INDEX idx_submissions_problem ON public.submissions(problem_id);

-- Create trigger for updated_at
CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample topics
INSERT INTO public.topics (name, description, slug, order_index, icon) VALUES
('Statistics Fundamentals', 'Learn the basics of statistics and probability', 'statistics-fundamentals', 1, 'BarChart3'),
('Data Preprocessing', 'Master data cleaning, normalization, and feature engineering', 'data-preprocessing', 2, 'Filter'),
('Supervised Learning', 'Classification and regression algorithms', 'supervised-learning', 3, 'Target'),
('Unsupervised Learning', 'Clustering and dimensionality reduction', 'unsupervised-learning', 4, 'Layers'),
('Neural Networks', 'Deep learning and neural network architectures', 'neural-networks', 5, 'Brain'),
('Advanced Deep Learning', 'CNNs, RNNs, Transformers, and more', 'advanced-deep-learning', 6, 'Zap');

-- Insert sample problems for Statistics Fundamentals
INSERT INTO public.problems (topic_id, title, slug, difficulty, description, constraints, input_format, expected_output, starter_code, order_index) 
SELECT 
  id,
  'Calculate Mean and Standard Deviation',
  'calculate-mean-std',
  'easy',
  'Given a list of numbers, calculate the mean (average) and standard deviation.',
  '• 1 ≤ len(data) ≤ 10,000\n• All numbers are real values',
  'data: List of numbers',
  'Return a tuple (mean, std_dev)',
  'import numpy as np

def solve(data):
    """
    Calculate mean and standard deviation
    
    Args:
        data: List or array of numbers
    
    Returns:
        tuple: (mean, standard_deviation)
    """
    # Your code here
    pass
',
  1
FROM public.topics WHERE slug = 'statistics-fundamentals';

-- Insert test cases for the statistics problem
INSERT INTO public.test_cases (problem_id, input_data, expected_output, is_sample, is_hidden, order_index)
SELECT 
  id,
  '{"data": [1, 2, 3, 4, 5]}'::jsonb,
  '{"result": [3.0, 1.4142135623730951]}'::jsonb,
  true,
  false,
  1
FROM public.problems WHERE slug = 'calculate-mean-std';

INSERT INTO public.test_cases (problem_id, input_data, expected_output, is_sample, is_hidden, order_index)
SELECT 
  id,
  '{"data": [10, 20, 30, 40, 50]}'::jsonb,
  '{"result": [30.0, 14.142135623730951]}'::jsonb,
  false,
  true,
  2
FROM public.problems WHERE slug = 'calculate-mean-std';

-- Insert Linear Regression problem
INSERT INTO public.problems (topic_id, title, slug, difficulty, description, constraints, input_format, expected_output, starter_code, order_index)
SELECT 
  id,
  'Linear Regression Implementation',
  'linear-regression',
  'easy',
  'Implement a simple linear regression model to predict continuous values. Given training data with features X_train and labels y_train, train your model and make predictions on the test set X_test.',
  '• 1 ≤ n_samples ≤ 10,000\n• 1 ≤ n_features ≤ 50\n• You may use scikit-learn or implement from scratch',
  'X_train: numpy array of shape (n_samples, n_features)\ny_train: numpy array of shape (n_samples,)\nX_test: numpy array of shape (n_test_samples, n_features)',
  'Return a numpy array of predictions with shape (n_test_samples,)',
  'import numpy as np
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
    pass
',
  2
FROM public.topics WHERE slug = 'supervised-learning';

-- Insert test cases for linear regression
INSERT INTO public.test_cases (problem_id, input_data, expected_output, is_sample, is_hidden, order_index)
SELECT 
  id,
  '{"X_train": [[1], [2], [3], [4]], "y_train": [2, 4, 6, 8], "X_test": [[5]]}'::jsonb,
  '{"result": [10.0]}'::jsonb,
  true,
  false,
  1
FROM public.problems WHERE slug = 'linear-regression';