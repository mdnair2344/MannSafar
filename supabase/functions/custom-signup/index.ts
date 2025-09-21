import { createClient } from "npm:@supabase/supabase-js@2.28.0";

// Get secrets and initialize the client at the top level
const projectUrl = Deno.env.get('PROJECT_URL');
const serviceKey = Deno.env.get('PROJECT_SERVICE_ROLE_KEY');

if (!projectUrl || !serviceKey) {
  throw new Error('One or more Supabase secrets are not set in the function environment.');
}

const supabaseAdmin = createClient(projectUrl, serviceKey);
console.log('Custom signup function initialized.');

// Define CORS helper functions
const allowedOrigins = [
  'http://localhost:8080',
  'https://mannsafar-youthmentalwellness.onrender.com/'
];

function getOrigin(req) {
  const origin = req.headers.get('Origin');
  return origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
}

function getCorsHeaders(origin) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info, apikey');
  headers.set('Access-Control-Max-Age', '86400');
  return headers;
}

// Start the server to handle requests
Deno.serve(async (req) => {
  const origin = getOrigin(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      const { email, password, display_name, user_type, student_email } = body;
      
      // Step 1: Create the user in the Auth schema
      const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          display_name,
          user_type,
          student_email
        }
      });
      if (createError) throw createError;

      // Step 2 (REMOVED): The manual insert into 'profiles' is now gone.
      // Your database trigger will handle creating the profile automatically.
      
      const headers = getCorsHeaders(origin);
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ message: 'Success' }), { status: 200, headers });

    } catch (err) {
      console.error('Error during POST request:', err);
      const headers = getCorsHeaders(origin);
      headers.set('Content-Type', 'application/json');
      return new Response(JSON.stringify({ error: err?.message ?? String(err) }), { status: 500, headers });
    }
  }

  return new Response('Method Not Allowed', { status: 405, headers: getCorsHeaders(origin) });
});
