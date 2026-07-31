/* ══════════════════════════════════════════════════════════════
   BigLedger — News & Offers looping notification (top-left)
   Self-contained: injects its own styles + DOM, no dependencies.
   • Slim dark card, top-left, slides in and auto-cycles news/offers.
   • NEWS (crimson) / OFFER (gold) badges, headline, line, link.
   • Decline / Allow buttons — opt in/out of future news & offers.
   • Pauses on hover/focus; dots to jump; respects reduced-motion.
   • Shows once until a choice is stored (localStorage bl_news_optin).
   • Language follows <html lang> (en / zh / ms; others → en).
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var KEY = "bl_news_optin", DUR = 5000;
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  var lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  var UI = {
    en: { allow:"Allow", decline:"Decline", thanksIn:"You're in — we'll keep you posted.", thanksOut:"No problem — we won't show these." },
    zh: { allow:"允许", decline:"拒绝", thanksIn:"已订阅 —— 我们会及时通知您。", thanksOut:"没问题 —— 将不再显示。" },
    ms: { allow:"Benarkan", decline:"Tolak", thanksIn:"Selesai — kami akan maklumkan anda.", thanksOut:"Baik — kami tidak akan tunjukkannya." }
  };
  var DATA = {
    en: [
      { type:"news", badge:"New", title:"E-Invoicing is live", desc:"LHDN MyInvois-ready. Submit compliant e-invoices straight from BigLedger.", cta:"See how", url:"/modules/" },
      { type:"offer", badge:"Offer", title:"Free personalized demo", desc:"Book a 1-on-1 walkthrough tailored to your industry and workflows.", cta:"Book a demo", url:"/contact/" },
      { type:"news", badge:"New", title:"Shopify & WooCommerce sync", desc:"Orders, stock and customers now flow both ways, automatically.", cta:"Explore integrations", url:"/applications/" },
      { type:"offer", badge:"Talk to us", title:"See BigLedger in action", desc:"Have a question about your setup? Our team is happy to help.", cta:"Get in touch", url:"/contact/" }
    ],
    zh: [
      { type:"news", badge:"新功能", title:"电子发票已上线", desc:"已支持 LHDN MyInvois，直接从 BigLedger 提交合规电子发票。", cta:"了解详情", url:"/zh/modules/" },
      { type:"offer", badge:"优惠", title:"免费专属演示", desc:"预约一对一演示，针对您的行业与流程量身定制。", cta:"预约演示", url:"/zh/contact/" },
      { type:"news", badge:"新功能", title:"Shopify 与 WooCommerce 同步", desc:"订单、库存与客户资料现已双向自动同步。", cta:"探索集成", url:"/zh/applications/" },
      { type:"offer", badge:"联系我们", title:"体验 BigLedger", desc:"对您的方案有疑问？我们的团队乐意协助。", cta:"联系我们", url:"/zh/contact/" }
    ],
    ms: [
      { type:"news", badge:"Baharu", title:"E-Invois kini aktif", desc:"Sedia untuk LHDN MyInvois. Hantar e-invois patuh terus dari BigLedger.", cta:"Lihat caranya", url:"/ms/modules/" },
      { type:"offer", badge:"Tawaran", title:"Demo peribadi percuma", desc:"Tempah sesi satu-dengan-satu yang disesuaikan dengan industri anda.", cta:"Tempah demo", url:"/ms/contact/" },
      { type:"news", badge:"Baharu", title:"Penyegerakan Shopify & WooCommerce", desc:"Pesanan, stok dan pelanggan kini disegerak dua hala, automatik.", cta:"Terokai integrasi", url:"/ms/applications/" },
      { type:"offer", badge:"Hubungi kami", title:"Lihat BigLedger beraksi", desc:"Ada soalan tentang persediaan anda? Pasukan kami sedia membantu.", cta:"Hubungi kami", url:"/ms/contact/" }
    ]
  };
  var ui = UI[lang] || UI.en;
  var items = DATA[lang] || DATA.en;

  var css = ''
  /* re-enable native cursor over the card (site hides it via
     body.custom-cursor * { cursor:none !important } and draws a JS cursor
     that sits below our z-index) — higher specificity so this wins */
  + 'body.custom-cursor .blnt,body.custom-cursor .blnt *{cursor:auto !important}'
  + 'body.custom-cursor .blnt a,body.custom-cursor .blnt button{cursor:pointer !important}'
  + '.blnt{position:fixed;left:24px;top:24px;z-index:10000;width:min(370px,calc(100vw - 32px));'
  + 'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#F3F3ED;'
  + 'background:linear-gradient(180deg,rgba(20,20,20,.94),rgba(12,12,12,.94));backdrop-filter:blur(18px) saturate(150%);-webkit-backdrop-filter:blur(18px) saturate(150%);'
  + 'border:1px solid rgba(255,255,255,.12);border-radius:15px;box-shadow:0 26px 60px rgba(0,0,0,.55);overflow:hidden;'
  + 'transform:translateX(-115%);opacity:0;transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .4s ease}'
  + '.blnt.show{transform:translateX(0);opacity:1}'
  + '.blnt-progress{height:2px;background:transparent}'
  + '.blnt-progress i{display:block;height:100%;width:0;background:linear-gradient(90deg,#DC143C,#FF1F47)}'
  + '.blnt.run .blnt-progress i{animation:blntfill var(--dur,5s) linear forwards}'
  + '@keyframes blntfill{from{width:0}to{width:100%}}'
  + '.blnt-in{padding:15px 16px 15px}'
  + '.blnt-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:20px;margin-bottom:9px}'
  + '.blnt-eyebrow.news{color:#FF1F47;background:rgba(220,20,60,.14);border:1px solid rgba(255,255,255,.12)}'
  + '.blnt-eyebrow.offer{color:#E8B33D;background:rgba(232,179,61,.14);border:1px solid rgba(232,179,61,.32)}'
  + '.blnt-title{font-size:14.5px;font-weight:700;letter-spacing:-.01em;margin:0 0 4px;color:#F3F3ED}'
  + '.blnt-desc{font-size:12.5px;color:#B6B6AC;margin:0 0 11px;line-height:1.5}'
  + '.blnt-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:13px}'
  + '.blnt-link{font:600 12px inherit;color:#FF1F47;text-decoration:none;display:inline-flex;align-items:center;gap:5px}'
  + '.blnt-link:hover{color:#fff}'
  + '.blnt-dots{display:flex;gap:5px}'
  + '.blnt-dots button{width:6px;height:6px;border-radius:50%;border:none;padding:0;background:rgba(255,255,255,.22);cursor:pointer;transition:.2s ease}'
  + '.blnt-dots button.on{background:#FF1F47;width:16px;border-radius:3px}'
  + '.blnt-actions{display:flex;gap:8px}'
  + '.blnt-btn{flex:1;font:600 12.5px inherit;padding:10px;border-radius:9px;cursor:pointer;border:1px solid;transition:.18s ease}'
  + '.blnt-decline{background:transparent;color:#B6B6AC;border-color:rgba(255,255,255,.12)}'
  + '.blnt-decline:hover{color:#F3F3ED;background:rgba(255,255,255,.06)}'
  + '.blnt-allow{background:#DC143C;color:#fff;border-color:#DC143C}'
  + '.blnt-allow:hover{background:#FF1F47;box-shadow:0 0 22px rgba(220,20,60,.30)}'
  + '.blnt-thanks{display:none;align-items:center;gap:8px;font-size:13px;color:#4FD98A;padding:2px 0}'
  + '.blnt.done .blnt-actions{display:none}.blnt.done .blnt-thanks{display:flex}'
  + '.blnt-fade{transition:opacity .28s ease}.blnt-fade.out{opacity:0}'
  + '.blnt :focus-visible{outline:2px solid #FF1F47;outline-offset:2px;border-radius:6px}'
  + '@media (max-width:520px){.blnt{left:12px;right:12px;top:12px;width:auto}}'
  + '@media (prefers-reduced-motion:reduce){.blnt,.blnt-fade{transition:none}.blnt.run .blnt-progress i{animation:none;width:100%}}';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var el = document.createElement("div");
  el.className = "blnt";
  el.setAttribute("role", "region");
  el.setAttribute("aria-label", "BigLedger news and offers");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = ''
  + '<div class="blnt-progress"><i></i></div>'
  + '<div class="blnt-in">'
  + '  <div class="blnt-fade">'
  + '    <span class="blnt-eyebrow news"></span>'
  + '    <h3 class="blnt-title"></h3>'
  + '    <p class="blnt-desc"></p>'
  + '  </div>'
  + '  <div class="blnt-foot">'
  + '    <a class="blnt-link" href="#"><span class="blnt-cta"></span> <span aria-hidden="true">→</span></a>'
  + '    <div class="blnt-dots"></div>'
  + '  </div>'
  + '  <div class="blnt-actions">'
  + '    <button type="button" class="blnt-btn blnt-decline"></button>'
  + '    <button type="button" class="blnt-btn blnt-allow"></button>'
  + '  </div>'
  + '  <div class="blnt-thanks">'
  + '    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3.2L13 5"/></svg>'
  + '    <span class="blnt-thanks-label"></span>'
  + '  </div>'
  + '</div>';

  var q = function (s) { return el.querySelector(s); };
  var fade = q(".blnt-fade"), eyebrow = q(".blnt-eyebrow"), title = q(".blnt-title"),
      desc = q(".blnt-desc"), link = q(".blnt-link"), ctaLabel = q(".blnt-cta"),
      dotsWrap = q(".blnt-dots"), bar = q(".blnt-progress");
  var i = 0, timer = null, decided = false;

  q(".blnt-decline").textContent = ui.decline;
  q(".blnt-allow").textContent = ui.allow;

  items.forEach(function (_, idx) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Show item " + (idx + 1));
    b.addEventListener("click", function () { go(idx, true); });
    dotsWrap.appendChild(b);
  });
  function paintDots() {
    var kids = dotsWrap.children;
    for (var k = 0; k < kids.length; k++) kids[k].classList.toggle("on", k === i);
  }
  function restartBar() {
    el.classList.remove("run"); void bar.offsetWidth;
    el.style.setProperty("--dur", DUR + "ms"); el.classList.add("run");
  }
  function paint() {
    var it = items[i];
    eyebrow.textContent = it.badge;
    eyebrow.className = "blnt-eyebrow " + (it.type === "offer" ? "offer" : "news");
    title.textContent = it.title; desc.textContent = it.desc;
    ctaLabel.textContent = it.cta; link.setAttribute("href", it.url);
    paintDots(); restartBar();
  }
  function swap() { fade.classList.add("out"); setTimeout(function () { paint(); fade.classList.remove("out"); }, 200); }
  function go(idx, manual) { i = (idx + items.length) % items.length; swap(); if (manual) schedule(); }
  function next() { go(i + 1); }
  function schedule() { if (decided) return; clearInterval(timer); timer = setInterval(next, DUR); }

  function decide(choice) {
    decided = true; clearInterval(timer); el.classList.remove("run");
    try { localStorage.setItem(KEY, choice); } catch (e) {}
    q(".blnt-thanks-label").textContent = choice === "allowed" ? ui.thanksIn : ui.thanksOut;
    el.classList.add("done");
    setTimeout(function () { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 600); }, 1500);
  }
  q(".blnt-allow").addEventListener("click", function () { decide("allowed"); });
  q(".blnt-decline").addEventListener("click", function () { decide("declined"); });

  el.addEventListener("mouseenter", function () { if (decided) return; clearInterval(timer); el.classList.remove("run"); });
  el.addEventListener("mouseleave", function () { if (decided) return; restartBar(); schedule(); });
  el.addEventListener("focusin", function () { if (decided) return; clearInterval(timer); el.classList.remove("run"); });
  el.addEventListener("focusout", function () { if (decided) return; restartBar(); schedule(); });

  document.body.appendChild(el);
  // inline !important cursor so the native pointer always shows over the card
  el.style.setProperty("cursor", "auto", "important");
  (function () {
    var hit = el.querySelectorAll("a,button");
    for (var k = 0; k < hit.length; k++) hit[k].style.setProperty("cursor", "pointer", "important");
  })();
  paint();
  // slight stagger after the cookie card so the two corners don't slam in together
  setTimeout(function () {
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("show"); schedule(); }); });
  }, 700);
})();
