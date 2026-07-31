/* ══════════════════════════════════════════════════════════════
   BigLedger — Cookie consent (GDPR/PDPA) — issue #6
   Self-contained: injects its own styles + DOM, no dependencies.
   • Floating white card, bottom-left (YSL-style).
   • "Continue without Accepting" (top-right) · "Accept All Cookies"
     (full-width dark) · "Cookies Settings" (Necessary / Analytics /
     Marketing toggles → Save Preferences).
   • Remembers the choice in localStorage + a cookie, so it shows
     once and never reappears after a choice.
   • Language follows <html lang> (en / zh / ms; others → en).
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var KEY = "bl_cookie_consent";
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  var lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  var T = {
    en: { dismiss:"Continue without Accepting", title:"We value your privacy",
      body:"We use cookies to remember your preferences, understand where visitors come from, and improve BigLedger. See our ",
      policy:"Privacy Policy", bodyEnd:".", accept:"Accept All Cookies", settings:"Cookies Settings", save:"Save Preferences",
      nec:["Strictly necessary","Required for the site to work. Always on."],
      ana:["Analytics","Helps us understand how the site is used."],
      mkt:["Marketing","Lets us tailor content and offers to you."], always:"Always on" },
    zh: { dismiss:"继续但不接受", title:"我们重视您的隐私",
      body:"我们使用 Cookie 来记住您的偏好、了解访客来源并改进 BigLedger。请参阅我们的",
      policy:"隐私政策", bodyEnd:"。", accept:"接受所有 Cookie", settings:"Cookie 设置", save:"保存偏好",
      nec:["严格必要","网站运行所必需，始终启用。"], ana:["分析","帮助我们了解网站的使用情况。"],
      mkt:["营销","让我们为您量身定制内容和优惠。"], always:"始终启用" },
    ms: { dismiss:"Teruskan Tanpa Menerima", title:"Kami menghargai privasi anda",
      body:"Kami menggunakan kuki untuk mengingati pilihan anda, memahami dari mana pelawat datang, dan menambah baik BigLedger. Lihat ",
      policy:"Dasar Privasi", bodyEnd:" kami.", accept:"Terima Semua Kuki", settings:"Tetapan Kuki", save:"Simpan Pilihan",
      nec:["Sangat diperlukan","Diperlukan untuk laman berfungsi. Sentiasa aktif."],
      ana:["Analitik","Membantu kami memahami cara laman digunakan."],
      mkt:["Pemasaran","Membolehkan kami menyesuaikan kandungan dan tawaran."], always:"Sentiasa aktif" }
  };
  var t = T[lang] || T.en;
  var prefix = (lang === "zh" || lang === "ms") ? "/" + lang : "";

  var css = ''
  + '.blcc{position:fixed;left:24px;bottom:24px;z-index:10000;width:min(420px,calc(100vw - 32px));'
  + 'font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#14140F;'
  + 'background:#fff;border:1px solid #E7E6E0;border-radius:14px;box-shadow:0 18px 50px rgba(20,20,15,.18),0 2px 8px rgba(20,20,15,.08);'
  + 'transform:translateY(20px);opacity:0;pointer-events:none;transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .35s ease}'
  + '.blcc.show{transform:translateY(0);opacity:1;pointer-events:auto}'
  + '.blcc-in{padding:22px 22px 20px}'
  + '.blcc-top{display:flex;justify-content:flex-end;margin-bottom:2px}'
  + '.blcc-dismiss{font:500 12px inherit;color:#8A8A80;background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:2px;padding:2px 0}'
  + '.blcc-dismiss:hover{color:#14140F}'
  + '.blcc-title{font-size:15px;font-weight:700;margin:2px 0 8px;letter-spacing:-.01em}'
  + '.blcc-body{font-size:13px;color:#55554D;margin:0 0 16px;line-height:1.55}'
  + '.blcc-body a{color:#DC143C;font-weight:600;text-decoration:underline;text-underline-offset:2px}'
  + '.blcc-body a:hover{color:#A50E2B}'
  + '.blcc-actions{display:flex;flex-direction:column;gap:9px}'
  + '.blcc-accept{width:100%;font:700 13.5px inherit;color:#fff;background:#141310;border:1px solid #141310;border-radius:9px;padding:13px;cursor:pointer;transition:background .18s ease}'
  + '.blcc-accept:hover{background:#000}'
  + '.blcc-settings{width:100%;font:600 13px inherit;color:#14140F;background:transparent;border:1px solid #D9D8D1;border-radius:9px;padding:11px;cursor:pointer;transition:background .18s ease,border-color .18s ease}'
  + '.blcc-settings:hover{background:#F7F6F2;border-color:#8A8A80}'
  + '.blcc-set{display:none;margin:4px 0 16px;border-top:1px solid #E7E6E0;padding-top:14px}'
  + '.blcc.settings .blcc-set{display:block}.blcc.settings .blcc-body{margin-bottom:12px}'
  + '.blcc-opt{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;padding:10px 0;border-bottom:1px solid #E7E6E0}'
  + '.blcc-opt:last-child{border-bottom:none}'
  + '.blcc-oh{font-size:13px;font-weight:600}.blcc-od{font-size:11.5px;color:#8A8A80;margin-top:2px;max-width:26ch}'
  + '.blcc-always{font:600 11px inherit;color:#178A50;white-space:nowrap;padding-top:2px}'
  + '.blcc-sw{position:relative;width:38px;height:22px;flex:none;margin-top:1px}'
  + '.blcc-sw input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}'
  + '.blcc-sw span{position:absolute;inset:0;background:#D9D8D1;border-radius:20px;transition:background .18s ease}'
  + '.blcc-sw span::before{content:"";position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .18s ease}'
  + '.blcc-sw input:checked + span{background:#DC143C}'
  + '.blcc-sw input:checked + span::before{transform:translateX(16px)}'
  + '.blcc a:focus-visible,.blcc button:focus-visible,.blcc-sw input:focus-visible + span{outline:2px solid #DC143C;outline-offset:2px;border-radius:6px}'
  + '@media (max-width:520px){.blcc{left:12px;right:12px;bottom:12px;width:auto}}'
  + '@media (prefers-reduced-motion:reduce){.blcc{transition:none}}';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var el = document.createElement("div");
  el.className = "blcc";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", t.title);
  el.innerHTML = ''
  + '<div class="blcc-in">'
  + '  <div class="blcc-top"><button type="button" class="blcc-dismiss"></button></div>'
  + '  <h2 class="blcc-title"></h2>'
  + '  <p class="blcc-body"></p>'
  + '  <div class="blcc-set">'
  + '    <div class="blcc-opt"><div><div class="blcc-oh nec-h"></div><div class="blcc-od nec-d"></div></div><div class="blcc-always"></div></div>'
  + '    <div class="blcc-opt"><div><div class="blcc-oh ana-h"></div><div class="blcc-od ana-d"></div></div><label class="blcc-sw"><input type="checkbox" class="opt-analytics"><span></span></label></div>'
  + '    <div class="blcc-opt"><div><div class="blcc-oh mkt-h"></div><div class="blcc-od mkt-d"></div></div><label class="blcc-sw"><input type="checkbox" class="opt-marketing"><span></span></label></div>'
  + '  </div>'
  + '  <div class="blcc-actions">'
  + '    <button type="button" class="blcc-accept"></button>'
  + '    <button type="button" class="blcc-settings"></button>'
  + '  </div>'
  + '</div>';

  var q = function (s) { return el.querySelector(s); };
  q(".blcc-dismiss").textContent = t.dismiss;
  q(".blcc-title").textContent = t.title;
  var body = q(".blcc-body");
  body.appendChild(document.createTextNode(t.body));
  var a = document.createElement("a");
  a.href = prefix + "/privacy-policy"; a.textContent = t.policy;
  body.appendChild(a); body.appendChild(document.createTextNode(t.bodyEnd));
  q(".nec-h").textContent = t.nec[0]; q(".nec-d").textContent = t.nec[1]; q(".blcc-always").textContent = t.always;
  q(".ana-h").textContent = t.ana[0]; q(".ana-d").textContent = t.ana[1];
  q(".mkt-h").textContent = t.mkt[0]; q(".mkt-d").textContent = t.mkt[1];
  q(".blcc-accept").textContent = t.accept;
  q(".blcc-settings").textContent = t.settings;

  function save(rec) {
    rec.ts = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = "cookie_consent=" + rec.status + "; path=/; max-age=31536000; SameSite=Lax" + secure;
  }
  function hide() { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 500); }

  q(".blcc-accept").addEventListener("click", function () {
    save({ status: "accepted", analytics: true, marketing: true }); hide();
  });
  q(".blcc-dismiss").addEventListener("click", function () {
    save({ status: "rejected", analytics: false, marketing: false }); hide();
  });
  q(".blcc-settings").addEventListener("click", function () {
    if (!el.classList.contains("settings")) {
      el.classList.add("settings"); q(".blcc-settings").textContent = t.save; return;
    }
    save({ status: "custom", analytics: q(".opt-analytics").checked, marketing: q(".opt-marketing").checked }); hide();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && el.classList.contains("settings")) {
      el.classList.remove("settings"); q(".blcc-settings").textContent = t.settings;
    }
  });

  document.body.appendChild(el);
  requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add("show"); }); });
})();
