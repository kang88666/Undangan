-- Events Table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  cover_color VARCHAR(7) DEFAULT '#FF6B6B',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invitations Table (UTAMA - Per Link Unik)
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20),
  unique_link UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  qr_code TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  rsvp_count INTEGER DEFAULT 1,
  rsvp_names TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RSVP Responses Table
CREATE TABLE public.rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  response_status VARCHAR(20) NOT NULL,
  attending_count INTEGER NOT NULL,
  dietary_preferences TEXT,
  special_requests TEXT,
  responded_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_invitations_event_id ON public.invitations(event_id);
CREATE INDEX idx_invitations_unique_link ON public.invitations(unique_link);
CREATE INDEX idx_invitations_status ON public.invitations(status);
CREATE INDEX idx_rsvp_invitation_id ON public.rsvp_responses(invitation_id);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own events"
  ON public.events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create events"
  ON public.events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view invitations for their events"
  ON public.invitations FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view invitation by link"
  ON public.invitations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit RSVP"
  ON public.rsvp_responses FOR INSERT
  WITH CHECK (true);