# PARITY

A phone-sized board that answers one question:

**If I put money on this trade, what happens — and is that number actually locked?**

It is software. It is not a bank, not a fund, and not a wallet. It never holds your cedis, dollars, bonds, or coins.

Open the clickable preview: [parity_app_preview.html](parity_app_preview.html)

---

## Who it is for

| You | How you come in | What you can do |
|---|---|---|
| An individual | Device PIN (demo `123456`) | See the board. Connect a broker **you already own**. Paper send only. |
| A bank / bureau desk | Bank `GCB` / staff `DEALER01` / PIN `123456` | Same board. Human RFQ shell. Own books only. |
| Anyone curious | Watch only — no PIN | Calculator. Nothing sends. |

There is no deposit-with-us screen.

---

## What the boards do

**Currency triangle**  
Three prices should agree. The app buys at the ask and sells at the bid, both directions, then subtracts fees. If nothing is left, it says **NO TRIANGLE**.

**Rates / carry**  
A Ghana bill versus a dollar rate versus a forward. Only **LOCKED** if a real forward exists. Otherwise it shows if the cedi does not move and if the cedi drops 5%.

**Bonds / T-bills**  
Ghana bills live in **your** CSD account via a bank or primary dealer. Same bill, two GFIM prices can be a lock after fees. A steep curve is a **bet**, not a lock. A cedi bond versus a USD Eurobond is blocked. Bond-futures cash-and-carry is off — there is no Ghana future to deliver into.

**Crypto**  
Bring-your-own exchange keys later. The app never holds coins. Same coin on two books: it shows the dollar figure **if both fill now**, and warns that a lag or a withdraw turns you into just long coin. Funding rates are **not locked**. An exchange book versus an on-chain wallet is blocked. Ghana live send stays off until counsel.

---

## The rule before any send

1. Same instrument (same bill, same coin, same FX pair — not looks similar).
2. Same settlement clock (Ghana interbank is **T+2**; bureau cash is today; CSD debt is T+2; an auction is often T+1).
3. You have seen the outcome and ticked the box.
4. Personal paper is armed with a PIN. Live Ghana keys and live crypto send are **off** until counsel says otherwise.

Most days the honest screen is **no trade**. That is the product working.

---

## What this slice does not do

- Hold client money or client securities
- Solicit the public for a pool
- Auto-fire or high-frequency burst send
- Treat a bureau window as the interbank
- Treat a Eurobond as a local CSD bond
- Pretend home Wi-Fi is a London matching engine

Board speed is on. Machine speed (HFT) is a locked door.

---

## How to click the preview

1. Open `parity_app_preview.html` in a browser.
2. Choose Personal, Desk, or Watch.
3. Personal path: PIN → Home → Triangle / Bond / Crypto → Settle → Ticket.
4. To send paper: Connect → scroll the four sentences → Paper → scopes → Arm → set **both** settlement legs to IBKR paper → tick the outcome box.

Demo PIN is always `123456`. Wrong PIN is rejected on purpose.

---

## Ghana in one paragraph

Licensed banks deal FX with each other and settle **two business days later**. Quotes on the tape may sit up to 30 minutes. T-bills are bought through a primary dealer into a CSD account, not by this app. A number on a phone is not cash in hand.

---

## Repo

Private working copy for Slice A.

| File | What it is |
|---|---|
| `parity_app_preview.html` | The whole app mock — logins and every board |
| `handoff/engineering/app_config.json` | Country packs, limits, settlement and crypto flags |
| `handoff/engineering/pricing_engine.openapi.yaml` | Shapes the real app should implement |
| Word / Excel / PowerPoint specs | Live in the project artifacts folder (binary). |

Not coded yet. Counsel letter and legal entity stay founder-owned. Paper IBKR only.

---

## Simple summary

PARITY shows individuals and desks which FX, rate, bond, or crypto gaps are still there **after costs**, and whether that leftover is locked or just a hope. You trade in an account you already have. We never take the money.
