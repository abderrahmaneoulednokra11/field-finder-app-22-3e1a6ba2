
-- Update default status to pending
ALTER TABLE public.reservations ALTER COLUMN status SET DEFAULT 'pending'::reservation_status;

-- Update the conflict check trigger to block on pending and approved
CREATE OR REPLACE FUNCTION public.check_reservation_conflict()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF (SELECT status FROM public.stadiums WHERE id = NEW.stadium_id) = 'maintenance' THEN
    RAISE EXCEPTION 'Stadium is currently under maintenance';
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM public.reservations
    WHERE stadium_id = NEW.stadium_id
      AND date = NEW.date
      AND status IN ('pending', 'approved', 'confirmed')
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
      AND start_time < NEW.end_time
      AND end_time > NEW.start_time
  ) THEN
    RAISE EXCEPTION 'This time slot is already reserved';
  END IF;
  
  RETURN NEW;
END;
$function$;
