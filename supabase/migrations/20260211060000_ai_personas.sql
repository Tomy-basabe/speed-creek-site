-- =============================================
-- AI Personas System: Tables + RLS + Trigger
-- =============================================

-- 1. AI Personas table
CREATE TABLE IF NOT EXISTS public.ai_personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'T.A.B.E. IA',
  avatar_emoji TEXT NOT NULL DEFAULT '🤖',
  description TEXT DEFAULT '',
  personality_prompt TEXT DEFAULT '',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. AI Chat Sessions table
CREATE TABLE IF NOT EXISTS public.ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_id UUID NOT NULL REFERENCES public.ai_personas(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Nueva conversación',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. AI Chat Messages table
CREATE TABLE IF NOT EXISTS public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_personas_user ON public.ai_personas(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user ON public.ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_persona ON public.ai_chat_sessions(persona_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON public.ai_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_created ON public.ai_chat_messages(session_id, created_at);

-- RLS
ALTER TABLE public.ai_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Personas: users can CRUD their own
CREATE POLICY "Users can view own personas" ON public.ai_personas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own personas" ON public.ai_personas
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own personas" ON public.ai_personas
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own non-default personas" ON public.ai_personas
  FOR DELETE USING (auth.uid() = user_id AND is_default = false);

-- Chat sessions: users can CRUD their own
CREATE POLICY "Users can view own sessions" ON public.ai_chat_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON public.ai_chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.ai_chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.ai_chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Chat messages: users can CRUD via session ownership
CREATE POLICY "Users can view messages in own sessions" ON public.ai_chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ai_chat_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users can create messages in own sessions" ON public.ai_chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.ai_chat_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );
CREATE POLICY "Users can delete messages in own sessions" ON public.ai_chat_messages
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.ai_chat_sessions s WHERE s.id = session_id AND s.user_id = auth.uid())
  );

-- Service role bypass for edge functions
CREATE POLICY "Service role full access personas" ON public.ai_personas
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access sessions" ON public.ai_chat_sessions
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access messages" ON public.ai_chat_messages
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
