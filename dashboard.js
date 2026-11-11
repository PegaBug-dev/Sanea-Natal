let charts = { bairros: null, categorias: null, meses: null };

function dashboardRefresh() {
  const dados = JSON.parse(localStorage.getItem("relatos_saneamento_natal") || "[]");
  const agg = { total: dados.length, bairro: {}, categoria: {}, mes: {} };

  dados.forEach(r => {
    agg.bairro[r.bairro] = (agg.bairro[r.bairro] || 0) + 1;
    agg.categoria[r.categoria] = (agg.categoria[r.categoria] || 0) + 1;
    const mes = r.data.slice(0, 7);
    agg.mes[mes] = (agg.mes[mes] || 0) + 1;
  });

  const topBairro = Object.entries(agg.bairro).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const topCat = Object.entries(agg.categoria).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  document.getElementById("stats").innerHTML = `
    <div class="stat-box"><div class="num">${agg.total}</div><div class="lbl">Relatos registrados</div></div>
    <div class="stat-box"><div class="num">${Object.keys(agg.bairro).length}</div><div class="lbl">Bairros afetados</div></div>
    <div class="stat-box"><div class="num" style="font-size:1rem;">${topBairro}</div><div class="lbl">Mais afetado</div></div>
    <div class="stat-box"><div class="num" style="font-size:1rem;">${topCat}</div><div class="lbl">Problema comum</div></div>
  `;

  const ordBairros = Object.entries(agg.bairro).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const ordCats = Object.entries(agg.categoria).sort((a, b) => b[1] - a[1]);
  const ordMeses = Object.entries(agg.mes).sort((a, b) => a[0].localeCompare(b[0]));

  if (charts.bairros) charts.bairros.destroy();
  charts.bairros = new Chart("chart-bairros", {
    type: "bar",
    data: {
      labels: ordBairros.map(x => x[0]),
      datasets: [{ data: ordBairros.map(x => x[1]), backgroundColor: "#0b6bcb", borderRadius: 6 }]
    },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  if (charts.categorias) charts.categorias.destroy();
  charts.categorias = new Chart("chart-categorias", {
    type: "doughnut",
    data: {
      labels: ordCats.map(x => x[0]),
      datasets: [{ data: ordCats.map(x => x[1]), backgroundColor: ["#0b6bcb", "#1e9e6a", "#e8a33d", "#d9463e", "#7b5bd6", "#22a7c4", "#c4558b", "#8a9b3d"] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 10 } } } } }
  });

  if (charts.meses) charts.meses.destroy();
  charts.meses = new Chart("chart-meses", {
    type: "line",
    data: {
      labels: ordMeses.map(x => x[0]),
      datasets: [{ data: ordMeses.map(x => x[1]), borderColor: "#0b6bcb", backgroundColor: "rgba(11,107,203,0.15)", fill: true, tension: 0.3 }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

window.dashboardRefresh = dashboardRefresh;