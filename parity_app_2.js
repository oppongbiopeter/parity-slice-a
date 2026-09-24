screen("corridors", "Pipes we do not own", () => {
  const mid = S.mid, bank = S.bank, pipe = S.pipe, amt = S.sendAmt;
  const ghsMid = amt * mid, ghsBank = amt * bank, ghsPipe = amt * pipe;
  const vsBank = ghsBank - ghsPipe;
  const vsMid = ghsPipe - ghsMid;
  return `<div class="banner warn">COMPARE ONLY — we do not collect, convert, or pay out</div>
    <div class="card">
      <p class="tiny">Borrowed from TradeRail / Divest / PAPSS: a clock, an all-in number, and versus the bank. Refused: wallets and collections.</p>
      <div class="fld"><span>USD you would send from your own account</span><input id="sendAmt" type="number" value="${amt}"></div>
      <div class="grid2">
        <div class="fld"><span>Mid GHS per USD</span><input id="mid" type="number" step="0.01" value="${mid}"></div>
        <div class="fld"><span>Typical bank</span><input id="bank" type="number" step="0.01" value="${bank}"></div>
        <div class="fld"><span>A payment-app print</span><input id="pipe" type="number" step="0.01" value="${pipe}"></div>
        <div class="fld"><span>Quote age (sec)</span><input id="quoteLeft" type="number" value="${S.quoteLeft}"></div>
      </div>
      <button class="btn primary" id="cpipe">Show what would arrive</button>
    </div>
    <div class="card">
      <div class="row"><span class="k">If mid existed as a fill</span><span class="v">₵${ghsMid.toFixed(0)}</span></div>
      <div class="row"><span class="k">If you used a bank window</span><span class="v">₵${ghsBank.toFixed(0)}</span></div>
      <div class="row"><span class="k">If you used that payment app</span><span class="v">₵${ghsPipe.toFixed(0)}</span></div>
      <div class="row"><span class="k">App vs bank (not ours)</span><span class="v">₵${vsBank.toFixed(0)}</span></div>
    </div>
    <button class="btn ghost" data-go="settle">Map that pipe to a settlement clock</button>`;
});

screen("bond", "Bond / T-bill board", () => {
  const pv = bondPreview(S.bondCase);
  const tone = S.bondCase==="SAME_ISIN" && pv.ok ? "ok" : (S.bondCase==="SAME_ISIN" ? "bad" : "warn");
  return `<div class="banner ${tone}">${pv.headline}</div>
    <div class="card">
      <p class="tiny">See the outcome before anyone sends. We do not hold the bill.</p>
      <div class="fld"><span>What are you comparing?</span>
        <select id="bondCase">
          <option value="SAME_ISIN"${S.bondCase==="SAME_ISIN"?" selected":""}>Same T-bill, two GFIM prices</option>
          <option value="CURVE"${S.bondCase==="CURVE"?" selected":""}>91-day vs 364-day curve</option>
          <option value="EURO"${S.bondCase==="EURO"?" selected":""}>Cedi bond vs USD Eurobond</option>
          <option value="FUTURES"${S.bondCase==="FUTURES"?" selected":""}>Cash bond vs bond future</option>
        </select>
      </div>
      <div class="grid2">
        <div class="fld"><span>Ask (buy) price</span><input id="bAsk" type="number" step="0.01" value="${S.bAsk}"></div>
        <div class="fld"><span>Bid (sell) price</span><input id="bBid" type="number" step="0.01" value="${S.bBid}"></div>
        <div class="fld"><span>Face</span><input id="bFace" type="number" value="${S.bFace}"></div>
        <div class="fld"><span>Fee / side</span><input id="bFee" type="number" step="0.0001" value="${S.bFee}"></div>
      </div>
      <button class="btn primary" id="bRecalc">Show outcome</button>
    </div>
    <div class="card"><p class="muted">${pv.sentence}</p></div>
    <button class="btn ghost" data-go="settle">Check CSD vs auction clocks</button>`;
});

screen("crypto", "Crypto board", () => {
  const pv = cryptoPreview(S.cryptoCase);
  const tone = S.cryptoCase==="SPATIAL" && pv.lockedUsd>0 ? "warn" : "bad";
  return `<div class="banner ${tone}">${pv.headline}</div>
    <div class="card">
      <p class="tiny">BYO exchange keys. We never hold coins. Ghana live send off.</p>
      <div class="fld"><span>What are you comparing?</span>
        <select id="cryptoCase">
          <option value="SPATIAL"${S.cryptoCase==="SPATIAL"?" selected":""}>Same coin, two exchanges</option>
          <option value="TRI"${S.cryptoCase==="TRI"?" selected":""}>Three pairs on one book</option>
          <option value="FUND"${S.cryptoCase==="FUND"?" selected":""}>Spot vs perp funding</option>
          <option value="CHAIN"${S.cryptoCase==="CHAIN"?" selected":""}>Exchange vs on-chain wallet</option>
        </select>
      </div>
      <div class="grid2">
        <div class="fld"><span>Venue A ask</span><input id="cAsk" type="number" value="${S.cAsk}"></div>
        <div class="fld"><span>Venue B bid</span><input id="cBid" type="number" value="${S.cBid}"></div>
        <div class="fld"><span>Qty BTC</span><input id="cQty" type="number" step="0.01" value="${S.cQty}"></div>
        <div class="fld"><span>Fee / side</span><input id="cFee" type="number" step="0.0001" value="${S.cFee}"></div>
      </div>
      <button class="btn primary" id="cRecalc">Show outcome</button>
    </div>
    <div class="card"><p class="muted">${pv.sentence}</p></div>
    <button class="btn dead">Send live crypto is off in GH</button>`;
});
