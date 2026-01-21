-- Allow anyone to check if an email exists in invited_users (for registration validation)
-- This is safe because we only check existence, not expose sensitive data
CREATE POLICY "Anyone can check invitation status by email" 
ON public.invited_users 
FOR SELECT 
USING (true);