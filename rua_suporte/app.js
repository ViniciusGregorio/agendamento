(() => {
  "use strict";

  const STORAGE_KEY = "rotavini:data:v1";
  const CLIENT_STAGES = [
    ["prospect", "Prospectar"],
    ["contacted", "Contato feito"],
    ["meeting", "Reunião"],
    ["proposal", "Proposta"],
    ["demo", "Experiência"],
    ["active", "Cliente ativo"],
    ["inactive", "Inativo"]
  ];
  const DEAL_STAGES = [
    ["proposal", "Proposta"],
    ["demo", "Experiência"],
    ["sold", "Fechado"],
    ["delivery", "Em entrega"],
    ["delivered", "Entregue"],
    ["lost", "Perdido"]
  ];
  const PERIOD_LABELS = { day: "Hoje", week: "Esta semana", month: "Este mês" };
  const ICONS = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    users: '<path d="M16 19v-1.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5V19M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 8a2.5 2.5 0 0 1 0 5"/>',
    briefcase: '<path d="M4 8h16v11H4zM8 8V5h8v3M4 12h16M10 12v2h4v-2"/>',
    wallet: '<path d="M4 7h16v12H4zM4 10h16M16 15h2M7 4h10"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h2c5 0 0-12 6-12"/>',
    phone: '<path d="M7 4 4.8 6.2c-1.1 1.1 1 5.1 4.6 8.7s7.6 5.7 8.7 4.6l2.2-2.2-4-3-2 2c-1.3-.6-2.6-1.6-3.8-2.8s-2.2-2.5-2.8-3.8l2-2z"/>',
    message: '<path d="M5 18 3 21l4.5-1.4A9 9 0 1 0 5 18Z"/>',
    map: '<path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    money: '<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.7-.7-1.6-1-2.8-1-1.4 0-2.5.7-2.5 1.8 0 3 5.2 1.3 5.2 4.5 0 1.2-1.1 2-2.7 2-1.3 0-2.4-.4-3.2-1.2M12 5.5v13"/>',
    trend: '<path d="m4 16 5-5 4 3 7-7M15 7h5v5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/>',
    edit: '<path d="m4 16-.8 4 4-.8L18 8.4 14.6 5zM13.5 6.1l3.4 3.4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4m8-4v4M3 10h18"/>',
    download: '<path d="M12 3v11m0 0 4-4m-4 4-4-4M5 18v3h14v-3"/>',
    upload: '<path d="M12 16V5m0 0 4 4m-4-4L8 9M5 18v3h14v-3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.8-1.8l.9-1.9L15 4l-1.9.9a7 7 0 0 0-1.8-.8L10.5 2h-3l-.7 2a7 7 0 0 0-1.8.8L3.1 4 1 6.1 1.9 8a7 7 0 0 0-.8 1.8l-2 .7v3l2 .7A7 7 0 0 0 2 16l-.9 1.9L3.2 20l1.9-.9a7 7 0 0 0 1.8.8l.7 2h3l.7-2a7 7 0 0 0 1.8-.8l1.9.9 2.1-2.1-.9-1.9a7 7 0 0 0 .8-1.8z" transform="translate(2 0) scale(.83)"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
    external: '<path d="M14 4h6v6m0-6-9 9M18 13v7H4V6h7"/>',
    spark: '<path d="m12 2 1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    play: '<path d="m8 5 11 7-11 7z"/>',
    filter: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    link: '<path d="M10 13a4 4 0 0 0 5.7 0l2.8-2.8a4 4 0 0 0-5.7-5.7L11.2 6M14 11a4 4 0 0 0-5.7 0l-2.8 2.8a4 4 0 0 0 5.7 5.7l1.6-1.5"/>'
  };

  const ui = {
    view: "today",
    clientSearch: "",
    clientFilter: "all",
    dealFilter: "all",
    financeFilter: "all",
    reviewPeriod: "day",
    installPrompt: null,
    timerInterval: null
  };

  function icon(name, className = "") {
    return `<svg class="${className}" aria-hidden="true" viewBox="0 0 24 24">${ICONS[name] || ICONS.plus}</svg>`;
  }

  function uid(prefix = "id") {
    const random = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `${prefix}-${random}`;
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function localDateKey(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function localDateTimeValue(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    return `${localDateKey(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function dateFrom(value) {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date(`${value}T12:00:00`);
    return new Date(value);
  }

  function addDays(value, amount) {
    const date = dateFrom(value) || new Date();
    const result = new Date(date);
    result.setDate(result.getDate() + Number(amount));
    return result;
  }

  function addMonths(value, amount) {
    const date = dateFrom(value) || new Date();
    const originalDay = date.getDate();
    const result = new Date(date);
    result.setDate(1);
    result.setMonth(result.getMonth() + Number(amount));
    const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
    result.setDate(Math.min(originalDay, lastDay));
    return result;
  }

  function money(value, compact = false) {
    const numeric = Number(value) || 0;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: compact && Math.abs(numeric) >= 10000 ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : 2
    }).format(numeric);
  }

  function formatNumber(value, digits = 0) {
    return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: digits }).format(Number(value) || 0);
  }

  function dateLabel(value, options = {}) {
    const date = dateFrom(value);
    if (!date || Number.isNaN(date.getTime())) return "Sem data";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: options.long ? "long" : "short",
      year: options.year ? "numeric" : undefined,
      ...options.extra
    }).format(date).replace(" de ", " ");
  }

  function dayGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  function durationLabel(minutes) {
    const total = Math.max(0, Math.floor(Number(minutes) || 0));
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    if (!hours) return `${mins} min`;
    return `${hours}h${mins ? ` ${mins}min` : ""}`;
  }

  function clockLabel(milliseconds) {
    const total = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  function h(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function phoneDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function clientInitials(client) {
    return String(client?.business || client?.name || "C")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function stageLabel(value, type = "client") {
    const source = type === "deal" ? DEAL_STAGES : CLIENT_STAGES;
    return source.find(([key]) => key === value)?.[1] || value || "Sem etapa";
  }

  function stageTone(value) {
    if (["active", "sold", "delivered"].includes(value)) return "green";
    if (["demo", "proposal", "delivery"].includes(value)) return "warm";
    if (["lost", "inactive"].includes(value)) return "danger";
    if (["meeting", "contacted"].includes(value)) return "blue";
    return "neutral";
  }

  function defaultState() {
    return {
      version: 1,
      settings: {
        ownerName: "Vini",
        initialCash: 0,
        reserve: 0,
        goals: {
          day: { profit: 300, sales: 1, clients: 5 },
          week: { profit: 1500, sales: 5, clients: 25 },
          month: { profit: 6000, sales: 20, clients: 80 }
        }
      },
      clients: [],
      activities: [],
      deals: [],
      transactions: [],
      sessions: [],
      reviewNotes: {}
    };
  }

  function normalizeState(saved) {
    const clean = defaultState();
    if (!saved || typeof saved !== "object") return clean;
    return {
      ...clean,
      ...saved,
      settings: {
        ...clean.settings,
        ...(saved.settings || {}),
        goals: {
          ...clean.settings.goals,
          ...(saved.settings?.goals || {})
        }
      },
      clients: Array.isArray(saved.clients) ? saved.clients : [],
      activities: Array.isArray(saved.activities) ? saved.activities : [],
      deals: Array.isArray(saved.deals) ? saved.deals : [],
      transactions: Array.isArray(saved.transactions) ? saved.transactions : [],
      sessions: Array.isArray(saved.sessions) ? saved.sessions : [],
      reviewNotes: saved.reviewNotes && typeof saved.reviewNotes === "object" ? saved.reviewNotes : {}
    };
  }

  function loadState() {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    } catch (error) {
      console.warn("Não foi possível carregar os dados locais.", error);
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getRange(period = "day", anchor = new Date()) {
    const current = new Date(anchor);
    current.setHours(0, 0, 0, 0);
    let start = new Date(current);
    let end = new Date(current);
    if (period === "week") {
      const weekday = (current.getDay() + 6) % 7;
      start = addDays(current, -weekday);
      end = addDays(start, 6);
    } else if (period === "month") {
      start = new Date(current.getFullYear(), current.getMonth(), 1);
      end = new Date(current.getFullYear(), current.getMonth() + 1, 0);
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  function inRange(value, range) {
    const date = dateFrom(value);
    return date && date >= range.start && date <= range.end;
  }

  function transactionDate(transaction) {
    return transaction.status === "paid"
      ? transaction.paidAt || transaction.date || transaction.dueDate
      : transaction.dueDate || transaction.date;
  }

  function sessionMinutes(session, now = Date.now()) {
    const start = new Date(session.start).getTime();
    const end = session.end ? new Date(session.end).getTime() : now;
    return Math.max(0, (end - start) / 60000);
  }

  function periodMetrics(period = "day", anchor = new Date()) {
    const range = getRange(period, anchor);
    const paid = state.transactions.filter((item) => item.status === "paid" && inRange(transactionDate(item), range));
    const income = paid.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expenses = paid.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const deals = state.deals.filter((item) => ["sold", "delivery", "delivered"].includes(item.status) && inRange(item.closedAt || item.createdAt, range));
    const activities = state.activities.filter((item) => inRange(item.date, range));
    const clientsContacted = new Set(activities.map((item) => item.clientId).filter(Boolean)).size;
    const sessions = state.sessions.filter((item) => inRange(item.start, range));
    const minutes = sessions.reduce((sum, item) => sum + sessionMinutes(item), 0);
    const profit = income - expenses;
    return {
      range,
      income,
      expenses,
      profit,
      sales: deals.length,
      clients: clientsContacted,
      activities: activities.length,
      minutes,
      hourly: minutes > 0 ? profit / (minutes / 60) : 0
    };
  }

  function cashMetrics() {
    const paidIncome = state.transactions
      .filter((item) => item.type === "income" && item.status === "paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const paidExpenses = state.transactions
      .filter((item) => item.type === "expense" && item.status === "paid")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const receivable = state.transactions
      .filter((item) => item.type === "income" && item.status === "pending")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const committed = state.transactions
      .filter((item) => item.type === "expense" && item.status === "pending")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const balance = Number(state.settings.initialCash || 0) + paidIncome - paidExpenses;
    const available = balance - Number(state.settings.reserve || 0) - committed;
    return { paidIncome, paidExpenses, receivable, committed, balance, available };
  }

  function activeSession() {
    return state.sessions.find((item) => !item.end) || null;
  }

  function getClient(id) {
    return state.clients.find((item) => item.id === id) || null;
  }

  function getDeal(id) {
    return state.deals.find((item) => item.id === id) || null;
  }

  function sortedByDate(items, getter, direction = "asc") {
    return [...items].sort((a, b) => {
      const aTime = dateFrom(getter(a))?.getTime() || 0;
      const bTime = dateFrom(getter(b))?.getTime() || 0;
      return direction === "asc" ? aTime - bTime : bTime - aTime;
    });
  }

  function dueText(value) {
    const date = dateFrom(value);
    if (!date) return "Sem data";
    const today = dateFrom(localDateKey());
    const diff = Math.round((date - today) / 86400000);
    if (diff < -1) return `${Math.abs(diff)} dias atrasado`;
    if (diff === -1) return "Ontem";
    if (diff === 0) return "Hoje";
    if (diff === 1) return "Amanhã";
    return `Em ${diff} dias`;
  }

  function toast(message) {
    const root = document.querySelector("#toastRoot");
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    root.replaceChildren(element);
    window.setTimeout(() => element.remove(), 2800);
  }

  function clientOptions(selected = "", allowEmpty = true) {
    const items = [...state.clients].sort((a, b) => (a.business || a.name).localeCompare(b.business || b.name, "pt-BR"));
    return `${allowEmpty ? '<option value="">Nenhum cliente</option>' : '<option value="" disabled>Selecione</option>'}${items
      .map((client) => `<option value="${h(client.id)}" ${client.id === selected ? "selected" : ""}>${h(client.business || client.name)}</option>`)
      .join("")}`;
  }

  function stageOptions(source, selected) {
    return source.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
  }

  function emptyState(title, message, actionLabel = "", action = "") {
    return `<div class="empty-state">
      <span class="empty-icon">${icon("route")}</span>
      <h3>${h(title)}</h3>
      <p>${h(message)}</p>
      ${actionLabel ? `<button class="btn btn-secondary btn-small" type="button" data-action="${h(action)}">${icon("plus")} ${h(actionLabel)}</button>` : ""}
    </div>`;
  }

  function render() {
    const renderers = {
      today: renderToday,
      clients: renderClients,
      deals: renderDeals,
      finance: renderFinance,
      review: renderReview
    };
    const main = document.querySelector("#mainContent");
    main.innerHTML = (renderers[ui.view] || renderToday)();
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === ui.view));
    const contexts = {
      today: "Seu dia em movimento",
      clients: `${state.clients.length} cliente${state.clients.length === 1 ? "" : "s"}`,
      deals: "Propostas, experiências e entregas",
      finance: "Entradas, gastos e previsões",
      review: "Resultados e próximos passos"
    };
    document.querySelector("#headerContext").textContent = contexts[ui.view];
    updateTimerDisplay();
  }

  function renderToday() {
    const metrics = periodMetrics("day");
    const goals = state.settings.goals.day;
    const progress = goals.profit > 0 ? Math.max(0, Math.min(100, (metrics.profit / goals.profit) * 100)) : 0;
    const session = activeSession();
    const client = session ? getClient(session.clientId) : null;
    const today = localDateKey();
    const upcomingClients = sortedByDate(
      state.clients.filter((item) => item.nextActionAt && item.nextActionAt <= today && item.status !== "inactive"),
      (item) => item.nextActionAt
    ).slice(0, 4);
    const commitments = getCommitments().slice(0, 5);
    const hasData = state.clients.length || state.deals.length || state.transactions.length;

    return `<section class="view">
      <div class="page-heading">
        <div>
          <span class="eyebrow">${dateLabel(today, { long: true, extra: { weekday: "long" } })}</span>
          <h1>${dayGreeting()}, ${h(state.settings.ownerName || "Vini")}.</h1>
          <p>${hasData ? "Aqui está o que merece sua atenção agora." : "Comece cadastrando um cliente ou planejando o primeiro contato."}</p>
        </div>
      </div>

      <div class="hero-grid">
        <article class="daily-hero">
          <div class="hero-top">
            <div>
              <span class="eyebrow">Lucro de hoje</span>
              <div class="hero-value">${money(metrics.profit, true)}</div>
              <span class="hero-caption">${money(metrics.income)} recebido · ${money(metrics.expenses)} gasto</span>
            </div>
            <span class="status-chip" data-tone="warm">${formatNumber(progress)}%</span>
          </div>
          <div class="hero-progress"><span style="width:${progress}%"></span></div>
          <div class="hero-bottom">
            <span>Meta: ${money(goals.profit, true)}</span>
            <span>${progress >= 100 ? "Meta alcançada" : `Faltam ${money(Math.max(0, goals.profit - metrics.profit), true)}`}</span>
          </div>
          <div class="hero-actions">
            <button class="btn btn-primary btn-small" type="button" data-action="new-sale">${icon("briefcase")} Nova venda</button>
            <button class="btn btn-ghost btn-small" type="button" data-action="new-transaction" data-type="expense">${icon("wallet")} Gasto</button>
          </div>
        </article>

        <article class="timer-card ${session ? "is-running" : ""}">
          <div>
            <span class="eyebrow">${session ? h(session.mode) + " em andamento" : "Tempo de trabalho"}</span>
            <div id="timerValue" class="timer-value">${session ? clockLabel(Date.now() - new Date(session.start).getTime()) : durationLabel(metrics.minutes)}</div>
            <span class="muted small">${session ? h(client?.business || client?.name || "Sem cliente vinculado") : "Registrado hoje"}</span>
          </div>
          <button class="btn ${session ? "btn-ghost" : "btn-primary"}" type="button" data-action="${session ? "stop-timer" : "start-timer"}">
            ${icon(session ? "stop" : "play")} ${session ? "Encerrar" : "Iniciar"}
          </button>
        </article>
      </div>

      <div class="section metric-grid">
        ${metricCard("users", formatNumber(metrics.clients), "Clientes contatados", `${goals.clients || 0} na meta`)}
        ${metricCard("briefcase", formatNumber(metrics.sales), "Vendas fechadas", `${goals.sales || 0} na meta`)}
        ${metricCard("clock", money(metrics.hourly, true), "Lucro por hora", metrics.minutes ? durationLabel(metrics.minutes) : "Sem horas ainda")}
        ${metricCard("wallet", money(cashMetrics().available, true), "Livre para investir", `Reserva ${money(state.settings.reserve, true)}`)}
      </div>

      <section class="section">
        <div class="section-heading">
          <div><h2>Ações rápidas</h2><p>Registre enquanto acontece.</p></div>
        </div>
        <div class="quick-actions">
          ${quickAction("users", "Cliente", "new-client")}
          ${quickAction("phone", "Contato", "new-activity")}
          ${quickAction("briefcase", "Negócio", "new-sale")}
          ${quickAction("wallet", "Movimento", "new-transaction")}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div><h2>Próximos clientes</h2><p>Retornos vencidos ou marcados para hoje.</p></div>
          <button class="text-button" type="button" data-view="clients">Ver clientes</button>
        </div>
        <div class="item-list">
          ${upcomingClients.length ? upcomingClients.map(todayClientCard).join("") : emptyState("Agenda livre por enquanto", "Marque a próxima ação de um cliente para ela aparecer aqui.", "Planejar cliente", "new-client")}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div><h2>Prazos próximos</h2><p>Demonstrações, entregas e cobranças.</p></div>
          <button class="text-button" type="button" data-view="deals">Ver negócios</button>
        </div>
        <div class="item-list due-list">
          ${commitments.length ? commitments.map(commitmentCard).join("") : emptyState("Tudo em dia", "Quando houver uma experiência, entrega ou cobrança, o prazo aparecerá aqui.")}
        </div>
      </section>
    </section>`;
  }

  function metricCard(iconName, value, label, trend) {
    return `<article class="metric-card">
      <span class="metric-icon">${icon(iconName)}</span>
      <strong class="metric-value">${h(value)}</strong>
      <span class="metric-label">${h(label)}</span>
      <span class="metric-trend">${h(trend)}</span>
    </article>`;
  }

  function quickAction(iconName, label, action) {
    return `<button class="quick-action" type="button" data-action="${action}">${icon(iconName)}<span>${h(label)}</span></button>`;
  }

  function todayClientCard(client) {
    const next = client.nextActionAt ? dueText(client.nextActionAt) : "Sem data";
    return `<article class="list-card is-clickable" data-action="open-client" data-id="${h(client.id)}">
      <span class="client-avatar">${h(clientInitials(client))}</span>
      <div class="list-card-main">
        <div class="list-card-title">
          <h3>${h(client.business || client.name)}</h3>
          <span class="status-chip" data-tone="${stageTone(client.status)}">${h(stageLabel(client.status))}</span>
        </div>
        <p>${h(client.nextAction || "Fazer contato")} · ${h(next)}</p>
      </div>
      ${client.address ? `<button class="icon-button" type="button" data-action="open-map" data-id="${h(client.id)}" aria-label="Abrir rota">${icon("map")}</button>` : icon("arrow")}
    </article>`;
  }

  function getCommitments() {
    const items = [];
    const threshold = addDays(new Date(), 31);
    state.deals.forEach((deal) => {
      const client = getClient(deal.clientId);
      if (deal.status === "demo" && deal.demoEndDate && dateFrom(deal.demoEndDate) <= threshold) {
        items.push({ type: "Experiência", date: deal.demoEndDate, title: deal.name, subtitle: client?.business || client?.name || "Cliente", tone: "warm", action: "open-deal", id: deal.id });
      }
      if (["sold", "delivery"].includes(deal.status) && deal.deliveryDate && dateFrom(deal.deliveryDate) <= threshold) {
        items.push({ type: "Entrega", date: deal.deliveryDate, title: deal.name, subtitle: client?.business || client?.name || "Cliente", tone: "blue", action: "open-deal", id: deal.id });
      }
    });
    state.transactions
      .filter((item) => item.status === "pending" && item.dueDate && dateFrom(item.dueDate) <= threshold)
      .forEach((item) => {
        const client = getClient(item.clientId);
        items.push({
          type: item.type === "income" ? "Receber" : "Pagar",
          date: item.dueDate,
          title: item.notes || item.category,
          subtitle: `${client?.business || client?.name || "Geral"} · ${money(item.amount)}`,
          tone: item.type === "income" ? "green" : "danger",
          action: "open-transaction",
          id: item.id
        });
      });
    return sortedByDate(items, (item) => item.date);
  }

  function commitmentCard(item) {
    const date = dateFrom(item.date);
    return `<article class="list-card is-clickable" data-action="${h(item.action)}" data-id="${h(item.id)}">
      <span class="date-block"><span><strong>${pad(date.getDate())}</strong><small>${date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</small></span></span>
      <div class="list-card-main">
        <div class="list-card-title"><h3>${h(item.title)}</h3><span class="status-chip" data-tone="${h(item.tone)}">${h(item.type)}</span></div>
        <p>${h(item.subtitle)} · ${h(dueText(item.date))}</p>
      </div>
      ${icon("arrow")}
    </article>`;
  }

  function renderClients() {
    const search = ui.clientSearch.trim().toLocaleLowerCase("pt-BR");
    const filtered = state.clients.filter((client) => {
      const matchesSearch = !search || [client.name, client.business, client.phone, client.address].join(" ").toLocaleLowerCase("pt-BR").includes(search);
      const matchesStage = ui.clientFilter === "all" || client.status === ui.clientFilter;
      return matchesSearch && matchesStage;
    });
    const counts = Object.fromEntries(CLIENT_STAGES.map(([stage]) => [stage, state.clients.filter((item) => item.status === stage).length]));
    return `<section class="view">
      <div class="page-heading">
        <div><span class="eyebrow">Relacionamentos</span><h1>Clientes</h1><p>Saiba com quem falar e qual deve ser o próximo passo.</p></div>
        <button class="btn btn-primary" type="button" data-action="new-client">${icon("plus")} Novo cliente</button>
      </div>
      <div class="toolbar">
        <label class="search-box">${icon("search")}<input id="clientSearch" type="search" placeholder="Buscar nome, negócio ou telefone" value="${h(ui.clientSearch)}" /></label>
      </div>
      <div class="pipeline" aria-label="Filtrar por etapa">
        <button type="button" data-action="client-filter" data-filter="all" class="${ui.clientFilter === "all" ? "is-active" : ""}">Todos <span class="count">${state.clients.length}</span></button>
        ${CLIENT_STAGES.map(([stage, label]) => `<button type="button" data-action="client-filter" data-filter="${stage}" class="${ui.clientFilter === stage ? "is-active" : ""}">${h(label)} <span class="count">${counts[stage]}</span></button>`).join("")}
      </div>
      <div class="client-grid">
        ${filtered.length ? filtered.map(clientCard).join("") : emptyState(
          state.clients.length ? "Nenhum cliente encontrado" : "Seu primeiro cliente começa aqui",
          state.clients.length ? "Tente mudar o termo ou a etapa selecionada." : "Cadastre o contato, marque o próximo passo e acompanhe até a venda.",
          state.clients.length ? "" : "Cadastrar cliente",
          "new-client"
        )}
      </div>
    </section>`;
  }

  function clientCard(client) {
    const deals = state.deals.filter((item) => item.clientId === client.id);
    const value = deals.filter((item) => item.status !== "lost").reduce((sum, item) => sum + Number(item.amount || 0), 0) || Number(client.potential || 0);
    return `<article class="card client-card" data-action="open-client" data-id="${h(client.id)}">
      <div class="client-card-header">
        <div class="client-card-identity">
          <span class="client-avatar">${h(clientInitials(client))}</span>
          <div><h3>${h(client.business || client.name)}</h3><p>${h(client.business ? client.name : client.phone || "Sem telefone")}</p></div>
        </div>
        <span class="status-chip" data-tone="${stageTone(client.status)}">${h(stageLabel(client.status))}</span>
      </div>
      <div class="client-card-meta">
        <div class="meta-box"><span>Próxima ação</span><strong>${h(client.nextAction || "Não definida")}</strong></div>
        <div class="meta-box"><span>Valor em vista</span><strong>${money(value, true)}</strong></div>
      </div>
      <div class="client-card-footer"><span>${client.nextActionAt ? `${dueText(client.nextActionAt)} · ${dateLabel(client.nextActionAt)}` : "Sem retorno marcado"}</span>${icon("arrow")}</div>
    </article>`;
  }

  function renderDeals() {
    const filtered = state.deals.filter((deal) => ui.dealFilter === "all" || deal.status === ui.dealFilter);
    const openValue = state.deals.filter((item) => ["proposal", "demo", "sold", "delivery"].includes(item.status)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const recurring = state.deals.filter((item) => item.status !== "lost").reduce((sum, item) => sum + Number(item.monthlyFee || 0), 0);
    return `<section class="view">
      <div class="page-heading">
        <div><span class="eyebrow">Pipeline comercial</span><h1>Negócios</h1><p>Da proposta e experiência até a entrega do site.</p></div>
        <button class="btn btn-primary" type="button" data-action="new-sale">${icon("plus")} Novo negócio</button>
      </div>
      <div class="summary-row section" style="margin-top:0;margin-bottom:18px">
        <div class="summary-box"><span>Valor em andamento</span><strong>${money(openValue, true)}</strong></div>
        <div class="summary-box"><span>Receita mensal</span><strong>${money(recurring, true)}</strong></div>
        <div class="summary-box"><span>Experiências ativas</span><strong>${state.deals.filter((item) => item.status === "demo").length}</strong></div>
      </div>
      <div class="pipeline" aria-label="Filtrar negócios">
        <button type="button" data-action="deal-filter" data-filter="all" class="${ui.dealFilter === "all" ? "is-active" : ""}">Todos <span class="count">${state.deals.length}</span></button>
        ${DEAL_STAGES.map(([stage, label]) => `<button type="button" data-action="deal-filter" data-filter="${stage}" class="${ui.dealFilter === stage ? "is-active" : ""}">${h(label)} <span class="count">${state.deals.filter((item) => item.status === stage).length}</span></button>`).join("")}
      </div>
      <div class="deal-grid">
        ${filtered.length ? filtered.map(dealCard).join("") : emptyState(
          state.deals.length ? "Nenhum negócio nesta etapa" : "Transforme interesse em negócio",
          state.deals.length ? "Selecione outra etapa do pipeline." : "Registre uma proposta, demonstração ou venda de site.",
          state.deals.length ? "" : "Criar negócio",
          "new-sale"
        )}
      </div>
    </section>`;
  }

  function dealCard(deal) {
    const client = getClient(deal.clientId);
    const deadline = deal.status === "demo" ? deal.demoEndDate : deal.deliveryDate;
    const estimatedProfit = Number(deal.amount || 0) - Number(deal.estimatedCost || 0);
    return `<article class="card deal-card" data-action="open-deal" data-id="${h(deal.id)}">
      <div class="deal-card-header">
        <div><h3>${h(deal.name)}</h3><p>${h(client?.business || client?.name || "Cliente não informado")}</p></div>
        <span class="status-chip" data-tone="${stageTone(deal.status)}">${h(stageLabel(deal.status, "deal"))}</span>
      </div>
      <div class="client-card-meta">
        <div class="meta-box"><span>Valor</span><strong>${money(deal.amount, true)}</strong></div>
        <div class="meta-box"><span>Lucro previsto</span><strong>${money(estimatedProfit, true)}</strong></div>
      </div>
      <div class="deal-card-footer"><span>${deadline ? `${deal.status === "demo" ? "Experiência" : "Entrega"}: ${dateLabel(deadline)} · ${dueText(deadline)}` : "Sem prazo definido"}</span>${icon("arrow")}</div>
    </article>`;
  }

  function renderFinance() {
    const cash = cashMetrics();
    const currentMonth = periodMetrics("month");
    const filtered = state.transactions.filter((item) => {
      if (ui.financeFilter === "pending") return item.status === "pending";
      if (ui.financeFilter === "income") return item.type === "income";
      if (ui.financeFilter === "expense") return item.type === "expense";
      return true;
    });
    const sorted = sortedByDate(filtered, (item) => transactionDate(item), "desc");
    return `<section class="view">
      <div class="page-heading">
        <div><span class="eyebrow">Controle financeiro</span><h1>Caixa</h1><p>Entenda o que entrou, o que saiu e quanto ainda pode investir.</p></div>
        <button class="btn btn-primary" type="button" data-action="new-transaction">${icon("plus")} Lançamento</button>
      </div>
      <div class="finance-hero">
        <article class="balance-card">
          <span class="eyebrow">Saldo atual</span>
          <div class="balance-value">${money(cash.balance)}</div>
          <div class="balance-breakdown">
            <div><span>Livre para investir</span><strong>${money(cash.available)}</strong></div>
            <div><span>Reserva protegida</span><strong>${money(state.settings.reserve)}</strong></div>
          </div>
        </article>
        <div class="summary-row">
          <div class="summary-box"><span>Lucro no mês</span><strong class="${currentMonth.profit >= 0 ? "positive" : "negative"}">${money(currentMonth.profit, true)}</strong></div>
          <div class="summary-box"><span>A receber</span><strong class="pending">${money(cash.receivable, true)}</strong></div>
          <div class="summary-box"><span>Comprometido</span><strong class="negative">${money(cash.committed, true)}</strong></div>
        </div>
      </div>
      <div class="toolbar">
        <select id="financeFilter" aria-label="Filtrar lançamentos">
          <option value="all" ${ui.financeFilter === "all" ? "selected" : ""}>Todos os lançamentos</option>
          <option value="pending" ${ui.financeFilter === "pending" ? "selected" : ""}>Pendentes</option>
          <option value="income" ${ui.financeFilter === "income" ? "selected" : ""}>Somente entradas</option>
          <option value="expense" ${ui.financeFilter === "expense" ? "selected" : ""}>Somente gastos</option>
        </select>
      </div>
      <section class="section" style="margin-top:0">
        <div class="section-heading"><div><h2>Lançamentos</h2><p>${sorted.length} registro${sorted.length === 1 ? "" : "s"}</p></div></div>
        <div class="item-list">
          ${sorted.length ? sorted.map(transactionCard).join("") : emptyState("Nenhum lançamento", "Registre uma entrada, parcela, mensalidade ou gasto para acompanhar seu caixa.", "Novo lançamento", "new-transaction")}
        </div>
      </section>
    </section>`;
  }

  function transactionCard(item) {
    const client = getClient(item.clientId);
    const isExpense = item.type === "expense";
    return `<article class="list-card is-clickable" data-action="open-transaction" data-id="${h(item.id)}">
      <span class="type-icon ${isExpense ? "expense" : item.status === "pending" ? "pending" : ""}">${icon(isExpense ? "wallet" : "money")}</span>
      <div class="list-card-main">
        <div class="list-card-title"><h3>${h(item.notes || item.category)}</h3><strong class="amount ${isExpense ? "negative" : "positive"}">${isExpense ? "−" : "+"}${money(item.amount)}</strong></div>
        <p>${h(client?.business || client?.name || item.category || "Geral")} · ${item.status === "paid" ? `Pago em ${dateLabel(transactionDate(item))}` : `Vence ${dateLabel(item.dueDate)} · ${dueText(item.dueDate)}`}${item.recurring ? " · Mensal" : ""}</p>
      </div>
      <span class="status-chip" data-tone="${item.status === "paid" ? "green" : dueText(item.dueDate).includes("atrasado") ? "danger" : "warm"}">${item.status === "paid" ? "Pago" : "Pendente"}</span>
    </article>`;
  }

  function renderReview() {
    const period = ui.reviewPeriod;
    const metrics = periodMetrics(period);
    const goal = state.settings.goals[period];
    const profitProgress = goal.profit ? (metrics.profit / goal.profit) * 100 : 0;
    const salesProgress = goal.sales ? (metrics.sales / goal.sales) * 100 : 0;
    const clientProgress = goal.clients ? (metrics.clients / goal.clients) * 100 : 0;
    const cash = cashMetrics();
    const conversion = metrics.clients ? (metrics.sales / metrics.clients) * 100 : 0;
    const averageTicket = metrics.sales ? metrics.income / metrics.sales : 0;
    const noteKey = `${period}:${localDateKey(metrics.range.start)}`;
    return `<section class="view">
      <div class="page-heading">
        <div><span class="eyebrow">Resultados e decisões</span><h1>Revisão</h1><p>Veja o que valeu seu tempo e decida os próximos passos.</p></div>
        <button class="btn btn-ghost" type="button" data-action="edit-goals">${icon("edit")} Metas</button>
      </div>
      <div class="review-tabs">
        ${["day", "week", "month"].map((key) => `<button type="button" data-action="review-period" data-period="${key}" class="${period === key ? "is-active" : ""}">${PERIOD_LABELS[key]}</button>`).join("")}
      </div>
      <div class="goal-grid">
        ${goalCard("Lucro", metrics.profit, goal.profit, money)}
        ${goalCard("Vendas", metrics.sales, goal.sales, (value) => formatNumber(value))}
        ${goalCard("Clientes contatados", metrics.clients, goal.clients, (value) => formatNumber(value))}
      </div>
      <div class="section metric-grid">
        ${metricCard("clock", money(metrics.hourly, true), "Lucro por hora", durationLabel(metrics.minutes))}
        ${metricCard("trend", `${formatNumber(conversion, 1)}%`, "Conversão", `${metrics.sales} de ${metrics.clients}`)}
        ${metricCard("money", money(averageTicket, true), "Ticket médio", "Receita ÷ vendas")}
        ${metricCard("wallet", money(cash.available, true), "Livre para investir", "Depois da reserva")}
      </div>
      <section class="section panel">
        <div class="section-heading"><div><h2>Lucro nos últimos 7 dias</h2><p>Entradas recebidas menos gastos pagos.</p></div></div>
        ${profitChart()}
      </section>
      <section class="section insight-card">
        <h3>${icon("spark")} Leitura rápida</h3>
        <p>${reviewInsight(metrics, goal, { profitProgress, salesProgress, clientProgress })}</p>
      </section>
      <section class="section panel">
        <div class="section-heading"><div><h2>Minha revisão</h2><p>O que funcionou, o que evitar e qual é o próximo passo?</p></div></div>
        <textarea id="reviewNote" class="review-note" data-key="${h(noteKey)}" placeholder="Ex.: Visitas presenciais converteram melhor. Amanhã vou retornar as propostas e evitar deslocamentos sem agendamento.">${h(state.reviewNotes[noteKey] || "")}</textarea>
        <button class="btn btn-secondary btn-small" style="margin-top:10px" type="button" data-action="save-review">${icon("check")} Salvar revisão</button>
      </section>
    </section>`;
  }

  function goalCard(label, current, target, formatter) {
    const progress = target > 0 ? Math.max(0, Math.min(100, (current / target) * 100)) : 0;
    return `<article class="card goal-card">
      <div class="goal-card-top"><h3>${h(label)}</h3><strong>${formatter(current)} / ${formatter(target)}</strong></div>
      <div class="progress-track"><span style="width:${progress}%"></span></div>
      <small>${formatNumber(progress)}% da meta</small>
    </article>`;
  }

  function profitChart() {
    const days = Array.from({ length: 7 }, (_, index) => addDays(new Date(), index - 6));
    const values = days.map((day) => periodMetrics("day", day).profit);
    const max = Math.max(...values.map((value) => Math.abs(value)), 1);
    return `<div class="chart">${days.map((day, index) => {
      const value = values[index];
      const height = Math.max(3, Math.abs(value) / max * 100);
      return `<div class="chart-column ${localDateKey(day) === localDateKey() ? "is-today" : ""}" title="${money(value)}">
        <div class="chart-bar-wrap"><span class="chart-bar" style="height:${height}%;${value < 0 ? "background:var(--rust)" : ""}"></span></div>
        <small>${day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}</small>
      </div>`;
    }).join("")}</div>`;
  }

  function reviewInsight(metrics, goal, progress) {
    if (!state.transactions.length && !state.activities.length) return "Ainda não há dados suficientes. Registre contatos, horas, entradas e gastos; o RotaVini começará a mostrar onde seu esforço rende mais.";
    const parts = [];
    if (progress.profitProgress >= 100) parts.push(`Você alcançou a meta de lucro de ${PERIOD_LABELS[ui.reviewPeriod].toLowerCase()}.`);
    else parts.push(`Faltam ${money(Math.max(0, goal.profit - metrics.profit))} para a meta de lucro.`);
    if (metrics.minutes > 0) parts.push(`Cada hora trabalhada gerou ${money(metrics.hourly)} de lucro até aqui.`);
    if (metrics.clients > 0) parts.push(`A conversão está em ${formatNumber((metrics.sales / metrics.clients) * 100, 1)}%.`);
    else parts.push("Registre os clientes contatados para medir sua conversão.");
    return parts.join(" ");
  }
