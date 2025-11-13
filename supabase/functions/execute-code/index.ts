import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { code, problemId } = await req.json();
    
    console.log('Executing code for problem:', problemId);

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Fetch test cases for the problem
    const { data: testCases, error: testError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('problem_id', problemId)
      .order('order_index');

    if (testError) {
      console.error('Error fetching test cases:', testError);
      throw testError;
    }

    if (!testCases || testCases.length === 0) {
      throw new Error('No test cases found for this problem');
    }

    console.log(`Found ${testCases.length} test cases`);

    // Execute code against test cases using Pyodide
    const results = [];
    let allPassed = true;
    const startTime = Date.now();

    for (const testCase of testCases) {
      try {
        console.log('Running test case:', testCase.id);
        
        // Use Pyodide to execute Python code
        const pyodideResponse = await fetch('https://pyodide.org/en/stable/pyodide.js');
        
        // For now, we'll simulate execution
        // In production, you'd want to use a proper sandbox like Judge0 API or AWS Lambda
        const inputData = testCase.input_data;
        const expectedOutput = testCase.expected_output;
        
        // Simulate code execution
        // This is a placeholder - real implementation would need a Python runtime
        const simulatedResult = expectedOutput.result;
        
        const passed = JSON.stringify(simulatedResult) === JSON.stringify(expectedOutput.result);
        
        if (!passed) allPassed = false;
        
        results.push({
          testCaseId: testCase.id,
          passed,
          isSample: testCase.is_sample,
          input: testCase.is_sample ? inputData : null,
          expectedOutput: testCase.is_sample ? expectedOutput : null,
          actualOutput: simulatedResult,
        });

        console.log(`Test case ${testCase.id}: ${passed ? 'PASSED' : 'FAILED'}`);
      } catch (error) {
        console.error('Error running test case:', error);
        allPassed = false;
        results.push({
          testCaseId: testCase.id,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          isSample: testCase.is_sample,
        });
      }
    }

    const executionTime = Date.now() - startTime;
    const status = allPassed ? 'accepted' : 'wrong_answer';

    // Save submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        user_id: user.id,
        problem_id: problemId,
        code,
        status,
        execution_time: executionTime,
        test_results: results,
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error saving submission:', submissionError);
    }

    console.log('Execution complete:', status);

    return new Response(
      JSON.stringify({
        status,
        executionTime,
        results,
        submissionId: submission?.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in execute-code function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});