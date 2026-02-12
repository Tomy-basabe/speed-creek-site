
import { createClient } from '@supabase/supabase-js';

// Get credentials from process.env or hardcode them temporarily for this script
const supabaseUrl = 'https://ndmjrcinfugswtlknebl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbWpyY2luZnVnc3d0bGtuZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MjQzNTQsImV4cCI6MjA4NjQwMDM1NH0.WyraOyLFgUPz-PncB2qTYHwY60c0opLB0yWLc_6iBcs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
    const email = 'tomasbasabe.utn@gmail.com';
    const password = 'TOMAS2812';

    console.log(`Creating user ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nombre: 'Tomas Basabe', // Optional initial metadata
            }
        }
    });

    if (error) {
        console.error('Error creating user:', JSON.stringify(error, null, 2));
        process.exit(1);
        return;
    }

    console.log('User created successfully:', data.user?.id);
    console.log('Session:', data.session ? 'Created (Auto-confirmed)' : 'Waiting for confirmation');
    process.exit(0);
}

createAdminUser().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
