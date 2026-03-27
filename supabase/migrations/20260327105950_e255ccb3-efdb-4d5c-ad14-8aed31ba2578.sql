
-- Recreate trigger for new user signup (profile + role creation)
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Recreate trigger for reservation conflict checking
CREATE OR REPLACE TRIGGER check_reservation_conflict_trigger
  BEFORE INSERT OR UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.check_reservation_conflict();

-- Recreate trigger for updated_at on profiles
CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Recreate trigger for updated_at on stadiums
CREATE OR REPLACE TRIGGER update_stadiums_updated_at
  BEFORE UPDATE ON public.stadiums
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Recreate trigger for updated_at on reservations
CREATE OR REPLACE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
