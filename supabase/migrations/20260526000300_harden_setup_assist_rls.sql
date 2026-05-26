drop policy if exists "Users can manage their own setup assist requests"
on public.setup_assist_requests;

create policy "Users can create their own setup assist requests"
on public.setup_assist_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and request_status = 'new'
  and paid_status = 'unpaid'
  and stripe_payment_reference is null
  and admin_notes is null
);
