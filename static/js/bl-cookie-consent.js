/* ══════════════════════════════════════════════════════════════
   BigLedger — Cookie consent (GDPR/PDPA) — issue #6
   Self-contained: injects its own styles + DOM, no dependencies.

   Tier 1 — banner: floating white card, bottom-left (YSL-style) with
     "Accept All Cookies", "Continue without Accepting" (top-right) and
     "Cookies Settings".
   Tier 2 — Privacy Preference Center: a centered modal opened from
     "Cookies Settings" (OneTrust-style, BigLedger-branded). Intro +
     Cookie Policy link + "Allow All", then per-category accordions:
       · Strictly Necessary — Always Active
       · Functional / Performance / Targeting / Social Media — toggles
     Footer: "Reject All" · "Confirm My Choices".

   Choice is stored granularly in localStorage + a cookie so the banner
   shows once. Language follows <html lang> (en / zh / ms; others → en).
════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var KEY = "bl_cookie_consent";
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}

  var lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  var prefix = (lang === "zh" || lang === "ms") ? "/" + lang : "";

  var T = {
    en: {
      dismiss:"Continue without Accepting", title:"We value your privacy",
      body:"We use cookies to remember your preferences, understand where visitors come from, and improve BigLedger. You can accept all, continue without accepting, or manage each category. See our ",
      policy:"Cookie Policy", bodyEnd:".",
      accept:"Accept All Cookies", settings:"Cookies Settings",
      pcTitle:"Privacy Preference Center",
      pcIntro:"When you visit BigLedger, we may store or retrieve information on your browser, mostly as cookies. This helps the site work as you expect, understand how it is used, and personalise your experience. Because we respect your privacy, you can choose not to allow some categories. Click each heading to learn more and change our defaults.",
      allowAll:"Allow All", manage:"Manage Consent Preferences",
      alwaysActive:"Always Active", rejectAll:"Reject All", confirm:"Confirm My Choices",
      cats:{
        necessary:["Strictly Necessary Cookies","These cookies are necessary for BigLedger to function and cannot be switched off. They are usually set only in response to actions you take — setting your privacy preferences, signing in, or filling in forms. They store no personally identifiable information."],
        functional:["Functional Cookies","These cookies let BigLedger provide enhanced functionality and personalisation, such as remembering your language. They may be set by us or by partners whose services we use. If disabled, some features may not work properly."],
        performance:["Performance Cookies","These cookies let us count visits and traffic sources so we can measure and improve BigLedger. They tell us which pages are most and least popular. All information is aggregated and anonymous."],
        targeting:["Targeting Cookies","These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant content. They do not store personal information directly but identify your browser and device."],
        social:["Social Media Cookies","These cookies are set by social media services we have added to let you share BigLedger content. They can track your browser across other sites. If disabled, some sharing tools may not work."]
      }
    },
    zh: {
      dismiss:"继续但不接受", title:"我们重视您的隐私",
      body:"我们使用 Cookie 来记住您的偏好、了解访客来源并改进 BigLedger。您可以全部接受、继续但不接受，或分类管理。请参阅我们的",
      policy:"Cookie 政策", bodyEnd:"。",
      accept:"接受所有 Cookie", settings:"Cookie 设置",
      pcTitle:"隐私偏好中心",
      pcIntro:"当您访问 BigLedger 时，我们可能会在您的浏览器中存储或读取信息，主要以 Cookie 形式。这有助于网站正常运行、了解使用情况并为您个性化体验。出于对隐私的尊重，您可以选择不允许某些类别。点击各标题可了解更多并更改默认设置。",
      allowAll:"全部允许", manage:"管理同意偏好",
      alwaysActive:"始终启用", rejectAll:"全部拒绝", confirm:"确认我的选择",
      cats:{
        necessary:["严格必要 Cookie","这些 Cookie 是 BigLedger 运行所必需的，无法关闭。它们通常仅在您执行操作时设置——例如设置隐私偏好、登录或填写表单。它们不存储任何可识别个人身份的信息。"],
        functional:["功能性 Cookie","这些 Cookie 让 BigLedger 提供增强功能与个性化，例如记住您的语言。它们可能由我们或合作伙伴设置。若停用，部分功能可能无法正常运作。"],
        performance:["性能 Cookie","这些 Cookie 让我们统计访问量和流量来源，以衡量并改进 BigLedger，并了解哪些页面最受欢迎。所有信息均为汇总且匿名。"],
        targeting:["定向 Cookie","这些 Cookie 可能由我们的广告合作伙伴通过本网站设置，用于建立您的兴趣画像并展示相关内容。它们不直接存储个人信息，但会识别您的浏览器和设备。"],
        social:["社交媒体 Cookie","这些 Cookie 由我们添加的社交媒体服务设置，让您分享 BigLedger 内容。它们可跨其他网站追踪您的浏览器。若停用，部分分享工具可能无法使用。"]
      }
    },
    ms: {
      dismiss:"Teruskan Tanpa Menerima", title:"Kami menghargai privasi anda",
      body:"Kami menggunakan kuki untuk mengingati pilihan anda, memahami dari mana pelawat datang, dan menambah baik BigLedger. Anda boleh terima semua, teruskan tanpa menerima, atau urus setiap kategori. Lihat ",
      policy:"Dasar Kuki", bodyEnd:" kami.",
      accept:"Terima Semua Kuki", settings:"Tetapan Kuki",
      pcTitle:"Pusat Keutamaan Privasi",
      pcIntro:"Apabila anda melawat BigLedger, kami mungkin menyimpan atau mendapatkan maklumat pada pelayar anda, kebanyakannya sebagai kuki. Ini membantu laman berfungsi seperti dijangka, memahami penggunaannya, dan memperibadikan pengalaman anda. Kerana kami menghormati privasi anda, anda boleh memilih untuk tidak membenarkan sesetengah kategori. Klik setiap tajuk untuk maklumat lanjut dan ubah tetapan lalai.",
      allowAll:"Benarkan Semua", manage:"Urus Keutamaan Persetujuan",
      alwaysActive:"Sentiasa Aktif", rejectAll:"Tolak Semua", confirm:"Sahkan Pilihan Saya",
      cats:{
        necessary:["Kuki Sangat Diperlukan","Kuki ini diperlukan untuk BigLedger berfungsi dan tidak boleh dimatikan. Ia biasanya ditetapkan hanya sebagai respons kepada tindakan anda — menetapkan keutamaan privasi, log masuk, atau mengisi borang. Ia tidak menyimpan maklumat pengenalan peribadi."],
        functional:["Kuki Fungsian","Kuki ini membolehkan BigLedger memberi fungsi dan pemperibadian tambahan, seperti mengingati bahasa anda. Ia mungkin ditetapkan oleh kami atau rakan kongsi. Jika dimatikan, sesetengah ciri mungkin tidak berfungsi."],
        performance:["Kuki Prestasi","Kuki ini membolehkan kami mengira lawatan dan sumber trafik untuk mengukur dan menambah baik BigLedger, serta mengetahui halaman paling popular. Semua maklumat adalah agregat dan tanpa nama."],
        targeting:["Kuki Sasaran","Kuki ini mungkin ditetapkan melalui laman kami oleh rakan pengiklanan untuk membina profil minat anda dan menunjukkan kandungan berkaitan. Ia tidak menyimpan maklumat peribadi secara langsung tetapi mengenal pasti pelayar dan peranti anda."],
        social:["Kuki Media Sosial","Kuki ini ditetapkan oleh perkhidmatan media sosial yang kami tambah untuk membolehkan anda berkongsi kandungan BigLedger. Ia boleh menjejaki pelayar anda merentas laman lain. Jika dimatikan, sesetengah alat perkongsian mungkin tidak berfungsi."]
      }
    }
  };
  var t = T[lang] || T.en;
  var TOGGLES = ["functional", "performance", "targeting", "social"];

  /* ── styles ─────────────────────────────────────────────── */
  var css = ''
  /* cursor: re-enable the native pointer over our overlays. The site sets
     `body.custom-cursor * { cursor:none !important }` and draws a JS cursor
     that sits below our z-index, so without this you see no cursor at all.
     Higher specificity than that rule so it actually wins. */
  + 'body.custom-cursor .blcc,body.custom-cursor .blcc *,body.custom-cursor .blpc-ov,body.custom-cursor .blpc-ov *{cursor:auto !important}'
  + 'body.custom-cursor .blcc a,body.custom-cursor .blcc button,body.custom-cursor .blpc-ov a,body.custom-cursor .blpc-ov button,body.custom-cursor .blpc-ov .blpc-sw,body.custom-cursor .blpc-ov .blpc-sw input,body.custom-cursor .blcc .blcc-sw input{cursor:pointer !important}'
  /* Tier 1 banner */
  + '.blcc{position:fixed;left:24px;bottom:24px;z-index:10000;width:min(420px,calc(100vw - 32px));font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#14140F;background:#fff;border:1px solid #E7E6E0;border-radius:14px;box-shadow:0 18px 50px rgba(20,20,15,.18),0 2px 8px rgba(20,20,15,.08);transform:translateY(20px);opacity:0;pointer-events:none;transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .35s ease}'
  + '.blcc.show{transform:translateY(0);opacity:1;pointer-events:auto}'
  + '.blcc-in{padding:22px 22px 20px}'
  + '.blcc-top{display:flex;justify-content:flex-end;margin-bottom:2px}'
  + '.blcc-dismiss{font:500 12px inherit;color:#8A8A80;background:none;border:none;text-decoration:underline;text-underline-offset:2px;padding:2px 0}'
  + '.blcc-dismiss:hover{color:#14140F}'
  + '.blcc-title{font-size:15px;font-weight:700;margin:2px 0 8px;letter-spacing:-.01em;color:#14140F}'
  + '.blcc-body{font-size:13px;color:#55554D;margin:0 0 16px;line-height:1.55}'
  + '.blcc-body a{color:#DC143C;font-weight:600;text-decoration:underline;text-underline-offset:2px}'
  + '.blcc-body a:hover{color:#A50E2B}'
  + '.blcc-actions{display:flex;flex-direction:column;gap:9px}'
  + '.blcc-accept{width:100%;font:700 13.5px inherit;color:#fff;background:#141310;border:1px solid #141310;border-radius:9px;padding:13px;transition:background .18s ease}'
  + '.blcc-accept:hover{background:#000}'
  + '.blcc-settings{width:100%;font:600 13px inherit;color:#14140F;background:transparent;border:1px solid #D9D8D1;border-radius:9px;padding:11px;transition:background .18s ease,border-color .18s ease}'
  + '.blcc-settings:hover{background:#F7F6F2;border-color:#8A8A80}'
  /* Tier 2 preference center */
  + '.blpc-ov{position:fixed;inset:0;z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,10,12,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:0;transition:opacity .3s ease;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'
  + '.blpc-ov.show{opacity:1}'
  + '.blpc{width:min(640px,100%);max-height:88vh;display:flex;flex-direction:column;background:#fff;color:#14140F;border-radius:14px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.5);transform:translateY(14px) scale(.985);transition:transform .3s cubic-bezier(.22,1,.36,1)}'
  + '.blpc-ov.show .blpc{transform:none}'
  + '.blpc-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #E7E6E0;flex:none}'
  + '.blpc-brand{display:flex;align-items:center;gap:9px;font-size:15px;font-weight:800;letter-spacing:-.02em;color:#14140F}'
  + '.blpc-brand i{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,#DC143C,#FF1F47);display:inline-block}'
  + '.blpc-x{width:30px;height:30px;border-radius:8px;border:1px solid transparent;background:transparent;color:#55554D;display:grid;place-items:center;transition:.15s ease}'
  + '.blpc-x:hover{background:#F3F2EE;color:#14140F}'
  + '.blpc-body{overflow-y:auto;padding:20px;-webkit-overflow-scrolling:touch}'
  + '.blpc-h2{font-size:16px;font-weight:700;margin:0 0 8px;color:#14140F}'
  + '.blpc-intro{font-size:13px;line-height:1.6;color:#55554D;margin:0 0 12px}'
  + '.blpc-link{display:inline-block;font-size:13px;color:#DC143C;font-weight:600;text-decoration:underline;text-underline-offset:2px;margin-bottom:16px}'
  + '.blpc-link:hover{color:#A50E2B}'
  + '.blpc-allow{display:block;font:700 13.5px inherit;color:#fff;background:#141310;border:1px solid #141310;border-radius:9px;padding:12px 22px;margin:0 0 22px;transition:background .18s ease}'
  + '.blpc-allow:hover{background:#000}'
  + '.blpc-manage{font-size:13.5px;font-weight:700;margin:0 0 12px;color:#14140F}'
  + '.blpc-cat{border:1px solid #E7E6E0;border-radius:10px;margin-bottom:10px;overflow:hidden}'
  + '.blpc-cat-h{display:flex;align-items:center;gap:12px;width:100%;padding:14px 15px;background:#fff;border:none;text-align:left}'
  + '.blpc-cat-h:hover{background:#FAFAF8}'
  + '.blpc-chev{flex:none;color:#8A8A80;transition:transform .2s ease}'
  + '.blpc-cat.open .blpc-chev{transform:rotate(90deg)}'
  + '.blpc-cat-name{flex:1;font-size:13.5px;font-weight:600;color:#14140F}'
  + '.blpc-always{font-size:12px;font-weight:600;color:#DC143C;white-space:nowrap}'
  + '.blpc-sw{position:relative;width:40px;height:23px;flex:none}'
  + '.blpc-sw input{position:absolute;opacity:0;width:100%;height:100%;margin:0}'
  + '.blpc-sw span{position:absolute;inset:0;background:#CFCEC7;border-radius:20px;transition:background .18s ease}'
  + '.blpc-sw span::before{content:"";position:absolute;width:17px;height:17px;left:3px;top:3px;background:#fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .18s ease}'
  + '.blpc-sw input:checked + span{background:#DC143C}'
  + '.blpc-sw input:checked + span::before{transform:translateX(17px)}'
  + '.blpc-cat-d{display:none;padding:0 15px 15px;font-size:12.5px;line-height:1.6;color:#6B6B63}'
  + '.blpc-cat.open .blpc-cat-d{display:block}'
  + '.blpc-foot{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;padding:14px 20px;border-top:1px solid #E7E6E0;flex:none;background:#fff}'
  + '.blpc-btn{font:700 13px inherit;border-radius:9px;padding:11px 20px;border:1px solid #141310}'
  + '.blpc-reject{background:#fff;color:#141310}.blpc-reject:hover{background:#F3F2EE}'
  + '.blpc-confirm{background:#141310;color:#fff}.blpc-confirm:hover{background:#000}'
  + '.blpc-ov a:focus-visible,.blpc-ov button:focus-visible,.blpc-sw input:focus-visible + span,.blcc a:focus-visible,.blcc button:focus-visible,.blcc-sw input:focus-visible + span{outline:2px solid #DC143C;outline-offset:2px;border-radius:6px}'
  + '@media (max-width:520px){.blcc{left:12px;right:12px;bottom:12px;width:auto}.blpc-foot .blpc-btn{flex:1}}'
  + '@media (prefers-reduced-motion:reduce){.blcc,.blpc-ov,.blpc{transition:none}}';

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* Force the native cursor back on our elements with inline !important —
     the strongest override, so it wins no matter what the site's cursor
     rules do. Call after a subtree is built/populated. */
  function cursorFix(root) {
    root.style.setProperty("cursor", "auto", "important");
    var hit = root.querySelectorAll("a,button,input,label,.blpc-sw,.blcc-sw");
    for (var i = 0; i < hit.length; i++) hit[i].style.setProperty("cursor", "pointer", "important");
  }

  /* ── persistence ────────────────────────────────────────── */
  function save(rec) {
    rec.necessary = true;
    rec.ts = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
    var secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = "cookie_consent=" + rec.status + "; path=/; max-age=31536000; SameSite=Lax" + secure;
  }
  function acceptAll() { var r = { status: "accepted" }; TOGGLES.forEach(function (k) { r[k] = true; }); return r; }
  function rejectAll() { var r = { status: "rejected" }; TOGGLES.forEach(function (k) { r[k] = false; }); return r; }

  /* ── Tier 1: banner ─────────────────────────────────────── */
  var banner = document.createElement("div");
  banner.className = "blcc";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", t.title);
  banner.innerHTML = ''
  + '<div class="blcc-in">'
  + '  <div class="blcc-top"><button type="button" class="blcc-dismiss"></button></div>'
  + '  <h2 class="blcc-title"></h2>'
  + '  <p class="blcc-body"></p>'
  + '  <div class="blcc-actions">'
  + '    <button type="button" class="blcc-accept"></button>'
  + '    <button type="button" class="blcc-settings"></button>'
  + '  </div>'
  + '</div>';
  var bq = function (s) { return banner.querySelector(s); };
  bq(".blcc-dismiss").textContent = t.dismiss;
  bq(".blcc-title").textContent = t.title;
  var bbody = bq(".blcc-body");
  bbody.appendChild(document.createTextNode(t.body));
  var plink = document.createElement("a");
  plink.href = prefix + "/privacy-policy"; plink.textContent = t.policy;
  bbody.appendChild(plink); bbody.appendChild(document.createTextNode(t.bodyEnd));
  bq(".blcc-accept").textContent = t.accept;
  bq(".blcc-settings").textContent = t.settings;

  function closeBanner() { banner.classList.remove("show"); setTimeout(function () { banner.remove(); }, 500); }

  bq(".blcc-accept").addEventListener("click", function () { save(acceptAll()); closeBanner(); });
  bq(".blcc-dismiss").addEventListener("click", function () { save(rejectAll()); closeBanner(); });
  bq(".blcc-settings").addEventListener("click", openCenter);

  document.body.appendChild(banner);
  cursorFix(banner);
  requestAnimationFrame(function () { requestAnimationFrame(function () { banner.classList.add("show"); }); });

  /* ── Tier 2: Privacy Preference Center ──────────────────── */
  var ov = null, lastFocus = null;

  function catRow(key, always) {
    var c = t.cats[key];
    var row = document.createElement("div");
    row.className = "blpc-cat";
    row.innerHTML = ''
    + '<button type="button" class="blpc-cat-h" aria-expanded="false">'
    + '  <span class="blpc-chev"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l4 4-4 4"/></svg></span>'
    + '  <span class="blpc-cat-name"></span>'
    + (always
        ? '  <span class="blpc-always"></span>'
        : '  <label class="blpc-sw" data-key="' + key + '"><input type="checkbox"><span></span></label>')
    + '</button>'
    + '<div class="blpc-cat-d"></div>';
    row.querySelector(".blpc-cat-name").textContent = c[0];
    row.querySelector(".blpc-cat-d").textContent = c[1];
    if (always) row.querySelector(".blpc-always").textContent = t.alwaysActive;

    var head = row.querySelector(".blpc-cat-h");
    head.addEventListener("click", function (e) {
      if (e.target.closest(".blpc-sw")) return;   // toggling shouldn't collapse
      var open = row.classList.toggle("open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // keep the toggle from bubbling into the accordion
    var sw = row.querySelector(".blpc-sw input");
    if (sw) sw.addEventListener("click", function (e) { e.stopPropagation(); });
    return row;
  }

  function openCenter() {
    lastFocus = document.activeElement;
    ov = document.createElement("div");
    ov.className = "blpc-ov";
    ov.innerHTML = ''
    + '<div class="blpc" role="dialog" aria-modal="true" aria-label="' + t.pcTitle + '">'
    + '  <div class="blpc-head">'
    + '    <div class="blpc-brand"><i></i> BigLedger</div>'
    + '    <button type="button" class="blpc-x" aria-label="Close"><svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>'
    + '  </div>'
    + '  <div class="blpc-body">'
    + '    <h2 class="blpc-h2"></h2>'
    + '    <p class="blpc-intro"></p>'
    + '    <a class="blpc-link"></a>'
    + '    <button type="button" class="blpc-allow"></button>'
    + '    <div class="blpc-manage"></div>'
    + '    <div class="blpc-cats"></div>'
    + '  </div>'
    + '  <div class="blpc-foot">'
    + '    <button type="button" class="blpc-btn blpc-reject"></button>'
    + '    <button type="button" class="blpc-btn blpc-confirm"></button>'
    + '  </div>'
    + '</div>';

    var q = function (s) { return ov.querySelector(s); };
    q(".blpc-h2").textContent = t.pcTitle;
    q(".blpc-intro").textContent = t.pcIntro;
    var cl = q(".blpc-link"); cl.textContent = t.policy; cl.href = prefix + "/privacy-policy";
    q(".blpc-allow").textContent = t.allowAll;
    q(".blpc-manage").textContent = t.manage;
    q(".blpc-reject").textContent = t.rejectAll;
    q(".blpc-confirm").textContent = t.confirm;

    var cats = q(".blpc-cats");
    cats.appendChild(catRow("necessary", true));
    TOGGLES.forEach(function (k) { cats.appendChild(catRow(k, false)); });

    function readToggles() {
      var r = { status: "custom" };
      TOGGLES.forEach(function (k) {
        var i = ov.querySelector('.blpc-sw[data-key="' + k + '"] input');
        r[k] = !!(i && i.checked);
      });
      return r;
    }
    function finish(rec) { save(rec); closeCenter(); closeBanner(); }

    q(".blpc-allow").addEventListener("click", function () { finish(acceptAll()); });
    q(".blpc-reject").addEventListener("click", function () { finish(rejectAll()); });
    q(".blpc-confirm").addEventListener("click", function () { finish(readToggles()); });
    q(".blpc-x").addEventListener("click", closeCenter);
    ov.addEventListener("mousedown", function (e) { if (e.target === ov) closeCenter(); });
    document.addEventListener("keydown", escClose);

    document.body.appendChild(ov);
    cursorFix(ov);
    requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.add("show"); }); });
    setTimeout(function () { var x = q(".blpc-x"); if (x) x.focus(); }, 60);
  }

  function escClose(e) { if (e.key === "Escape") closeCenter(); }
  function closeCenter() {
    if (!ov) return;
    document.removeEventListener("keydown", escClose);
    var el = ov; ov = null;
    el.classList.remove("show");
    setTimeout(function () { el.remove(); }, 300);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }
})();
