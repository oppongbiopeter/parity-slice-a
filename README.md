# PARITY — Slice A

Private working repo for a Ghana-focused **currency and interest-rate board**.
Software only. **No custody. No deposits. No crypto. No HFT.**

Interactive preview: open [`parity_app_preview.html`](parity_app_preview.html) in a browser.

## What ships in this slice

- Calculator / triangle board (both loops, bid/ask only)
- Outcome preview before any send
- Connect + Kill to an IBKR **paper** account the user already owns
- Settlement gate: Ghana interbank **T+2** is not bureau cash **T+0**
- Ghana live keys **off** until counsel initials

## What does not ship

- Vendor-held money
- Bureau send
- Nigeria IBKR adapter
- Session auto-ex / HFT burst
- Institution desk (separate spec, later SOW)

## Layout

| Path | Role |
|---|---|
| `parity_app_preview.html` | Clickable phone preview |
| `handoff/engineering/app_config.json` | Country packs, limits, settlement rules |
| `handoff/engineering/pricing_engine.openapi.yaml` | In-process pricing shapes |
| Word / Excel / PowerPoint specs | Live in the project artifacts folder (binary). Upload from there if you want them in git. |

## Product law

Vendor never holds client money. Path A1: user-run IBKR Client Portal Gateway on a laptop. Quote older than 3 seconds cannot send. `M-1` must beat fees or the headline is NO TRIANGLE.
