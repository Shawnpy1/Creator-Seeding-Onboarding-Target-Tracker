/**
 * Creator Seeding & Onboarding Target Tracker
 * Complete Interactive Application Logic & Dual-Axis Canvas Renderer
 * Purple Theme Edition with Customizable Scenario Naming
 */

(() => {
  'use strict';

  // --- Initial Default State ---
  const DEFAULT_STATE = {
    scenarioName: 'Star Digital Campaign (500 Goal @ 35%)',
    cumulativeTarget: 500,
    conversionRate: 35.0,
    baselineSeeded: 0,
    campaignDays: 5
  };

  // Active working state
  let state = { ...DEFAULT_STATE };

  // Empty default scenarios list (starts completely clean)
  const PRESET_SCENARIOS = [];

  // DOM Elements
  const elements = {
    displaySubtitle: document.getElementById('displaySubtitle'),
    kpiConversionRate: document.getElementById('kpiConversionRate'),
    kpiDailyTarget: document.getElementById('kpiDailyTarget'),
    kpiTotalTarget: document.getElementById('kpiTotalTarget'),
    kpiTotalTargetLabel: document.getElementById('kpiTotalTargetLabel'),
    kpiCumulativeTarget: document.getElementById('kpiCumulativeTarget'),
    kpiCumulativeDenominator: document.getElementById('kpiCumulativeDenominator'),
    legendGoalText: document.getElementById('legendGoalText'),

    // Sliders & Direct Inputs
    conversionSlider: document.getElementById('conversionSlider'),
    conversionNumberInput: document.getElementById('conversionNumberInput'),
    cumulativeTargetInput: document.getElementById('cumulativeTargetInput'),
    baselineInput: document.getElementById('baselineInput'),
    campaignDaysSelect: document.getElementById('campaignDaysSelect'),
    customDaysInput: document.getElementById('customDaysInput'),
    scenarioNameDirectInput: document.getElementById('scenarioNameDirectInput'),
    btnQuickSaveName: document.getElementById('btnQuickSaveName'),

    // Canvas
    trackerChart: document.getElementById('trackerChart'),
    chartTooltip: document.getElementById('chartTooltip'),

    // Export & Dropdown
    btnExportMenu: document.getElementById('btnExportMenu'),
    exportDropdown: document.getElementById('exportDropdown'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    exportPngBtn: document.getElementById('exportPngBtn'),
    copyClipboardBtn: document.getElementById('copyClipboardBtn'),
    printReportBtn: document.getElementById('printReportBtn'),

    // Scenarios & Modals
    savedScenarioCount: document.getElementById('savedScenarioCount'),
    btnOpenScenarioModal: document.getElementById('btnOpenScenarioModal'),
    btnSaveCurrentScenario: document.getElementById('btnSaveCurrentScenario'),
    scenarioModal: document.getElementById('scenarioModal'),
    closeScenarioModalBtn: document.getElementById('closeScenarioModalBtn'),
    btnModalSaveNew: document.getElementById('btnModalSaveNew'),
    scenarioListContainer: document.getElementById('scenarioListContainer'),

    // Name Prompt Modal
    namePromptModal: document.getElementById('namePromptModal'),
    namePromptModalTitle: document.getElementById('namePromptModalTitle'),
    scenarioNameInput: document.getElementById('scenarioNameInput'),
    confirmSaveScenarioBtn: document.getElementById('confirmSaveScenarioBtn'),
    cancelSaveScenarioBtn: document.getElementById('cancelSaveScenarioBtn'),
    closeNamePromptBtn: document.getElementById('closeNamePromptBtn'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // Local Storage Key (clean initial state)
  const STORAGE_KEY = 'star_digital_scenarios_v4_clean';

  // Modal Editing Mode
  let editingScenarioId = null;

  // --- Scenario Management in LocalStorage ---
  function getStoredScenarios() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load scenarios from localStorage:', e);
    }
    return [];
  }

  function saveStoredScenarios(scenarios) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
      updateScenarioCount();
    } catch (e) {
      console.error('Failed to save scenarios to localStorage:', e);
      showToast('Could not save to localStorage', 'error');
    }
  }

  function updateScenarioCount() {
    const list = getStoredScenarios();
    if (elements.savedScenarioCount) {
      elements.savedScenarioCount.textContent = list.length;
    }
  }

  // --- Core Mathematical Calculation Engine ---
  function calculateModel() {
    const target = Math.max(1, Math.round(Number(state.cumulativeTarget) || 500));
    const baseline = Math.max(0, Math.round(Number(state.baselineSeeded) || 0));
    const ratePercent = Math.max(0.1, Math.min(100, Number(state.conversionRate) || 35.0));
    const rateDecimal = ratePercent / 100.0;
    const days = Math.max(1, Math.min(60, Math.round(Number(state.campaignDays) || 5)));

    const neededSeeded = Math.max(0, target - baseline);

    // Goal-Driven Requirement calculation (replicates screenshot):
    // 500 - 313 = 187 seeded needed. 187 / 0.35 = 534.28 -> 535 total onboardings required.
    const totalOnboardTarget = Math.ceil(neededSeeded / rateDecimal);
    const dailyOnboardTarget = Math.ceil(totalOnboardTarget / days);
    const normalizedTotalTarget = dailyOnboardTarget * days;

    const dailyExpectedSeeded = dailyOnboardTarget * rateDecimal;

    // Daily breakdown schedule
    const dailySchedule = [];
    let currentCumulative = baseline;

    for (let i = 0; i < days; i++) {
      const dayNum = i + 1;
      currentCumulative += dailyExpectedSeeded;

      // On final day, snap to target if within rounding margin
      let plannedCum = currentCumulative;
      if (i === days - 1 && Math.abs(plannedCum - target) < 1.5) {
        plannedCum = target;
      }

      dailySchedule.push({
        day: dayNum,
        dayLabel: `Day ${dayNum}`,
        dailyTargetOnboard: dailyOnboardTarget,
        dailyExpectedSeeded: dailyExpectedSeeded,
        projectedCumulativeSeeded: plannedCum
      });
    }

    return {
      target,
      baseline,
      ratePercent,
      rateDecimal,
      days,
      neededSeeded,
      dailyOnboardTarget,
      totalOnboardTarget: normalizedTotalTarget,
      dailyExpectedSeeded,
      dailySchedule
    };
  }

  // --- UI Update Function ---
  function updateUI() {
    const model = calculateModel();

    // 1. Update Subtitle
    if (elements.displaySubtitle) {
      elements.displaySubtitle.textContent = `${model.days}-day daily onboarding requirement & cumulative progress toward ${model.target.toLocaleString()} seeded creators`;
    }

    // 2. Update 4 KPI Cards
    if (elements.kpiConversionRate) {
      elements.kpiConversionRate.textContent = `${model.ratePercent.toFixed(1)}%`;
    }
    if (elements.kpiDailyTarget) {
      elements.kpiDailyTarget.textContent = model.dailyOnboardTarget.toLocaleString();
    }
    if (elements.kpiTotalTargetLabel) {
      elements.kpiTotalTargetLabel.textContent = `${model.days}-Day Total Target`;
    }
    if (elements.kpiTotalTarget) {
      elements.kpiTotalTarget.textContent = model.totalOnboardTarget.toLocaleString();
    }
    if (elements.kpiCumulativeTarget) {
      elements.kpiCumulativeTarget.textContent = model.target.toLocaleString();
    }
    if (elements.kpiCumulativeDenominator) {
      elements.kpiCumulativeDenominator.textContent = `/ ${model.target.toLocaleString()}`;
    }

    // 3. Update Legend Goal Text
    if (elements.legendGoalText) {
      elements.legendGoalText.textContent = `${model.target.toLocaleString()} Goal Line`;
    }

    // 4. Update Inputs (without breaking active focus)
    if (document.activeElement !== elements.conversionSlider) {
      elements.conversionSlider.value = model.ratePercent;
    }
    if (document.activeElement !== elements.conversionNumberInput) {
      elements.conversionNumberInput.value = model.ratePercent.toFixed(1);
    }
    if (document.activeElement !== elements.cumulativeTargetInput) {
      elements.cumulativeTargetInput.value = model.target;
    }
    if (document.activeElement !== elements.baselineInput) {
      elements.baselineInput.value = model.baseline;
    }
    if (document.activeElement !== elements.scenarioNameDirectInput && elements.scenarioNameDirectInput) {
      elements.scenarioNameDirectInput.value = state.scenarioName;
    }

    // 5. Draw Purple Dual-Axis Chart
    renderChart(model);
  }

  // --- Dual-Axis Chart Canvas Renderer (Purple Theme) ---
  let hoveredDayIndex = -1;

  function renderChart(model) {
    const canvas = elements.trackerChart;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Get client dimensions
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 760;
    const height = rect.height || 380;

    // Adjust canvas resolution for crisp HiDPI displays
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Padding bounds for chart plot area
    const padding = {
      top: 36,
      right: 76,
      bottom: 52,
      left: 76
    };

    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    if (plotWidth <= 0 || plotHeight <= 0) {
      ctx.restore();
      return;
    }

    // Determine Y-Axes Bounds
    // Left Axis: Daily Onboarded Target (starts at 0)
    const leftMax = Math.max(10, Math.ceil((model.dailyOnboardTarget * 1.4) / 50) * 50);
    const leftMin = 0;

    // Right Axis: Cumulative Seeded
    const rawRightMin = model.baseline > 0 ? Math.floor((model.baseline * 0.9) / 50) * 50 : 0;
    const rawRightMax = Math.ceil((model.target * 1.05) / 20) * 20;
    const rightMin = Math.min(rawRightMin, Math.floor(model.baseline));
    const rightMax = Math.max(rawRightMax, model.target + 10);

    // Coordinate conversion
    function getYLeft(val) {
      return padding.top + plotHeight - ((val - leftMin) / (leftMax - leftMin)) * plotHeight;
    }

    function getYRight(val) {
      return padding.top + plotHeight - ((val - rightMin) / (rightMax - rightMin)) * plotHeight;
    }

    const numDays = model.days;
    const colStep = plotWidth / numDays;

    function getXCenter(dayIdx) {
      return padding.left + (dayIdx + 0.5) * colStep;
    }

    // 1. Draw Subtle Horizontal Grid Lines & Ticks (Purple tinted)
    const numGridLines = 4;
    ctx.strokeStyle = '#f3e8ff';
    ctx.lineWidth = 1;
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6e6182';

    for (let i = 0; i <= numGridLines; i++) {
      const frac = i / numGridLines;
      const y = padding.top + plotHeight * (1 - frac);

      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotWidth, y);
      ctx.stroke();

      // Left axis label
      const leftVal = Math.round(leftMin + frac * (leftMax - leftMin));
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(leftVal.toString(), padding.left - 12, y);

      // Right axis label
      const rightVal = Math.round(rightMin + frac * (rightMax - rightMin));
      ctx.textAlign = 'left';
      ctx.fillText(rightVal.toString(), padding.left + plotWidth + 12, y);
    }

    // 2. Draw Left & Right Axis Titles (Rotated Vertical Text)
    ctx.save();
    ctx.font = 'italic 500 12.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6e6182';

    // Left Axis Title: "Daily Onboarded Target"
    ctx.save();
    ctx.translate(padding.left - 48, padding.top + plotHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Daily Onboarded Target', 0, 0);
    ctx.restore();

    // Right Axis Title: "Cumulative Seeded"
    ctx.save();
    ctx.translate(padding.left + plotWidth + 50, padding.top + plotHeight / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Cumulative Seeded', 0, 0);
    ctx.restore();

    ctx.restore();

    // 3. Draw Green Goal Line (Dashed horizontal line at Target Seeded coordinate)
    const goalY = getYRight(model.target);
    ctx.save();
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2.2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(padding.left + colStep * 0.2, goalY);
    ctx.lineTo(padding.left + plotWidth - colStep * 0.2, goalY);
    ctx.stroke();
    ctx.restore();

    // 4. Draw Hover Column Highlight if applicable (Light Purple wash)
    if (hoveredDayIndex >= 0 && hoveredDayIndex < numDays) {
      const hx = padding.left + hoveredDayIndex * colStep;
      ctx.fillStyle = 'rgba(124, 58, 237, 0.08)';
      ctx.fillRect(hx, padding.top, colStep, plotHeight);
    }

    // 5. Draw Purple Bars (Daily Onboarded Target with Pill Tops)
    const barWidth = Math.min(46, Math.max(18, colStep * 0.44));
    const barRadius = Math.min(barWidth / 2, 12);

    for (let i = 0; i < numDays; i++) {
      const cx = getXCenter(i);
      const bx = cx - barWidth / 2;
      const targetVal = model.dailySchedule[i].dailyTargetOnboard;
      const by = getYLeft(targetVal);

      ctx.fillStyle = '#7c3aed'; // Vibrant Purple matching user request

      // Draw rectangle with rounded top corners
      ctx.beginPath();
      ctx.moveTo(bx, padding.top + plotHeight);
      ctx.lineTo(bx, by + barRadius);
      ctx.quadraticCurveTo(bx, by, bx + barRadius, by);
      ctx.lineTo(bx + barWidth - barRadius, by);
      ctx.quadraticCurveTo(bx + barWidth, by, bx + barWidth, by + barRadius);
      ctx.lineTo(bx + barWidth, padding.top + plotHeight);
      ctx.closePath();
      ctx.fill();

      // X-Axis Day Labels ("Day 1", "Day 2", etc.)
      ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#6e6182';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`Day  ${i + 1}`, cx, padding.top + plotHeight + 14);
    }

    // 6. Draw Fuchsia / Magenta-Purple Line & Markers (Cumulative Seeded)
    const points = [];
    for (let i = 0; i < numDays; i++) {
      const cx = getXCenter(i);
      const cumVal = model.dailySchedule[i].projectedCumulativeSeeded;
      const cy = getYRight(cumVal);
      points.push({ x: cx, y: cy, val: cumVal, day: i + 1 });
    }

    if (points.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#d946ef'; // Fuchsia / Magenta-Purple
      ctx.lineWidth = 3.2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Hollow circular white points with fuchsia border matching design
      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d946ef';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // --- Interactive Canvas Mouse Tracking & Tooltip ---
  function setupChartInteraction() {
    const canvas = elements.trackerChart;
    const tooltip = elements.chartTooltip;
    if (!canvas || !tooltip) return;

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const paddingLeft = 76;
      const paddingRight = 76;
      const plotWidth = rect.width - paddingLeft - paddingRight;

      if (mouseX < paddingLeft || mouseX > paddingLeft + plotWidth || mouseY < 30 || mouseY > rect.height - 40) {
        hoveredDayIndex = -1;
        tooltip.style.display = 'none';
        renderChart(calculateModel());
        return;
      }

      const colStep = plotWidth / state.campaignDays;
      const dayIdx = Math.floor((mouseX - paddingLeft) / colStep);

      if (dayIdx >= 0 && dayIdx < state.campaignDays) {
        hoveredDayIndex = dayIdx;
        const model = calculateModel();
        const sched = model.dailySchedule[dayIdx];

        tooltip.innerHTML = `
          <div class="tt-title">Day ${sched.day} Targets</div>
          <div class="tt-row"><span class="tt-label">Daily Onboard Target:</span> <span class="tt-val" style="color: #a78bfa">${sched.dailyTargetOnboard}</span></div>
          <div class="tt-row"><span class="tt-label">Expected Daily Seeded:</span> <span class="tt-val">${sched.dailyExpectedSeeded.toFixed(1)}</span></div>
          <div class="tt-row"><span class="tt-label">Cumulative Seeded:</span> <span class="tt-val" style="color: #f472b6">${Math.round(sched.projectedCumulativeSeeded)} / ${model.target}</span></div>
          <div class="tt-row"><span class="tt-label">Distance to Goal:</span> <span class="tt-val" style="color: #c4b5fd">${Math.max(0, model.target - Math.round(sched.projectedCumulativeSeeded))}</span></div>
        `;

        tooltip.style.display = 'block';
        tooltip.style.left = `${paddingLeft + (dayIdx + 0.5) * colStep}px`;
        tooltip.style.top = `${mouseY}px`;

        renderChart(model);
      }
    });

    canvas.addEventListener('mouseleave', () => {
      hoveredDayIndex = -1;
      tooltip.style.display = 'none';
      renderChart(calculateModel());
    });
  }

  // --- Toast Notification Helper ---
  function showToast(message, type = 'success') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${type === 'error' ? '#f87171' : '#c4b5fd'}" stroke-width="2.5">
        ${type === 'error' ? '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>' : '<polyline points="20 6 9 17 4 12"></polyline>'}
      </svg>
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // --- Export Handlers ---
  function exportCSV() {
    const model = calculateModel();
    let csv = `Scenario: ${state.scenarioName}\n`;
    csv += `Cumulative Target: ${model.target}, Conversion Rate: ${model.ratePercent}%, Duration: ${model.days} Days\n\n`;
    csv += 'Day,Day Label,Daily Onboard Target,Expected Seeded Per Day,Cumulative Seeded Expected,Target Goal\n';

    model.dailySchedule.forEach(row => {
      csv += `${row.day},"${row.dayLabel}",${row.dailyTargetOnboard},${row.dailyExpectedSeeded.toFixed(2)},${Math.round(row.projectedCumulativeSeeded)},${model.target}\n`;
    });

    const safeName = (state.scenarioName || 'scenario').replace(/[^a-z0-9_-]/gi, '_');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}-Target-${model.target}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported "${state.scenarioName}" to CSV`);
  }

  function exportJSON() {
    const model = calculateModel();
    const exportData = {
      app: 'Creator Seeding & Onboarding Target Tracker',
      scenarioName: state.scenarioName,
      exportedAt: new Date().toISOString(),
      parameters: {
        cumulativeTarget: model.target,
        conversionRatePercent: model.ratePercent,
        baselineSeeded: model.baseline,
        campaignDays: model.days,
        dailyOnboardTarget: model.dailyOnboardTarget,
        totalOnboardTarget: model.totalOnboardTarget
      },
      schedule: model.dailySchedule
    };

    const safeName = (state.scenarioName || 'scenario').replace(/[^a-z0-9_-]/gi, '_');
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported "${state.scenarioName}" to JSON`);
  }

  function exportPNG() {
    const canvas = elements.trackerChart;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const model = calculateModel();

    // Layout constants (all in logical px, multiply by dpr for physical)
    const logicalW = canvas.width / dpr;       // canvas logical width
    const headerH  = 100;                       // branding header
    const kpiH     = 130;                       // KPI cards row
    const chartH   = canvas.height / dpr;      // chart logical height
    const totalLogH = headerH + kpiH + chartH;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width  = canvas.width;
    exportCanvas.height = Math.round(totalLogH * dpr);

    const ctx = exportCanvas.getContext('2d');

    // ── Background ──────────────────────────────────────────────────────────
    ctx.fillStyle = '#fbf9fe';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // White content area
    ctx.fillStyle = '#ffffff';
    const pad = 24 * dpr;
    ctx.fillRect(pad, pad, exportCanvas.width - pad * 2, exportCanvas.height - pad * 2);

    // ── Branding header ──────────────────────────────────────────────────────
    // Purple accent bar
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(44 * dpr, 32 * dpr, 4 * dpr, 55 * dpr);

    ctx.font = `700 ${13 * dpr}px "Outfit", sans-serif`;
    ctx.fillStyle = '#7c3aed';
    ctx.fillText('STAR DIGITAL AFFILIATE MARKETING', 56 * dpr, 47 * dpr);

    ctx.font = `700 ${20 * dpr}px "Outfit", sans-serif`;
    ctx.fillStyle = '#190e2b';
    ctx.fillText(state.scenarioName, 56 * dpr, 72 * dpr);

    ctx.font = `500 ${12 * dpr}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = '#5e5173';
    ctx.fillText(
      `${model.days}-Day Campaign \u00b7 ${model.target.toLocaleString()} Seeded Creators \u00b7 ${model.ratePercent.toFixed(1)}% Conversion`,
      56 * dpr, 92 * dpr
    );

    // ── KPI Cards row ────────────────────────────────────────────────────────
    const kpiCards = [
      { label: 'Conversion Rate',                value: `${model.ratePercent.toFixed(1)}%` },
      { label: 'Daily Onboard Target',            value: `${model.dailyOnboardTarget.toLocaleString()}/day` },
      { label: `${model.days}-Day Total Target`,  value: model.totalOnboardTarget.toLocaleString() },
      { label: 'Cumulative Target',               value: `${model.target.toLocaleString()} / ${model.target.toLocaleString()}` }
    ];

    const kpiTop    = headerH * dpr;
    const kpiPad    = 18 * dpr;
    const cardGap   = 12 * dpr;
    const totalCardW = exportCanvas.width - kpiPad * 2;
    const cardW     = (totalCardW - cardGap * 3) / 4;
    const cardH     = (kpiH - 28) * dpr;
    const cardY     = kpiTop + 14 * dpr;
    const radius    = 10 * dpr;

    kpiCards.forEach((card, i) => {
      const cardX = kpiPad + i * (cardW + cardGap);

      // Card background
      ctx.fillStyle = '#f6f0fb';
      ctx.beginPath();
      ctx.moveTo(cardX + radius, cardY);
      ctx.lineTo(cardX + cardW - radius, cardY);
      ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + radius);
      ctx.lineTo(cardX + cardW, cardY + cardH - radius);
      ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - radius, cardY + cardH);
      ctx.lineTo(cardX + radius, cardY + cardH);
      ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - radius);
      ctx.lineTo(cardX, cardY + radius);
      ctx.quadraticCurveTo(cardX, cardY, cardX + radius, cardY);
      ctx.closePath();
      ctx.fill();

      // Card border
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      // Top purple accent line
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(cardX, cardY, cardW, 3 * dpr);

      // Label
      ctx.font = `500 ${10.5 * dpr}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = '#7c3aed';
      ctx.textAlign = 'center';
      ctx.fillText(card.label.toUpperCase(), cardX + cardW / 2, cardY + 24 * dpr);

      // Value
      ctx.font = `700 ${19 * dpr}px "Outfit", sans-serif`;
      ctx.fillStyle = '#190e2b';
      ctx.fillText(card.value, cardX + cardW / 2, cardY + 52 * dpr);

      ctx.textAlign = 'left';
    });

    // ── Chart canvas ─────────────────────────────────────────────────────────
    ctx.drawImage(canvas, 0, (headerH + kpiH) * dpr);

    // ── Export ────────────────────────────────────────────────────────────────
    const safeName = (state.scenarioName || 'scenario').replace(/[^a-z0-9_-]/gi, '_');
    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeName}-Snapshot.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Full dashboard snapshot exported as PNG');
    });
  }

  function copyTableToClipboard() {
    const model = calculateModel();
    let tsv = `Scenario\t${state.scenarioName}\n`;
    tsv += 'Day\tDaily Target Onboarded\tExpected Seeded/Day\tCumulative Seeded\n';

    model.dailySchedule.forEach(row => {
      tsv += `${row.dayLabel}\t${row.dailyTargetOnboard}\t${row.dailyExpectedSeeded.toFixed(1)}\t${Math.round(row.projectedCumulativeSeeded)}\n`;
    });

    navigator.clipboard.writeText(tsv).then(() => {
      showToast('Copied schedule data to clipboard');
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
      showToast('Failed to copy to clipboard', 'error');
    });
  }

  // --- Scenario Management & Custom Naming UI ---
  function openScenarioModal() {
    renderScenarioList();
    elements.scenarioModal.classList.add('open');
  }

  function closeScenarioModal() {
    elements.scenarioModal.classList.remove('open');
  }

  function renderScenarioList() {
    const container = elements.scenarioListContainer;
    if (!container) return;

    const list = getStoredScenarios();
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = `<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No saved scenarios yet.</p>`;
      return;
    }

    list.forEach((sc, idx) => {
      const item = document.createElement('div');
      item.className = 'scenario-item';

      const dateStr = sc.timestamp ? new Date(sc.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

      item.innerHTML = `
        <div class="scenario-info">
          <div class="scenario-info-title">
            <span>${sc.name}</span>
            <button class="btn btn-ghost btn-sm btn-rename-scenario" data-index="${idx}" title="Rename this scenario" style="padding: 2px 6px; font-size: 11px;">
              ✏️ Rename
            </button>
          </div>
          <div class="scenario-info-meta">
            Target: <strong>${sc.cumulativeTarget}</strong> &bull; 
            Conv: <strong>${Number(sc.conversionRate).toFixed(1)}%</strong> &bull; 
            Duration: <strong>${sc.campaignDays} Days</strong> &bull; 
            Base: <strong>${sc.baselineSeeded || 0}</strong>
            ${dateStr ? ` &bull; <span style="color: var(--text-muted)">${dateStr}</span>` : ''}
          </div>
        </div>
        <div class="scenario-item-actions">
          <button class="btn btn-sm btn-primary btn-load-scenario" data-index="${idx}">Load</button>
          ${!sc.isSystem ? `<button class="btn btn-sm btn-ghost btn-delete-scenario" data-index="${idx}" title="Delete" style="color: #ef4444">&times;</button>` : ''}
        </div>
      `;

      container.appendChild(item);
    });

    // Attach listeners
    container.querySelectorAll('.btn-load-scenario').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        loadScenarioByIndex(idx);
      });
    });

    container.querySelectorAll('.btn-rename-scenario').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        promptRenameScenario(idx);
      });
    });

    container.querySelectorAll('.btn-delete-scenario').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        deleteScenarioByIndex(idx);
      });
    });
  }

  function loadScenarioByIndex(index) {
    const list = getStoredScenarios();
    const sc = list[index];
    if (!sc) return;

    state.scenarioName = sc.name;
    state.cumulativeTarget = Number(sc.cumulativeTarget) || 500;
    state.conversionRate = Number(sc.conversionRate) || 35.0;
    state.baselineSeeded = Number(sc.baselineSeeded) || 0;
    state.campaignDays = Number(sc.campaignDays) || 5;

    // Sync select dropdown for days
    if (elements.campaignDaysSelect) {
      const matchOpt = Array.from(elements.campaignDaysSelect.options).find(o => parseInt(o.value, 10) === state.campaignDays);
      if (matchOpt) {
        elements.campaignDaysSelect.value = state.campaignDays.toString();
        elements.customDaysInput.classList.add('hidden');
      } else {
        elements.campaignDaysSelect.value = 'custom';
        elements.customDaysInput.value = state.campaignDays;
        elements.customDaysInput.classList.remove('hidden');
      }
    }

    closeScenarioModal();
    updateUI();
    showToast(`Loaded scenario: "${sc.name}"`);
  }

  function deleteScenarioByIndex(index) {
    const list = getStoredScenarios();
    const removed = list.splice(index, 1);
    saveStoredScenarios(list);
    renderScenarioList();
    showToast(`Deleted scenario "${removed[0]?.name || ''}"`);
  }

  function promptRenameScenario(index) {
    const list = getStoredScenarios();
    const sc = list[index];
    if (!sc) return;

    editingScenarioId = sc.id;
    elements.namePromptModalTitle.textContent = 'Rename Scenario';
    elements.scenarioNameInput.value = sc.name;
    elements.namePromptModal.classList.add('open');
    elements.scenarioNameInput.focus();
    elements.scenarioNameInput.select();
  }

  function promptSaveCurrentScenario() {
    editingScenarioId = null; // New save mode
    elements.namePromptModalTitle.textContent = 'Save Scenario';
    elements.scenarioNameInput.value = state.scenarioName || `${state.cumulativeTarget} Target @ ${Number(state.conversionRate).toFixed(1)}% Conv`;
    elements.namePromptModal.classList.add('open');
    elements.scenarioNameInput.focus();
    elements.scenarioNameInput.select();
  }

  function confirmSaveScenario() {
    const customName = elements.scenarioNameInput.value.trim() || `Scenario ${Date.now()}`;
    const list = getStoredScenarios();

    if (editingScenarioId) {
      // Renaming an existing scenario
      const targetIndex = list.findIndex(s => s.id === editingScenarioId);
      if (targetIndex >= 0) {
        list[targetIndex].name = customName;
        list[targetIndex].timestamp = new Date().toISOString();
        if (state.scenarioName === list[targetIndex].name) {
          state.scenarioName = customName;
        }
        saveStoredScenarios(list);
        renderScenarioList();
        updateUI();
        showToast(`Renamed to "${customName}"`);
      }
    } else {
      // Creating a new saved scenario
      state.scenarioName = customName;
      const newScenario = {
        id: `custom-${Date.now()}`,
        name: customName,
        timestamp: new Date().toISOString(),
        isSystem: false,
        cumulativeTarget: state.cumulativeTarget,
        conversionRate: state.conversionRate,
        baselineSeeded: state.baselineSeeded,
        campaignDays: state.campaignDays
      };

      list.unshift(newScenario); // Prepend to top
      saveStoredScenarios(list);
      updateUI();
      showToast(`Saved scenario "${customName}"!`);
    }

    elements.namePromptModal.classList.remove('open');
    updateScenarioCount();
  }

  // --- Attach Event Listeners ---
  function setupEvents() {
    // 1. Direct Scenario Name Input & Quick Save Button
    if (elements.scenarioNameDirectInput) {
      elements.scenarioNameDirectInput.addEventListener('input', (e) => {
        state.scenarioName = e.target.value;
      });
    }

    if (elements.btnQuickSaveName) {
      elements.btnQuickSaveName.addEventListener('click', () => {
        const customName = (elements.scenarioNameDirectInput?.value || state.scenarioName).trim() || 'Custom Scenario';
        state.scenarioName = customName;
        const list = getStoredScenarios();
        const newScenario = {
          id: `custom-${Date.now()}`,
          name: customName,
          timestamp: new Date().toISOString(),
          isSystem: false,
          cumulativeTarget: state.cumulativeTarget,
          conversionRate: state.conversionRate,
          baselineSeeded: state.baselineSeeded,
          campaignDays: state.campaignDays
        };
        list.unshift(newScenario);
        saveStoredScenarios(list);
        showToast(`Saved "${customName}" to scenarios!`);
      });
    }

    // 2. Conversion Rate Slider
    elements.conversionSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.conversionRate = val;
      elements.conversionNumberInput.value = val.toFixed(1);
      updateUI();
    });

    // 3. Conversion Number Input
    elements.conversionNumberInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0.1 && val <= 100) {
        state.conversionRate = val;
        elements.conversionSlider.value = val;
        updateUI();
      }
    });

    // 4. Cumulative Target Input
    elements.cumulativeTargetInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        state.cumulativeTarget = val;
        updateUI();
      }
    });

    // Quick Target Adjustment buttons (+/- 50, +100)
    document.querySelectorAll('[data-target-delta]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const delta = parseInt(e.currentTarget.getAttribute('data-target-delta'), 10);
        state.cumulativeTarget = Math.max(10, state.cumulativeTarget + delta);
        elements.cumulativeTargetInput.value = state.cumulativeTarget;
        updateUI();
      });
    });

    // 5. Baseline Input
    elements.baselineInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 0) {
        state.baselineSeeded = val;
        updateUI();
      }
    });

    // Quick Baseline Buttons
    document.getElementById('btnZeroBaseline')?.addEventListener('click', () => {
      state.baselineSeeded = 0;
      elements.baselineInput.value = 0;
      updateUI();
      showToast('Baseline set to 0 (Fresh Start)');
    });

    document.getElementById('btnStandardBaseline')?.addEventListener('click', () => {
      state.baselineSeeded = 313;
      elements.baselineInput.value = 313;
      updateUI();
      showToast('Baseline set to 313 (Current Baseline)');
    });

    // 6. Campaign Days Select
    elements.campaignDaysSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'custom') {
        elements.customDaysInput.classList.remove('hidden');
        state.campaignDays = parseInt(elements.customDaysInput.value, 10) || 5;
      } else {
        elements.customDaysInput.classList.add('hidden');
        state.campaignDays = parseInt(val, 10);
      }
      updateUI();
    });

    elements.customDaysInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val >= 1 && val <= 60) {
        state.campaignDays = val;
        updateUI();
      }
    });

    // Quick Day Buttons (3d, 5d, 7d, 14d)
    document.querySelectorAll('.day-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const days = parseInt(e.currentTarget.getAttribute('data-days'), 10);
        state.campaignDays = days;
        elements.campaignDaysSelect.value = days.toString();
        elements.customDaysInput.classList.add('hidden');
        updateUI();
        showToast(`Campaign duration set to ${days} days`);
      });
    });

    // 7. Preset Pills
    document.querySelectorAll('.preset-pills .pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.preset-pills .pill-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const preset = e.currentTarget.getAttribute('data-preset');
        if (preset === 'target500' || preset === 'standard' || preset === 'original') {
          state.scenarioName = 'Star Digital Campaign (500 Goal @ 35%)';
          state.cumulativeTarget = 500;
          state.conversionRate = 35.0;
          state.baselineSeeded = 0;
          state.campaignDays = 5;
        } else if (preset === 'target1000') {
          state.scenarioName = 'Star Digital Sprint (1,000 Goal @ 40%)';
          state.cumulativeTarget = 1000;
          state.conversionRate = 40.0;
          state.baselineSeeded = 0;
          state.campaignDays = 7;
        } else if (preset === 'target2500') {
          state.scenarioName = 'Star Digital Scale (2,500 Goal @ 45%)';
          state.cumulativeTarget = 2500;
          state.conversionRate = 45.0;
          state.baselineSeeded = 0;
          state.campaignDays = 14;
        }

        elements.campaignDaysSelect.value = state.campaignDays.toString();
        elements.customDaysInput.classList.add('hidden');
        updateUI();
        showToast(`Preset activated: ${state.scenarioName}`);
      });
    });

    // 8. Export Dropdown Menu
    elements.btnExportMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.exportDropdown.parentElement.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!elements.btnExportMenu.contains(e.target)) {
        elements.exportDropdown.parentElement.classList.remove('open');
      }
    });

    // Export Options
    elements.exportCsvBtn.addEventListener('click', () => {
      elements.exportDropdown.parentElement.classList.remove('open');
      exportCSV();
    });

    elements.exportJsonBtn.addEventListener('click', () => {
      elements.exportDropdown.parentElement.classList.remove('open');
      exportJSON();
    });

    elements.exportPngBtn.addEventListener('click', () => {
      elements.exportDropdown.parentElement.classList.remove('open');
      exportPNG();
    });

    elements.copyClipboardBtn.addEventListener('click', () => {
      elements.exportDropdown.parentElement.classList.remove('open');
      copyTableToClipboard();
    });

    elements.printReportBtn.addEventListener('click', () => {
      elements.exportDropdown.parentElement.classList.remove('open');
      window.print();
    });

    // 9. Modals
    elements.btnOpenScenarioModal.addEventListener('click', openScenarioModal);
    elements.closeScenarioModalBtn.addEventListener('click', closeScenarioModal);

    elements.btnSaveCurrentScenario.addEventListener('click', promptSaveCurrentScenario);
    elements.btnModalSaveNew.addEventListener('click', () => {
      closeScenarioModal();
      promptSaveCurrentScenario();
    });

    elements.confirmSaveScenarioBtn.addEventListener('click', confirmSaveScenario);
    elements.cancelSaveScenarioBtn.addEventListener('click', () => {
      elements.namePromptModal.classList.remove('open');
    });
    elements.closeNamePromptBtn.addEventListener('click', () => {
      elements.namePromptModal.classList.remove('open');
    });

    // Close modal on escape or background click
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        elements.scenarioModal.classList.remove('open');
        elements.namePromptModal.classList.remove('open');
      }
    });

    [elements.scenarioModal, elements.namePromptModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });

    // Window Resize Handler for Chart Canvas
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        renderChart(calculateModel());
      }, 100);
    });
  }

  // --- App Initialization ---
  function init() {
    updateScenarioCount();
    setupEvents();
    setupChartInteraction();
    updateUI();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
