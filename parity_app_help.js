screen("help", "Help / FAQ", () => `
  <div class="banner navy">Board, not a bank. We never hold the money.</div>
  <div class="card">
    <p style="margin:0 0 8px;font-weight:700;color:var(--navy)">What is this?</p>
    <p class="tiny">If you put money on a trade, what happens — and is that number locked? Most days the honest answer is no trade.</p>
  </div>
  <div class="card">
    <p style="margin:0 0 8px;font-weight:700;color:var(--navy)">Who signs in?</p>
    <p class="tiny"><b>You</b> — PIN 123456. Connect a broker you already own.<br>
    <b>Desk</b> — GCB / DEALER01 / 123456. Own books only.<br>
    <b>Watch</b> — calculator. Nothing sends.</p>
  </div>
  <div class="card">
    <p style="margin:0 0 8px;font-weight:700;color:var(--navy)">Boards</p>
    <p class="tiny"><b>Triangle</b> — three FX prices after bid/ask and fees.<br>
    <b>Bond</b> — same CSD bill can lock; a curve cannot; Eurobond is blocked.<br>
    <b>Crypto</b> — your keys. Live send off in Ghana.<br>
    <b>Pipes</b> — mid vs bank vs payment app. We do not pay out.<br>
    <b>Settle</b> — same clock or Send stays dead.</p>
  </div>
  <div class="card">
    <p class="tiny">1 Same instrument. 2 Same date. 3 After fees. 4 Tick the outcome box. 5 Paper armed.</p>
  </div>
  <button class="btn ghost" data-go="law">Who regulates this</button>
`);
