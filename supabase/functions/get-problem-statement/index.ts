
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        const { slug } = await req.json()

        if (!slug) {
            return new Response(JSON.stringify({ error: 'Slug is required' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        // Check Premium Status
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('is_premium')
            .eq('id', user.id)
            .maybeSingle()

        if (profileError) {
            console.error("Profile check error", profileError);
            return new Response(JSON.stringify({ error: 'Failed to check profile', details: profileError }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            })
        }

        const isPremium = profile?.is_premium ?? false;

        // ... problem fetch ...

        const { data: problem, error: problemError } = await supabaseClient
            .from('problems')
            .select('id, is_premium')
            .eq('slug', slug)
            .single();

        if (problemError || !problem) {
            return new Response(JSON.stringify({ error: 'Problem not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        // Only block if problem is explicitly marked Premium AND user is NOT Premium
        const isProblemPremium = problem.is_premium;

        if (isProblemPremium && !isPremium) {
            return new Response(JSON.stringify({ error: 'Premium subscription required to view this problem', code: 'premium_required' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 403,
            })
        }

        // Fetch the Statement using Service Role Key (we need to bypass RLS)
        // Actually, createClient with auth context usually respects RLS. 
        // We explicitly set the policy to "false" (NO access).
        // So we need a PRIVILEGED client here to fetch the data, OR we grant access to the "authenticated" role but only via function?
        // No, standard pattern is: User calls function -> Function verifies logic -> Function uses SERVICE_ROLE key to fetch data.

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: statement, error: statementError } = await supabaseAdmin
            .from('problem_statements')
            .select('description, constraints, input_format, expected_output, starter_code')
            .eq('problem_id', problem.id)
            .single()

        if (statementError) {
            console.error("Statement error", statementError);
            return new Response(JSON.stringify({ error: 'Statement not found' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 404,
            })
        }

        return new Response(JSON.stringify(statement), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
