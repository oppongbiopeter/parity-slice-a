# PARITY — architecture conclusions

## Object model
Tenant, Principal, Session, Permission, Rbac, AuditTrail, Plan, Subscription, BoardDecision.
Super has tenant.* and must not have ticket.send.

## Multi-tenant (closed)
One Postgres, one schema, tenant_id on every tenant-scoped row, **RLS as the wall**.
Rejected: DB-per-tenant, schema-per-tenant, application-only WHERE filters.
Personal user = tenant type personal, seat cap 1. No wallet table.

## RBAC (closed)
Kinds are tenant-scoped: watch, personal, dealer, treasurer, compliance, orgadmin, super.
orgadmin cannot mint super. Session stores kind at login; change of seat requires Kill + re-login.
Check `rbac.allows(session, resource, action)` — not `if role == admin`.

## Also closed
One tenant per token. Billing vendor holds the card. Audit append-only. Soft-delete users/tenants. Quote age uses server/Accra clock. Client OOP does not replace RLS.
