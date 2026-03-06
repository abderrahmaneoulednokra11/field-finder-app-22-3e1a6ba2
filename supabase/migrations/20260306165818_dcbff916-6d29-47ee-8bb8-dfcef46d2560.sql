
ALTER TYPE public.reservation_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE public.reservation_status ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE public.reservation_status ADD VALUE IF NOT EXISTS 'rejected';
