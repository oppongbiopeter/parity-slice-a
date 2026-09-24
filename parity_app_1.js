const S = {
  party: null, country: "GH", pinOk: false, instBank: "", instStaff: "", instRole: "dealer",
  connected: false, armed: false, consented: false, scrolled: false,
  boxes: [false,false,false,false], ack: false,
  quotes: { eurusd_b:1.1428, eurusd_a:1.1432, gbpusd_b:1.3314, gbpusd_a:1.3320, eurgbp_b:0.8579, eurgbp_a:0.8584 },
  start: 2000, fee: 0.0004, legA: "IBKR_PAPER", legB: "BUREAU_CASH", loginErr: "",
  bondCase: "SAME_ISIN", cryptoCase: "SPATIAL",
  bAsk: 99.10, bBid: 99.25, bFee: 0.0008, bFace: 50000,
  cBid: 114200, cAsk: 114350, cFee: 0.0015, cQty: 0.2,
  mid: 11.50, bank: 11.85, pipe: 11.62, sendAmt: 2000, quoteLeft: 60
};
const TITLES = {};
function setTitle(id, t) { TITLES[id] = t; }
function brandLine() {
  if (S.party === "personal") return "PARITY · PERSONAL · " + (S.connected ? "PAPER" : "WATCH");
  if (S.party === "institution") return "PARITY · DESK · " + (S.instBank || "BANK");
  if (S.party === "watch") return "PARITY · WATCH ONLY";
  return "PARITY";
}
function whoLine() {
  if (S.party === "personal") return S.country + " · individual · we do not hold your money";
  if (S.party === "institution") return (S.instStaff || "staff") + " · " + S.instRole + " · own books only";
  if (S.party === "watch") return "No broker session";
  return "Choose a party";
}
function tabsFor() {
  if (!S.party) return [["gate","Home"]];
  if (S.party === "watch") return [["whome","Home"],["triangle","Triangle"],["corridors","Pipes"],["bond","Bond"],["gate","Leave"]];
  if (S.party === "personal") return [["phome","Home"],["triangle","Triangle"],["corridors","Pipes"],["bond","Bond"],["account","Account"]];
  return [["ihome","Desk"],["triangle","Triangle"],["corridors","Pipes"],["bond","Bond"],["account","Account"]];
}
function bondPreview(c) {
  const face = S.bFace, fee = S.bFee, ask = S.bAsk, bid = S.bBid;
  const net = face * bid / 100 - face * ask / 100 - (face * ask / 100 + face * bid / 100) * fee;
  if (c === "SAME_ISIN") return { headline: net > 0 ? "LOCKED after costs — same ISIN" : "NO TRADE — spread is inside fees", ok: net > 0, lockedUsd: net, sentence: net > 0 ? "Same bill, two GFIM prices." : "Fees eat the spread." };
  if (c === "CURVE") return { headline: "NOT LOCKED — curve bet", ok:false, lockedUsd: null, sentence: "91-day vs 364-day is a view on rates." };
  if (c === "EURO") return { headline: "BLOCK — different instrument", ok:false, lockedUsd: null, sentence: "Cedi CSD bond is not a USD Eurobond." };
  return { headline: "LOCKED MODULE OFF — no Ghana bond future", ok:false, lockedUsd: null, sentence: "No future to deliver into." };
}
function cryptoPreview(c) {
  const net = S.cQty * S.cBid - S.cQty * S.cAsk - (S.cQty * S.cBid + S.cQty * S.cAsk) * S.cFee;
  if (c === "SPATIAL") return { headline: net > 0 ? "GROSS EDGE — still NOT LOCKED until both books fill" : "NO TRADE — fees eat the cross", ok:false, lockedUsd: net, sentence: net > 0 ? "Only if withdraw and the second book stay put." : "Cross is inside fees." };
  if (c === "TRI") return { headline: "SAME as FX triangle — bid/ask both loops", ok:false, lockedUsd: null, sentence: "Use the Triangle tab math." };
  if (c === "FUND") return { headline: "NOT LOCKED — funding path", ok:false, lockedUsd: null, sentence: "Funding can flip." };
  return { headline: "BLOCK — CEX book is not your chain wallet", ok:false, lockedUsd: null, sentence: "A transfer is not a second price." };
}
function triangleMath(q, start, fee) {
  const mCw = (q.eurgbp_b * q.gbpusd_b) / q.eurusd_a;
  const mCcw = q.eurusd_b / (q.gbpusd_a * q.eurgbp_a);
  const feeTake = 3 * fee;
  const netCw = start * (mCw - 1) - start * feeTake;
  const netCcw = start * (mCcw - 1) - start * feeTake;
  const best = Math.max(netCw, netCcw);
  let decision = "NO TRIANGLE";
  if (best > 0 && (Math.max(mCw, mCcw) - 1) > feeTake) decision = "TRIANGLE — after costs";
  else if (Math.max(mCw, mCcw) > 1) decision = "GROSS ONLY — fees eat it";
  return { netCw, netCcw, best, decision };
}
function settleInfo(code) {
  return ({ IBKR_PAPER:{clock:"Simulated T+0"}, IBKR_LIVE:{clock:"Broker spot, often T+2"}, INTERBANK_T2:{clock:"Ghana interbank T+2"}, BOG_AUCTION:{clock:"Auction T+2"}, BUREAU_CASH:{clock:"Cash notes T+0"}, CSD_T2:{clock:"GFIM / CSD T+2"}, CSD_PRIMARY:{clock:"T-bill auction via PD"}, EUROBOND:{clock:"USD Eurobond"}, CEX_SPOT:{clock:"Exchange A"}, CEX_B:{clock:"Exchange B"}, ONCHAIN:{clock:"On-chain"}, PAPSS:{clock:"PAPSS via your bank ~120s"} })[code];
}
function settleGate(a,b) {
  const same = a===b, bothPaper = a==="IBKR_PAPER" && b==="IBKR_PAPER";
  let decision = "BLOCK — two different settlement clocks", ok = false;
  if (bothPaper) { decision = "PAPER ONLY — same rail"; ok = true; }
  else if (a==="BUREAU_CASH" || b==="BUREAU_CASH") decision = "BLOCK — bureau cash is not interbank T+2";
  else if (a==="EUROBOND" || b==="EUROBOND") decision = "BLOCK — Eurobond is not a cedi CSD bond";
  else if (a==="PAPSS" || b==="PAPSS") decision = "WATCH — PAPSS is your bank's rail, not ours";
  else if (same && a==="INTERBANK_T2") decision = "WATCH — T+2 rail, live send locked in GH";
  else if (same && a==="CSD_T2") decision = "WATCH — same CSD T+2, no send in Slice A";
  else if (!same) decision = "BLOCK — legs would not meet on one date";
  return { A:settleInfo(a), B:settleInfo(b), same, ok, decision };
}
function num(id, def) { const el = document.getElementById(id); const v = el ? parseFloat(el.value) : def; return Number.isFinite(v) ? v : def; }
function go(id) {
  document.getElementById("title").textContent = TITLES[id] || id;
  document.getElementById("brand").textContent = brandLine();
  document.getElementById("who").textContent = whoLine();
  document.getElementById("screen").innerHTML = (SCREENS[id] || SCREENS.gate)();
  document.getElementById("screen").scrollTop = 0;
  renderTabs(id); renderNav(id); bind(id);
}
function renderTabs(id) {
  const bar = document.getElementById("tabs");
  bar.innerHTML = tabsFor().map(([k,l]) => `<button data-go="${k}" class="${k===id?"on":""}">${l}</button>`).join("");
  bar.querySelectorAll("button").forEach(b => b.onclick = () => go(b.dataset.go));
}
function renderNav(id) {
  const items = [["gate","Role / login"],["plogin","Personal PIN"],["ilogin","Institution login"],["phome","Personal home"],["ihome","Desk home"],["whome","Watch home"],["triangle","Triangle"],["corridors","Pipes"],["bond","Bond"],["crypto","Crypto"],["settle","Settlement"],["ticket","Ticket"],["connect","Connect"],["account","Account"],["law","Law pack"]];
  const nav = document.getElementById("nav");
  nav.innerHTML = items.map(([k,l]) => `<button data-go="${k}" class="${k===id?"on":""}">${l}</button>`).join("");
  nav.querySelectorAll("button").forEach(b => b.onclick = () => go(b.dataset.go));
}
const SCREENS = {};
function screen(id, title, fn) { setTitle(id, title); SCREENS[id] = fn; }
screen("gate", "Who is this for?", () => `
  <div class="banner navy">Slice A frozen · Ghana law first · no custody</div>
  <div class="card"><p style="font-weight:700;color:var(--navy)">Personal</p><button class="btn primary" data-go="plogin">Sign in as an individual</button></div>
  <div class="card"><p style="font-weight:700;color:var(--navy)">Institution desk</p><button class="btn ghost" data-go="ilogin">Sign in as a desk</button></div>
  <div class="card"><p style="font-weight:700;color:var(--navy)">Watch only</p><button class="btn ghost" id="watch">Continue without signing in</button></div>`);
screen("plogin", "Personal sign-in", () => `
  <div class="card">
    <p class="muted">Demo PIN 123456.</p>
    <div class="fld"><span>Country pack</span>
      <select id="country">
        <option value="GH" ${S.country==="GH"?"selected":""}>Ghana</option>
        <option value="KE" ${S.country==="KE"?"selected":""}>Kenya</option>
        <option value="ZA" ${S.country==="ZA"?"selected":""}>South Africa</option>
        <option value="NG" ${S.country==="NG"?"selected":""}>Nigeria</option>
        <option value="EU" disabled>EU / EEA blocked</option>
      </select></div>
    <div class="fld"><span>PIN</span><input id="pin" type="password" maxlength="6"></div>
    ${S.loginErr ? `<p class="err">${S.loginErr}</p>` : ""}
    <button class="btn primary" id="pinGo">Unlock</button>
    <button class="btn ghost" data-go="gate">Back</button>
  </div>`);
screen("ilogin", "Institution sign-in", () => `
  <div class="card">
    <p class="muted">Demo GCB / DEALER01 / 123456.</p>
    <div class="fld"><span>Bank</span><input id="bank" value="GCB"></div>
    <div class="fld"><span>Staff</span><input id="staff" value="DEALER01"></div>
    <div class="fld"><span>Role</span><select id="role"><option value="dealer">Dealer</option><option value="treasurer">Treasurer</option><option value="compliance">Compliance</option></select></div>
    <div class="fld"><span>PIN</span><input id="ipin" type="password" maxlength="6"></div>
    ${S.loginErr ? `<p class="err">${S.loginErr}</p>` : ""}
    <button class="btn primary" id="instGo">Enter desk</button>
    <button class="btn ghost" data-go="gate">Back</button>
  </div>`);
screen("phome", "Personal home", () => `
  <div class="banner ${S.connected?"ok":"navy"}">${S.connected?"PAPER connected · live off":"Watch-only until you connect paper"}</div>
  <div class="card">
    <button class="btn primary" data-go="triangle">Triangle board</button>
    <button class="btn ghost" data-go="bond">Bond board</button>
    <button class="btn ghost" data-go="crypto">Crypto board</button>
    <button class="btn ghost" data-go="corridors">Pipes we do not own</button>
    <button class="btn ghost" data-go="settle">Settlement</button>
    <button class="btn ghost" data-go="ticket">Ticket</button>
    ${S.connected ? `<button class="btn danger" data-go="kill">Kill</button>` : `<button class="btn ghost" data-go="connect">Connect broker</button>`}
  </div>`);
screen("ihome", "Desk home", () => `
  <div class="banner navy">${S.instBank} · ${S.instRole}</div>
  <div class="card">
    <button class="btn primary" data-go="triangle">Triangle</button>
    <button class="btn ghost" data-go="bond">Bond</button>
    <button class="btn ghost" data-go="crypto">Crypto</button>
    <button class="btn ghost" data-go="corridors">Pipes</button>
    <button class="btn ghost" data-go="settle">Settlement</button>
  </div>`);
screen("whome", "Watch only", () => `
  <div class="banner warn">No broker. Nothing sends.</div>
  <div class="card">
    <button class="btn primary" data-go="triangle">Triangle</button>
    <button class="btn ghost" data-go="corridors">Pipes</button>
    <button class="btn ghost" data-go="bond">Bond</button>
    <button class="btn ghost" data-go="gate">Leave</button>
  </div>`);
screen("triangle", "Triangle board", () => {
  const t = triangleMath(S.quotes, S.start, S.fee);
  const q = S.quotes;
  return `<div class="banner ${t.decision.startsWith("TRIANGLE")?"ok":"bad"}">${t.decision}</div>
    <div class="card"><div class="grid2">
      <div class="fld"><span>EURUSD bid</span><input id="eurusd_b" type="number" step="0.0001" value="${q.eurusd_b}"></div>
      <div class="fld"><span>EURUSD ask</span><input id="eurusd_a" type="number" step="0.0001" value="${q.eurusd_a}"></div>
      <div class="fld"><span>GBPUSD bid</span><input id="gbpusd_b" type="number" step="0.0001" value="${q.gbpusd_b}"></div>
      <div class="fld"><span>GBPUSD ask</span><input id="gbpusd_a" type="number" step="0.0001" value="${q.gbpusd_a}"></div>
      <div class="fld"><span>EURGBP bid</span><input id="eurgbp_b" type="number" step="0.0001" value="${q.eurgbp_b}"></div>
      <div class="fld"><span>EURGBP ask</span><input id="eurgbp_a" type="number" step="0.0001" value="${q.eurgbp_a}"></div>
      <div class="fld"><span>Start USD</span><input id="start" type="number" value="${S.start}"></div>
      <div class="fld"><span>Fee / leg</span><input id="fee" type="number" step="0.0001" value="${S.fee}"></div>
    </div>
    <button class="btn primary" id="recalc">Recalculate</button>
    <button class="btn ghost" id="misprice">Demo: break one quote</button></div>
    <div class="card">
      <div class="row"><span class="k">Clockwise</span><span class="v">${t.netCw.toFixed(2)}</span></div>
      <div class="row"><span class="k">Anti-clockwise</span><span class="v">${t.netCcw.toFixed(2)}</span></div>
    </div>`;
});
