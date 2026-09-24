# PARITY — database and tenancy

Every customer row carries tenant_id. Personal cannot read a bank. GCB cannot read CAL. Super reads all and cannot place a ticket.

## Demo logins

- Personal PIN `123456`
- Desk `GCB` / `DEALER01` / `123456`
- Org admin `GCB` / `ADMIN01` / `123456`
- Super `SUPER` / `123456`

## Tables

tenants, users, sessions, plans, subscriptions, org_seats, audit_log, tickets, tutor_settings.

No PARITY wallet table. Card data stays at the billing vendor (`vendor_ref` only).

Audit on login, seat create, plan edit, subscribe, connect, arm, kill, send attempt.
