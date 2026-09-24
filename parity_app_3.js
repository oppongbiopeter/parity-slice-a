screen("settle", "Settlement gate", () => {
  const g = settleGate(S.legA, S.legB);
  const opt = (cur) => `
    <option value="IBKR_PAPER"${cur==="IBKR_PAPER"?" selected":""}>IBKR paper</option>
    <option value="INTERBANK_T2"${cur==="INTERBANK_T2"?" selected":""}>Ghana interbank T+2</option>
    <option value="BUREAU_CASH"${cur==="BUREAU_CASH"?" selected":""}>Bureau cash T+0</option>
    <option value="CSD_T2"${cur==="CSD_T2"?" selected":""}>GFIM / CSD T+2</option>
    <option value="EUROBOND"${cur==="EUROBOND"?" selected":""}>USD Eurobond</option>
    <option value="PAPSS"${cur==="PAPSS"?" selected":""}>PAPSS via your bank</option>`;
  return `<div class="banner ${g.ok?"ok":"bad"}">${g.decision}</div>
    <div class="card">
      <div class="fld"><span>Leg A</span><select id="legA">${opt(S.legA)}</select></div>
      <div class="fld"><span>Leg B</span><select id="legB">${opt(S.legB)}</select></div>
    </div>
    <div class="card">
      <div class="row"><span class="k">A clock</span><span class="v">${g.A.clock}</span></div>
      <div class="row"><span class="k">B clock</span><span class="v">${g.B.clock}</span></div>
    </div>
    <button class="btn ghost" data-go="ticket">Continue to ticket</button>`;
});
screen("ticket", "Ticket + outcome", () => {
  if (S.party === "watch") return `<div class="banner warn">Watch-only.</div><button class="btn primary" data-go="plogin">Personal PIN</button>`;
  const t = triangleMath(S.quotes, S.start, S.fee);
  const g = settleGate(S.legA, S.legB);
  const can = S.party==="personal" && S.armed && S.connected && g.ok;
  return `<div class="banner ${g.ok?"ok":"bad"}">${g.decision}</div>
    <div class="banner bad">${t.decision}</div>
    <div class="card">
      <div class="row"><span class="k">Size at broker</span><span class="v">$${Number(S.start).toLocaleString()}</span></div>
      <p class="tiny">This size stays at the broker.</p>
      <div class="row"><span class="k">Best loop after fees</span><span class="v">$${t.best.toFixed(2)}</span></div>
    </div>
    <label class="chk"><input type="checkbox" id="ack"> I have seen the outcome.</label>
    <button class="btn ${can?"primary":"dead"}" id="send">${!g.ok?"Blocked — settlement":(S.connected&&S.armed?"Send paper ticket":"Connect and arm first")}</button>
    <div id="sent" class="hide banner ok">Paper ticket queued</div>
    <button class="btn ghost" data-go="connect">${S.connected?"Session":"Connect broker"}</button>`;
});
screen("connect", "Connect a broker", () => `
  <div class="card">
    <p class="muted">Cash stays at Interactive Brokers. ${S.country==="NG"?"IBKR does not accept Nigeria.":""}</p>
    <button class="btn primary" data-go="consent">Read the terms</button>
    <button class="btn ghost" data-go="phome">Stay disconnected</button>
  </div>`);
screen("consent", "Terms", () => {
  const ready = S.scrolled && S.boxes.every(Boolean);
  return `<div class="card" id="consentCard" style="max-height:190px;overflow:auto">
    <p>1. We do not hold your money.</p><p>2. Orders go to your broker.</p><p>3. Kill in one tap.</p><p>4. There is no pool.</p><p class="tiny">scroll end</p></div>
    <label class="chk"><input type="checkbox" data-box="0"> I read this.</label>
    <label class="chk"><input type="checkbox" data-box="1"> Cash stays at my broker.</label>
    <label class="chk"><input type="checkbox" data-box="2"> No password in PARITY.</label>
    <label class="chk"><input type="checkbox" data-box="3"> Only my account.</label>
    <button class="btn ${ready?"primary":"dead"}" id="agree">I agree</button>`;
});
screen("choose", "Paper or live", () => `
  <div class="card"><p>Paper / demo</p><button class="btn primary" data-go="scopes">Connect paper</button></div>
  <div class="card"><p>Live IBKR locked in Ghana</p><button class="btn dead">Locked</button></div>`);
screen("scopes", "Session scopes", () => `
  <div class="card"><p class="muted">Allowed: paper balances and paper tickets. Refused: transfers, crypto keys, HFT.</p>
  <button class="btn primary" id="grant">Grant these scopes</button></div>`);
screen("connected", "Paper connected", () => `
  <div class="banner ok">PAPER · live off · HFT off</div>
  <div class="card"><button class="btn primary" data-go="arm">Unlock send</button>
  <button class="btn danger" data-go="kill">Kill</button></div>`);
screen("arm", "Arm session", () => `
  <div class="card"><p class="muted">PIN arms paper send. Dies on lock, 21:00 Accra, or Kill.</p>
  <button class="btn primary" id="armbtn">Arm send</button></div>`);
screen("account", "Account", () => `
  <div class="card">
    <div class="row"><span class="k">Party</span><span class="v">${S.party||"none"}</span></div>
    <div class="row"><span class="k">Country</span><span class="v">${S.country}</span></div>
  </div>
  <button class="btn ghost" data-go="law">Who regulates this</button>
  <button class="btn ghost" id="signout">Sign out</button>`);
screen("law", "Who regulates this", () => `
  <div class="banner navy">Ghana law first. MiFID is grammar, not a licence.</div>
  <div class="card"><p class="tiny">BoG + Ghana SEC. IBKR licence is not ours. EU users blocked. Never print MiFID authorised.</p></div>
  <button class="btn ghost" data-go="gate">Back</button>`);
screen("kill", "Kill connection?", () => `
  <div class="card"><p class="muted">Token gone. Money at IBKR stays at IBKR.</p>
  <label class="chk"><input type="checkbox" id="kack"> Back to watch-only.</label>
  <button class="btn danger" id="kgo">Kill</button></div>`);
function bind(id) {
  document.querySelectorAll("[data-go]").forEach(el => el.addEventListener("click", () => go(el.dataset.go)));
  if (id === "gate") document.getElementById("watch").onclick = () => { S.party = "watch"; S.loginErr=""; go("whome"); };
  if (id === "plogin") document.getElementById("pinGo").onclick = () => {
    S.country = document.getElementById("country").value;
    if (document.getElementById("pin").value !== "123456") { S.loginErr = "Wrong PIN. Demo is 123456."; go("plogin"); return; }
    S.party = "personal"; S.pinOk = true; S.loginErr = ""; go("phome");
  };
  if (id === "ilogin") document.getElementById("instGo").onclick = () => {
    const bank = document.getElementById("bank").value.trim().toUpperCase();
    const staff = document.getElementById("staff").value.trim().toUpperCase();
    if (bank !== "GCB" || staff !== "DEALER01" || document.getElementById("ipin").value !== "123456") {
      S.loginErr = "Unknown desk. Demo GCB / DEALER01 / 123456."; go("ilogin"); return;
    }
    S.party = "institution"; S.instBank = bank; S.instStaff = staff;
    S.instRole = document.getElementById("role").value; S.loginErr = ""; go("ihome");
  };
  if (id === "corridors") document.getElementById("cpipe").onclick = () => {
    S.sendAmt = num("sendAmt", S.sendAmt); S.mid = num("mid", S.mid); S.bank = num("bank", S.bank); S.pipe = num("pipe", S.pipe); S.quoteLeft = num("quoteLeft", S.quoteLeft); go("corridors");
  };
  if (id === "bond") {
    document.getElementById("bondCase").onchange = e => { S.bondCase = e.target.value; go("bond"); };
    document.getElementById("bRecalc").onclick = () => { S.bAsk = num("bAsk", S.bAsk); S.bBid = num("bBid", S.bBid); S.bFace = num("bFace", S.bFace); S.bFee = num("bFee", S.bFee); go("bond"); };
  }
  if (id === "crypto") {
    document.getElementById("cryptoCase").onchange = e => { S.cryptoCase = e.target.value; go("crypto"); };
    document.getElementById("cRecalc").onclick = () => { S.cAsk = num("cAsk", S.cAsk); S.cBid = num("cBid", S.cBid); S.cQty = num("cQty", S.cQty); S.cFee = num("cFee", S.cFee); go("crypto"); };
  }
  if (id === "triangle") {
    document.getElementById("recalc").onclick = () => {
      S.quotes = { eurusd_b:num("eurusd_b",S.quotes.eurusd_b), eurusd_a:num("eurusd_a",S.quotes.eurusd_a), gbpusd_b:num("gbpusd_b",S.quotes.gbpusd_b), gbpusd_a:num("gbpusd_a",S.quotes.gbpusd_a), eurgbp_b:num("eurgbp_b",S.quotes.eurgbp_b), eurgbp_a:num("eurgbp_a",S.quotes.eurgbp_a) };
      S.start = num("start", S.start); S.fee = num("fee", S.fee); go("triangle");
    };
    document.getElementById("misprice").onclick = () => { S.quotes.eurgbp_a = +(S.quotes.eurgbp_a * 0.992).toFixed(4); S.quotes.eurgbp_b = +(S.quotes.eurgbp_b * 0.992).toFixed(4); go("triangle"); };
  }
  if (id === "settle") {
    document.getElementById("legA").onchange = e => { S.legA = e.target.value; go("settle"); };
    document.getElementById("legB").onchange = e => { S.legB = e.target.value; go("settle"); };
  }
  if (id === "ticket") {
    const ack = document.getElementById("ack");
    if (ack) {
      ack.checked = S.ack; ack.onchange = () => S.ack = ack.checked;
      document.getElementById("send").onclick = () => {
        const g = settleGate(S.legA, S.legB);
        if (S.armed && S.connected && ack.checked && g.ok) document.getElementById("sent").classList.remove("hide");
      };
    }
  }
  if (id === "consent") {
    const card = document.getElementById("consentCard");
    card.addEventListener("scroll", () => { if (card.scrollTop + card.clientHeight >= card.scrollHeight - 8) S.scrolled = true; });
    document.querySelectorAll("[data-box]").forEach(cb => cb.addEventListener("change", () => { S.boxes[+cb.dataset.box] = cb.checked; go("consent"); }));
    document.getElementById("agree").onclick = () => { if (S.scrolled && S.boxes.every(Boolean)) { S.consented = true; go("choose"); } };
  }
  if (id === "scopes") document.getElementById("grant").onclick = () => { S.connected = true; go("connected"); };
  if (id === "arm") document.getElementById("armbtn").onclick = () => { S.armed = true; go("ticket"); };
  if (id === "kill") document.getElementById("kgo").onclick = () => { if (!document.getElementById("kack").checked) return; S.connected = false; S.armed = false; go("phome"); };
  if (id === "account") document.getElementById("signout").onclick = () => { S.party = null; S.connected = false; S.armed = false; go("gate"); };
}
go("gate");
