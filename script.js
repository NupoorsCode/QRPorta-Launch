/* QRporta Raksha Bandhan 2026 campaign
   Static/GitHub Pages implementation.
   Change these values before deployment. */

const CAMPAIGN_CONFIG = {
  campaignStart: "2026-08-28",
  revealDate: "2026-08-29",
  timezone: "Asia/Kolkata",

  // Replace with your actual GitHub Pages URL.
  campaignQRUrl: "https://NupoorsCode.github.io/QRPorta-Launch/reveal.html",

  // Replace these with QRporta's real URLs.
  qrportaWebsiteUrl: "https://staging.qrporta.com/",
  demoUrl: "https://bookings.cloud.microsoft/book/QrPorta@ultralinkit.com/?ismsaljsauthenabled"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function getISTDateString() {
  // Reliable enough for this campaign: format current instant in campaign timezone.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CAMPAIGN_CONFIG.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function getPreviewMode() {
  const value = new URLSearchParams(window.location.search).get("preview");
  if (value === "aug28") return "2026-08-28";
  if (value === "aug29") return "2026-08-29";
  return null;
}

function currentCampaignDate() {
  return getPreviewMode() || getISTDateString();
}

function makeQR(canvas, text, size = 220) {
  if (!window.QRCode || !canvas) return;
  QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    color: { dark: "#241a1d", light: "#ffffff" },
    errorCorrectionLevel: "M"
  }, (error) => {
    if (error) console.error("QR generation error:", error);
  });
}

function encodeCampaignData(data) {
  const params = new URLSearchParams({
    to: data.recipient,
    from: data.sender,
    message: data.message,
    design: data.design
  });
  return `${CAMPAIGN_CONFIG.campaignQRUrl}?${params.toString()}`;
}

function initBuilder() {
  const form = $("#rakhiForm");
  if (!form) return;

  const sender = $("#senderName");
  const recipient = $("#recipientName");
  const message = $("#message");
  const count = $("#charCount");
  const previewRecipient = $("#previewRecipient");
  const previewSender = $("#previewSender");
  const previewMessage = $("#previewMessage");
  const previewRakhi = $("#previewRakhi");
  const previewQR = $("#previewQR");
  let selectedDesign = "classic";

  const designSymbols = {
    classic: "✦",
    floral: "✿",
    modern: "◆",
    festive: "✺",
    playful: "♥"
  };

  function updatePreview() {
    previewRecipient.textContent = recipient.value.trim() || "someone special";
    previewSender.textContent = sender.value.trim() || "your name";
    previewMessage.textContent = message.value.trim() || "Write something from the heart...";
    count.textContent = message.value.length;
    previewRakhi.textContent = designSymbols[selectedDesign];
    previewRakhi.className = `rakhi-symbol ${selectedDesign}`;

    // Use a temporary canvas generated off-screen for the preview.
    if (window.QRCode) {
      previewQR.innerHTML = "";
      const canvas = document.createElement("canvas");
      previewQR.appendChild(canvas);
      makeQR(canvas, CAMPAIGN_CONFIG.campaignQRUrl, 120);
    }
  }

  [sender, recipient, message].forEach(input => input.addEventListener("input", updatePreview));

  $$(".design-option").forEach(button => {
    button.addEventListener("click", () => {
      $$(".design-option").forEach(b => {
        b.classList.remove("selected");
        b.setAttribute("aria-pressed", "false");
      });
      button.classList.add("selected");
      button.setAttribute("aria-pressed", "true");
      selectedDesign = button.dataset.design;
      updatePreview();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const values = {
      sender: sender.value.trim(),
      recipient: recipient.value.trim(),
      message: message.value.trim(),
      design: selectedDesign
    };

    $("#senderError").textContent = values.sender ? "" : "Tell them who this Rakhi is from ❤️";
    $("#recipientError").textContent = values.recipient ? "" : "Add their name so we know who this Rakhi is for ❤️";
    $("#messageError").textContent = values.message ? "" : "Write them a little something ❤️";

    if (!values.sender || !values.recipient || !values.message) return;

    localStorage.setItem("qrportaRakhi", JSON.stringify(values));
    const shareUrl = encodeCampaignData(values);
    localStorage.setItem("qrportaShareUrl", shareUrl);

    window.location.href = `reveal.html?created=1&${new URLSearchParams({
      to: values.recipient,
      from: values.sender,
      message: values.message,
      design: values.design
    }).toString()}`;
  });

  updatePreview();
}

function getCampaignData() {
  const params = new URLSearchParams(window.location.search);
  const stored = JSON.parse(localStorage.getItem("qrportaRakhi") || "null");

  return {
    recipient: params.get("to") || stored?.recipient || "",
    sender: params.get("from") || stored?.sender || "",
    message: params.get("message") || stored?.message || "",
    design: params.get("design") || stored?.design || "classic"
  };
}

function buildRevealPage() {
  const app = $("#revealApp");
  if (!app) return;

  const date = currentCampaignDate();
  const data = getCampaignData();

  // After Aug 29, show the dynamic QR product reveal.
  if (date >= CAMPAIGN_CONFIG.revealDate) {
    app.innerHTML = `
      <section class="reveal-shell dynamic-page">
        <span class="dynamic-badge">✦ QRPORTA · DYNAMIC QR EXPERIMENT</span>
        <div class="reveal-symbol">✦</div>
        <h1>You came back. <em>👀</em></h1>
        <p>Did you notice something?</p>

        <div class="reveal-message">
          Yesterday, you scanned this QR and saw one thing.<br>
          Today, you're seeing something completely different.
        </div>

        <h2 style="font-family:var(--serif);color:var(--wine);font-size:clamp(36px,6vw,58px);margin:45px 0 5px;">Same QR.</h2>
        <h2 style="font-family:var(--serif);color:var(--gold);font-size:clamp(36px,6vw,58px);margin:0;">New destination.</h2>

        <div class="same-new">
          <div>SAME<br><small>QR CODE</small></div>
          <span>→</span>
          <div>NEW<br><small>EXPERIENCE</small></div>
        </div>

        <p style="font-size:17px;"><strong style="color:var(--wine);">That's a Dynamic QR.</strong></p>
        <p style="margin-top:10px;">QR codes don't have to be permanent destinations. With QRporta, businesses can change where a QR code leads without replacing the QR itself.</p>

        <div class="use-cases">
          <div class="use-case"><strong>Restaurant</strong><span>Menu → Special offer</span></div>
          <div class="use-case"><strong>Product</strong><span>Product info → Campaign</span></div>
          <div class="use-case"><strong>Event</strong><span>Registration → Feedback</span></div>
          <div class="use-case"><strong>Packaging</strong><span>Instructions → Launch</span></div>
        </div>

        <a class="button button-primary" href="${CAMPAIGN_CONFIG.demoUrl}">Book a Demo <span>→</span></a>
        <p class="microcopy">Turn static QR codes into flexible, updateable experiences.</p>
      </section>
    `;
    return;
  }

  // Aug 28 / before reveal.
  const recipient = data.recipient || "someone special";
  const message = data.message || "Here's a little reminder that you're loved, appreciated, and probably still owe me a treat.";
  const sender = data.sender || "";

  app.innerHTML = `
    <section class="reveal-shell">
      <div class="reveal-symbol">✦</div>
      <span class="eyebrow">A LITTLE RAKHI SURPRISE</span>
      <h1>Happy Raksha Bandhan, ${escapeHTML(recipient)}! ❤️</h1>
      <p>Someone has sent you a little something from the heart.</p>

      <div class="reveal-message">“${escapeHTML(message)}”${sender ? `<br><small style="font-family:var(--sans);font-size:13px;color:var(--muted);">— ${escapeHTML(sender)}</small>` : ""}</div>

      <div class="reveal-hook">
        <span class="eyebrow">WAIT... THERE'S MORE 👀</span>
        <h2>Don't throw this QR away.</h2>
        <p>Scan the <strong>same QR again tomorrow.</strong><br>Something will be waiting for you.</p>
        <canvas class="reveal-qr" id="revealQR" aria-label="Campaign QR code"></canvas>
        <p style="margin-bottom:0;">See you tomorrow. 🪢</p>
      </div>

      <p class="microcopy" style="margin-top:28px;">Powered by <strong>QRporta</strong></p>
    </section>
  `;

  const canvas = $("#revealQR");
  if (canvas) makeQR(canvas, CAMPAIGN_CONFIG.campaignQRUrl, 170);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

document.addEventListener("DOMContentLoaded", () => {
  initBuilder();
  buildRevealPage();
});
