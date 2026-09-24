# PARITY — database and tenancy

See ARCHITECTURE.md for the closed decisions.

Every customer row carries tenant_id. RLS in live Postgres. Super bypasses RLS on a separate DB role; every statement audited. Super cannot place a ticket.

Tables: tenants, users, sessions, plans, subscriptions, org_seats, audit_log, tickets, tutor_settings. No wallet table.

Demo: personal 123456; desk GCB/DEALER01/123456; org admin GCB/ADMIN01/123456; super SUPER/123456.
