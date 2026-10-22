CREATE TABLE public.membership_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 20),
  email text CHECK (email IS NULL OR char_length(email) <= 255),
  plan text NOT NULL CHECK (plan IN ('basic','pro','elite')),
  goal text CHECK (goal IS NULL OR char_length(goal) <= 500),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.membership_requests TO anon, authenticated;
GRANT ALL ON public.membership_requests TO service_role;
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a request" ON public.membership_requests FOR INSERT TO anon, authenticated WITH CHECK (true);