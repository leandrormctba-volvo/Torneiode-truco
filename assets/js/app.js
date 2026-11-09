(() => {
  const ranking = window.TOURNAMENT_RANKING;
  const slides = Array.from(document.querySelectorAll(".slide"));
  const counter = document.getElementById("counter");
  let current = 0;

  const positionLabel = (position) => `${position}º`;

  function renderHighlights() {
    const podium = document.getElementById("podium");
    const medals = ["🥇", "🥈", "🥉"];

    ranking.slice(0, 3).forEach((entry, index) => {
      const card = document.createElement("article");
      card.className = `card${index === 0 ? " first" : ""}`;

      const medal = document.createElement("div");
      medal.className = "medal";
      medal.setAttribute("aria-hidden", "true");
      medal.textContent = medals[index];

      const rank = document.createElement("div");
      rank.className = "rank";
      rank.textContent = `${positionLabel(entry.position)} lugar`;

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = entry.name;

      const points = document.createElement("div");
      points.className = "points";
      points.textContent = `${entry.points} pontos`;

      card.append(medal, rank, name, points);
      podium.append(card);
    });

    const highlights = document.getElementById("highlights");
    ranking.slice(0, 6).forEach((entry) => {
      const card = document.createElement("article");
      card.className = "six-card";

      const position = document.createElement("div");
      position.className = "six-num";
      position.textContent = positionLabel(entry.position);

      const details = document.createElement("div");
      const name = document.createElement("div");
      name.className = "name";
      name.textContent = entry.name;
      const points = document.createElement("div");
      points.className = "points";
      points.textContent = `${entry.points} pontos`;
      details.append(name, points);
      card.append(position, details);
      highlights.append(card);
    });
  }

  function createRankingTable(entries, firstPosition, lastPosition) {
    const table = document.createElement("table");
    table.className = "rank-table";
    table.setAttribute("aria-label", `Posições ${firstPosition} a ${lastPosition}`);

    const thead = document.createElement("thead");
    const headingRow = document.createElement("tr");
    ["Pos.", "Nome", "Pts."].forEach((label) => {
      const heading = document.createElement("th");
      heading.scope = "col";
      heading.textContent = label;
      headingRow.append(heading);
    });
    thead.append(headingRow);

    const tbody = document.createElement("tbody");
    entries.forEach((entry) => {
      const row = document.createElement("tr");
      [positionLabel(entry.position), entry.name, String(entry.points)].forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.append(cell);
      });
      tbody.append(row);
    });

    table.append(thead, tbody);
    return table;
  }

  function renderRanking() {
    const columns = document.getElementById("columns");
    const groupSize = 17;

    for (let start = 0; start < ranking.length; start += groupSize) {
      const entries = ranking.slice(start, start + groupSize);
      const wrapper = document.createElement("div");
      wrapper.className = "ranking-column";
      wrapper.append(createRankingTable(
        entries,
        entries[0].position,
        entries[entries.length - 1].position
      ));

      if (start + groupSize >= ranking.length) {
        const extra = document.createElement("div");
        extra.className = "unranked";
        const heading = document.createElement("strong");
        heading.textContent = "Demais pontuações exibidas";
        extra.append(heading);

        window.TOURNAMENT_OTHER_SCORES.forEach((entry) => {
          const line = document.createElement("p");
          line.textContent = `${entry.name} — ${entry.points} pts.`;
          extra.append(line);
        });
        wrapper.append(extra);
      }
      columns.append(wrapper);
    }
  }

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === current;
      slide.hidden = !isActive;
      slide.classList.toggle("active", isActive);
    });
    counter.textContent = `${current + 1} / ${slides.length}`;
  }

  document.getElementById("previous").addEventListener("click", () => show(current - 1));
  document.getElementById("next").addEventListener("click", () => show(current + 1));

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      show(current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(current - 1);
    } else if (event.key.toLowerCase() === "f") {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  });

  renderHighlights();
  renderRanking();
  show(0);
})();
