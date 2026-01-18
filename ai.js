/* =====================================================
   ERDENE NUTAG – STEALTH AI ASSISTANT
   (UI-д харагдахгүй, дотроо ажиллана)
===================================================== */

/* ===============================
   1️⃣ BASIC TEXT CLEANER
================================ */

function aiCleanText(text) {
  if (!text) return "";

  let cleaned = text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .trim();

  // Том үсгээр эхлүүлэх
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

  return cleaned;
}

/* ===============================
   2️⃣ SMART SENTENCE FORMAT
   (өгүүлбэрүүдийг ялгана)
================================ */

function aiFormatSentences(text) {
  if (!text) return "";

  let sentences = text
    .split(/([.!?])/)
    .reduce((acc, part, i, arr) => {
      if (/[.!?]/.test(part)) {
        acc[acc.length - 1] += part;
      } else if (part.trim()) {
        acc.push(part.trim());
      }
      return acc;
    }, []);

  sentences = sentences.map(s =>
    s.charAt(0).toUpperCase() + s.slice(1)
  );

  return sentences.join(" ");
}

/* ===============================
   3️⃣ TITLE GENERATOR
   (Marketplace / Event)
================================ */

function aiGenerateTitle(text) {
  if (!text) return "";

  let words = text.split(" ").slice(0, 6).join(" ");
  return aiCleanText(words);
}

/* ===============================
   4️⃣ CONTENT ENHANCER
   (community post-д зөөлөн сайжруулна)
================================ */

function aiEnhanceContent(text) {
  let enhanced = aiCleanText(text);

  // Хэт богино бол зөөлөн өргөтгөнө
  if (enhanced.length < 20) {
    enhanced += " — нутгийнхаа мэдээллийг хуваалцаж байна.";
  }

  return enhanced;
}

/* ===============================
   5️⃣ LIVE INPUT HOOK
   (textarea / input дээр залгана)
================================ */

function attachStealthAI(inputElement, mode = "content") {
  if (!inputElement) return;

  inputElement.addEventListener("blur", () => {
    let value = inputElement.value;

    if (!value) return;

    if (mode === "title") {
      inputElement.value = aiGenerateTitle(value);
    } else if (mode === "content") {
      inputElement.value = aiEnhanceContent(
        aiFormatSentences(value)
      );
    }
  });
}

/* ===============================
   6️⃣ AUTO BIND HELPER
   (app.js дуудахад ашиглана)
================================ */

function bindAIById(elementId, mode) {
  const el = document.getElementById(elementId);
  if (el) attachStealthAI(el, mode);
}

/* ===============================
   STEALTH MODE ✔
   - UI-д харагдахгүй
   - Console log байхгүй
================================ */
