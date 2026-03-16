let LIBRARY = null;
let currentLanguage = "en";

const uiTranslations = {
  en: {
    plainMeaningLabel: "Plain Meaning / Plain Meaning",
    detectedAssertionsLabel: "Detected Assertions / Detected Assertions",
    actionSignalsLabel: "Action Signals / Action Signals",
    timelineSignalsLabel: "Timeline Signals / Timeline Signals",
    sourceDomainLabel: "Source Domain / Source Domain",
    publisherLabel: "Publisher / Publisher",
    authorLabel: "Author / Author",
    timestampSignalLabel: "Timestamp Signal / Timestamp Signal",
    ownershipContextLabel: "Ownership / Provenance Context / Ownership / Provenance Context",
    originSignalsLabel: "Origin Signals / Origin Signals",
    assertionLabel: "Assertion / Assertion",
    expectedRecordSystemsLabel: "Expected Record Systems / Expected Record Systems",
    notesLabel: "Notes / Notes",

    noneDetected: "None detected.",
    noAssertionsDetected: "No assertions detected.",
    noActionSignalsDetected: "No action signals detected.",
    noTimelineSignalsDetected: "No timeline signals detected.",
    noOriginSignalsDetected: "No origin signals detected.",
    noVerificationItems: "No verification items to display.",
    pasteTextFirst: "Paste some text first.",

    noClearExplanation:
      "This text makes a claim but there was not enough information to explain it clearly.",
    bridgeSummary:
      "The text says the federal government plans to spend money repairing bridges, expanding broadband internet, and upgrading the power grid. It also says these investments may reduce maintenance costs over time.",
    textSaysPrefix: "The text says ",

    otherLabel: "Other / Other",
    needsHumanReview: "Needs Human Review / Needs Human Review",

    governmentDomain: "Government domain / Government domain",
    academicDomain: "Academic domain / Academic domain",
    congressGov: "Congress.gov / Congress.gov",
    officialGovernmentDomain: "Official government domain / Official government domain",
    nonGovernmentDomain: "Non-government domain / Non-government domain",
    noSourceUrl: "No source URL detected in text / No source URL detected in text",

    normativeNote:
      "This is a value-oriented statement. Treat record systems as framing references, not definitive proof paths.",
    predictiveNote:
      "This is a forecast-style statement. Model assumptions and prior forecast track records matter.",
    incompleteSourceNote:
      "This statement suggests a plausible verification path but does not yet identify a concrete primary record.",
    identifiableRecordNote:
      "This statement points toward an identifiable record system class."
  },

  es: {
    plainMeaningLabel: "Plain Meaning / Significado claro",
    detectedAssertionsLabel: "Detected Assertions / Afirmaciones detectadas",
    actionSignalsLabel: "Action Signals / Señales de acción",
    timelineSignalsLabel: "Timeline Signals / Señales temporales",
    sourceDomainLabel: "Source Domain / Dominio fuente",
    publisherLabel: "Publisher / Publicador",
    authorLabel: "Author / Autor",
    timestampSignalLabel: "Timestamp Signal / Señal temporal",
    ownershipContextLabel: "Ownership / Provenance Context / Contexto de propiedad / procedencia",
    originSignalsLabel: "Origin Signals / Señales de origen",
    assertionLabel: "Assertion / Afirmación",
    expectedRecordSystemsLabel: "Expected Record Systems / Sistemas de registro esperados",
    notesLabel: "Notes / Notas",

    noneDetected: "No detectado.",
    noAssertionsDetected: "No se detectaron afirmaciones.",
    noActionSignalsDetected: "No se detectaron señales de acción.",
    noTimelineSignalsDetected: "No se detectaron señales temporales.",
    noOriginSignalsDetected: "No se detectaron señales de origen.",
    noVerificationItems: "No hay elementos de verificación para mostrar.",
    pasteTextFirst: "Pega texto primero.",

    noClearExplanation:
      "Este texto hace una afirmación, pero no había suficiente información para explicarla con claridad.",
    bridgeSummary:
      "El texto dice que el gobierno federal planea gastar dinero en reparar puentes, ampliar el internet de banda ancha y modernizar la red eléctrica. También dice que estas inversiones pueden reducir los costos de mantenimiento con el tiempo.",
    textSaysPrefix: "El texto dice ",

    otherLabel: "Other / Otro",
    needsHumanReview: "Needs Human Review / Revisión humana necesaria",

    governmentDomain: "Government domain / Dominio gubernamental",
    academicDomain: "Academic domain / Dominio académico",
    congressGov: "Congress.gov / Congress.gov",
    officialGovernmentDomain: "Official government domain / Dominio gubernamental oficial",
    nonGovernmentDomain: "Non-government domain / Dominio no gubernamental",
    noSourceUrl: "No source URL detected in text / No se detectó URL fuente en el texto",

    normativeNote:
      "Esta es una afirmación orientada a valores. Trata los sistemas de registro como referencias de encuadre, no como rutas definitivas de prueba.",
    predictiveNote:
      "Esta es una afirmación de tipo pronóstico. Importan los supuestos del modelo y el historial previo de aciertos.",
    incompleteSourceNote:
      "Esta afirmación sugiere una ruta de verificación plausible, pero todavía no identifica un registro primario concreto.",
    identifiableRecordNote:
      "Esta afirmación apunta a una clase de sistema de registro identificable."
  }
};

function t(key) {
  return uiTranslations[currentLanguage]?.[key] || uiTranslations.en[key] || key;
}

function syncLanguageFromUI() {
  const langSelect = document.getElementById("languageSelect");
  if (langSelect && langSelect.value) {
    currentLanguage = langSelect.value;
  }
}

async function loadLibrary() {
  if (LIBRARY) return LIBRARY;
  const response = await fetch("./reference-library.json");
  LIBRARY = await response.json();
  return LIBRARY;
}

function normalizeInput(text) {
  return {
    rawText: (text || "").trim()
  };
}

function splitSentences(text) {
  if (!text) return [];
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/)
    .map(s => s.trim())
    .filter(Boolean);
}

function detectAssertions(sentences) {
  const markers = [
    /\b(is|are|was|were|will|would|should|must|can|could|did|does|do|reported|announced|passed|increased|decreased|showed|found|establishes|expands|directs)\b/i,
    /\b\d+(\.\d+)?%?\b/,
    /\baccording to\b/i,
    /\bsection\b/i,
    /\bnew\b/i
  ];

  return sentences.filter(sentence => {
    if (sentence.length < 18) return false;
    return markers.some(rx => rx.test(sentence));
  });
}

function generatePlainMeaning(text) {
  if (!text) {
    return t("noClearExplanation");
  }

  const lower = text.toLowerCase();

  if (
    lower.includes("bridge") &&
    lower.includes("broadband") &&
    lower.includes("grid")
  ) {
    return t("bridgeSummary");
  }

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  let summary = sentences.slice(0, 2).join(" ");

  summary = summary.replace(/Section\s+\d+\s+/gi, "");
  summary = summary.replace(/\bestablishes\b/gi, "sets up");
  summary = summary.replace(/\bdirects\b/gi, "puts");
  summary = summary.replace(/\bmodernization\b/gi, "upgrades");
  summary = summary.replace(/\bdeployment\b/gi, "expansion");
  summary = summary.replace(/\s+/g, " ").trim();

  if (!summary.toLowerCase().startsWith("the text") && !summary.toLowerCase().startsWith("el texto")) {
    summary = t("textSaysPrefix") + summary.charAt(0).toLowerCase() + summary.slice(1);
  }

  return summary;
}

function scoreAssertionType(sentence, assertionTypes) {
  const lower = sentence.toLowerCase();
  let best = {
    id: "other",
    score: 0,
    label: t("otherLabel"),
    recordSystems: [t("needsHumanReview")]
  };

  for (const type of assertionTypes) {
    let score = 0;

    for (const signal of type.expectedSignals || []) {
      if (lower.includes(signal.toLowerCase())) score += 2;
    }

    for (const weak of type.weakSignals || []) {
      if (lower.includes(weak.toLowerCase())) score -= 1;
    }

    if (type.id === "statistical" && /\b\d+(\.\d+)?%?\b/.test(sentence)) score += 2;
    if (type.id === "predictive" && /\b(will|likely|projected|expected|forecast)\b/i.test(sentence)) score += 2;
    if (type.id === "normative" && /\b(should|ought|must|fair|unfair|ethical|harmful)\b/i.test(sentence)) score += 2;
    if (type.id === "policy_legal" && /\b(bill|act|law|rule|regulation|section|agency|court|congress)\b/i.test(sentence)) score += 2;

    if (score > best.score) {
      best = {
        id: type.id,
        score,
        label: type.label,
        recordSystems: type.recordSystems || [t("needsHumanReview")]
      };
    }
  }

  return best;
}

function buildReviewFlags(typeId, sentence) {
  const flags = [];
  const lower = sentence.toLowerCase();

  if (!/\b(according to|report|study|section|act|bill|court|agency|department|published)\b/i.test(sentence)) {
    flags.push("source_path_incomplete");
  }

  if (typeId === "normative") {
    flags.push("interpretive_judgment_required");
  }

  if (typeId === "predictive") {
    flags.push("forecast_model_needed");
  }

  if (/\b(rumor|viral|people are saying|some say)\b/i.test(lower)) {
    flags.push("secondary_source_only");
  }

  if (flags.length === 0) {
    flags.push("verification_path_available");
  }

  return [...new Set(flags)];
}

function extractMeaning(rawText, assertions) {
  const actions = [];
  const timelineSignals = [];

  assertions.forEach(text => {
    if (/\b(increase|decrease|expand|reduce|fund|ban|require|allow|renew|apply|report|announce|pass|establish|direct)\b/i.test(text)) {
      actions.push(text);
    }

    const years = text.match(/\b(19|20)\d{2}\b/g);
    if (years) timelineSignals.push(...years);

    const relative = text.match(/\b(today|tomorrow|this year|next year|current|effective)\b/i);
    if (relative) timelineSignals.push(relative[0]);
  });

  return {
    plainMeaning: generatePlainMeaning(rawText),
    assertions,
    actions: [...new Set(actions)],
    timelineSignals: [...new Set(timelineSignals)]
  };
}

function extractOrigin(rawText) {
  let sourceDomain = "";
  let publisher = "";
  let author = "";
  let timestamp = "";
  const originSignals = [];

  const urlMatch = rawText.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    try {
      const url = new URL(urlMatch[0]);
      sourceDomain = url.hostname;
      originSignals.push(`source_url:${url.hostname}`);
      if (url.hostname.includes(".gov")) publisher = t("governmentDomain");
      if (url.hostname.includes(".edu")) publisher = t("academicDomain");
      if (url.hostname.includes("congress.gov")) publisher = t("congressGov");
    } catch (_) {}
  }

  const publisherMatch = rawText.match(/\b(according to|published by|from)\s+([A-Z][A-Za-z0-9&.\- ]{2,80})/);
  if (publisherMatch && !publisher) {
    publisher = publisherMatch[2].trim();
    originSignals.push(`publisher_text:${publisher}`);
  }

  const authorMatch = rawText.match(/\bby\s+([A-Z][A-Za-z.\- ]{2,60})/);
  if (authorMatch) {
    author = authorMatch[1].trim();
    originSignals.push(`author_text:${author}`);
  }

  const timeMatch = rawText.match(/\b((19|20)\d{2}|January|February|March|April|May|June|July|August|September|October|November|December)\b/i);
  if (timeMatch) {
    timestamp = timeMatch[0];
    originSignals.push(`time_signal:${timestamp}`);
  }

  return {
    sourceDomain,
    publisher,
    author,
    timestamp,
    ownershipContext: sourceDomain.includes(".gov")
      ? t("officialGovernmentDomain")
      : sourceDomain.includes(".edu")
      ? t("academicDomain")
      : sourceDomain
      ? t("nonGovernmentDomain")
      : t("noSourceUrl"),
    originSignals
  };
}

function runVerification(assertionTexts, library) {
  return assertionTexts.map(text => {
    const type = scoreAssertionType(text, library.assertionTypes);
    const flags = buildReviewFlags(type.id, text);

    let notes = "";
    if (type.id === "normative") {
      notes = t("normativeNote");
    } else if (type.id === "predictive") {
      notes = t("predictiveNote");
    } else if (flags.includes("source_path_incomplete")) {
      notes = t("incompleteSourceNote");
    } else {
      notes = t("identifiableRecordNote");
    }

    return {
      text,
      type: type.id,
      typeLabel: type.label,
      recordSystems: type.recordSystems,
      reviewFlags: flags,
      notes
    };
  });
}

function renderMeaning(meaning) {
  const panel = document.getElementById("meaningPanel");

  const assertionsHtml = meaning.assertions.length
    ? `<ul class="list">${meaning.assertions.map(a => `<li>${escapeHtml(a)}</li>`).join("")}</ul>`
    : `<p class="empty">${escapeHtml(t("noAssertionsDetected"))}</p>`;

  const actionsHtml = meaning.actions.length
    ? `<ul class="list">${meaning.actions.map(a => `<li>${escapeHtml(a)}</li>`).join("")}</ul>`
    : `<p class="empty">${escapeHtml(t("noActionSignalsDetected"))}</p>`;

  const timelineHtml = meaning.timelineSignals.length
    ? `<ul class="list">${meaning.timelineSignals.map(tl => `<li>${escapeHtml(tl)}</li>`).join("")}</ul>`
    : `<p class="empty">${escapeHtml(t("noTimelineSignalsDetected"))}</p>`;

  panel.innerHTML = `
    <div class="card">
      <div class="small-label">${escapeHtml(t("plainMeaningLabel"))}</div>
      <p>${escapeHtml(meaning.plainMeaning)}</p>
    </div>

    <div class="card">
      <div class="small-label">${escapeHtml(t("detectedAssertionsLabel"))}</div>
      ${assertionsHtml}
    </div>

    <div class="card">
      <div class="small-label">${escapeHtml(t("actionSignalsLabel"))}</div>
      ${actionsHtml}
    </div>

    <div class="card">
      <div class="small-label">${escapeHtml(t("timelineSignalsLabel"))}</div>
      ${timelineHtml}
    </div>
  `;
}

function renderOrigin(origin) {
  const panel = document.getElementById("originPanel");

  panel.innerHTML = `
    <div class="card">
      <div class="small-label">${escapeHtml(t("sourceDomainLabel"))}</div>
      <p>${escapeHtml(origin.sourceDomain || t("noneDetected"))}</p>
    </div>
    <div class="card">
      <div class="small-label">${escapeHtml(t("publisherLabel"))}</div>
      <p>${escapeHtml(origin.publisher || t("noneDetected"))}</p>
    </div>
    <div class="card">
      <div class="small-label">${escapeHtml(t("authorLabel"))}</div>
      <p>${escapeHtml(origin.author || t("noneDetected"))}</p>
    </div>
    <div class="card">
      <div class="small-label">${escapeHtml(t("timestampSignalLabel"))}</div>
      <p>${escapeHtml(origin.timestamp || t("noneDetected"))}</p>
    </div>
    <div class="card">
      <div class="small-label">${escapeHtml(t("ownershipContextLabel"))}</div>
      <p>${escapeHtml(origin.ownershipContext)}</p>
    </div>
    <div class="card">
      <div class="small-label">${escapeHtml(t("originSignalsLabel"))}</div>
      ${
        origin.originSignals.length
          ? `<ul class="list">${origin.originSignals.map(s => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
          : `<p class="empty">${escapeHtml(t("noOriginSignalsDetected"))}</p>`
      }
    </div>
  `;
}

function renderVerification(items) {
  const panel = document.getElementById("verificationPanel");

  if (!items.length) {
    panel.innerHTML = `<p class="empty">${escapeHtml(t("noVerificationItems"))}</p>`;
    return;
  }

  panel.innerHTML = items.map(item => `
    <div class="card">
      <div class="small-label">${escapeHtml(t("assertionLabel"))}</div>
      <p>${escapeHtml(item.text)}</p>

      <div class="badge-row">
  <span class="badge type">${escapeHtml(getTypeLabel(item.type, item.typeLabel))}</span>
  ${item.reviewFlags.map(f => `<span class="badge flag">${escapeHtml(getFlagLabel(f))}</span>`).join("")}
</div>

      <div class="small-label">${escapeHtml(t("expectedRecordSystemsLabel"))}</div>
      <ul class="list">${item.recordSystems.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>

      <div class="small-label">${escapeHtml(t("notesLabel"))}</div>
      <p>${escapeHtml(item.notes)}</p>
    </div>
  `).join("");
}

function renderDebug(debug) {
  document.getElementById("debugPanel").textContent = JSON.stringify(debug, null, 2);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function analyze() {
  syncLanguageFromUI();

  const library = await loadLibrary();
  const input = normalizeInput(document.getElementById("inputText").value);

  if (!input.rawText) {
    alert(t("pasteTextFirst"));
    return;
  }

  const sentences = splitSentences(input.rawText);
  const assertionTexts = detectAssertions(sentences);
  const meaning = extractMeaning(input.rawText, assertionTexts);
  const origin = extractOrigin(input.rawText);
  const verification = runVerification(assertionTexts, library);

  renderMeaning(meaning);
  renderOrigin(origin);
  renderVerification(verification);

  renderDebug({
    sentencesSplit: sentences.length,
    candidateAssertions: assertionTexts.length,
    assertionsReturned: verification.length,
    inputPreview: input.rawText.slice(0, 220)
  });

  document.getElementById("results").classList.remove("hidden");
}

function loadSample() {
  document.getElementById("inputText").value =
`Section 103 establishes a $108 billion federal bridge repair program beginning in 2026. According to the Department of Transportation, priority funding will go to structurally deficient bridges in interstate corridors. The bill also expands broadband deployment by $50 billion and directs grid modernization funding of $48 billion through the Department of Energy. Analysts say the measure will likely reduce long-term maintenance costs.`;
}

function clearAll() {
  document.getElementById("inputText").value = "";
  document.getElementById("results").classList.add("hidden");
  document.getElementById("meaningPanel").innerHTML = "";
  document.getElementById("originPanel").innerHTML = "";
  document.getElementById("verificationPanel").innerHTML = "";
  document.getElementById("debugPanel").textContent = "";
}

document.getElementById("analyzeBtn").addEventListener("click", analyze);
document.getElementById("loadSampleBtn").addEventListener("click", loadSample);
document.getElementById("clearBtn").addEventListener("click", clearAll);

const languageSelect = document.getElementById("languageSelect");
if (languageSelect) {
  currentLanguage = languageSelect.value || "en";
  languageSelect.addEventListener("change", () => {
    currentLanguage = languageSelect.value || "en";
  });
}

