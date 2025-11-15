const tickers = [
  { name: "XAU-EUR", label: "Oro" },
  { name: "BTC-EUR", label: "Bitcoin" },
  { name: "AAPL", label: "Apple" },
  { name: "GOOGL", label: "Google" },
  { name: "AMZN", label: "Amazon" },
  { name: "NVDA", label: "Nvidia" },
  { name: "TSLA", label: "Tesla" },
  { name: "^GSPC", label: "S&P 500" }
];

const grid = document.getElementById("grid");
tickers.forEach(t => {
  const div = document.createElement("div");
  div.className = "card";
  div.id = t.name;
  div.innerHTML = `
    <div class="label">${t.label}</div>
    <div class="price">Cargando...</div>
    <canvas class="chart"></canvas>
  `;
  grid.appendChild(div);
});

async function fetchData(ticker) {
  const res = await fetch(`/api/quote?ticker=${ticker}&range=1d&interval=5m`);
  return await res.json();
}

function drawChart(canvas, points) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const w = canvas.width;
  const h = canvas.height;
  const max = Math.max(...points);
  const min = Math.min(...points);

  ctx.beginPath();
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / (max - min)) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "white";
  ctx.stroke();
}

async function updateTicker(t) {
  try {
    const card = document.getElementById(t.name);
    const priceEl = card.querySelector(".price");
    const canvas = card.querySelector("canvas");

    const data = await fetchData(t.name);

    const result = data.chart.result[0];
    const prices = result.indicators.quote[0].close;
    const last = prices[prices.length - 1];
    const first = prices[0];

    priceEl.innerHTML = last.toFixed(2);

    card.classList.remove("up", "down");
    card.classList.add(last >= first ? "up" : "down");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    drawChart(canvas, prices);
  } catch (err) {
    console.log("Error con", t.name, err);
  }
}

function updateAll() {
  tickers.forEach(updateTicker);
}

updateAll();
setInterval(updateAll, 60000);

