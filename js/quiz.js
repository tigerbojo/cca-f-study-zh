document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  let current = 0;
  let score = 0;
  let answered = new Array(quizQuestions.length).fill(null);

  function render() {
    if (current >= quizQuestions.length) {
      renderResult();
      return;
    }
    const q = quizQuestions[current];
    const isAnswered = answered[current] !== null;

    app.innerHTML = `
      <div class="quiz-progress">
        <span>${current + 1} / ${quizQuestions.length}</span>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${((current + 1) / quizQuestions.length) * 100}%"></div>
        </div>
        <span>得分: ${score}</span>
      </div>
      <div class="quiz-question">
        <div class="quiz-scenario">${q.scenario} · ${q.domain}</div>
        <h3>${q.question}</h3>
        <div class="quiz-options">
          ${q.options.map((opt, i) => {
            let cls = 'quiz-option';
            if (isAnswered) {
              if (i === q.correct) cls += ' correct';
              else if (i === answered[current] && i !== q.correct) cls += ' incorrect';
            } else if (answered[current] === i) {
              cls += ' selected';
            }
            return `<button class="${cls}" data-idx="${i}" ${isAnswered ? 'disabled' : ''}>${opt}</button>`;
          }).join('')}
        </div>
        <div class="quiz-explanation ${isAnswered ? 'show' : ''}" id="explanation">
          <strong>解析：</strong>${q.explanation}
          ${isAnswered && q.concepts ? `
            <div class="quiz-concepts">
              <span class="concepts-label">相關概念：</span>
              ${q.concepts.map(c => `<span class="concept-tag">${c}</span>`).join('')}
            </div>
          ` : ''}
          ${isAnswered && answered[current] !== q.correct && q.resources ? `
            <div class="quiz-resources">
              <div class="resources-header">加強學習</div>
              ${q.resources.map(r => `
                <a href="${r.url}" class="quiz-resource-item" target="${r.type === 'page' ? '_self' : '_blank'}" rel="noopener">
                  <span class="resource-type-icon">${r.type === 'course' ? '🎓' : r.type === 'doc' ? '📖' : '📄'}</span>
                  <span class="resource-type-badge">${r.type === 'course' ? '課程' : r.type === 'doc' ? '文件' : '本站'}</span>
                  <div class="quiz-resource-text">
                    <strong>${r.title}</strong>
                    <span>${r.desc}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          ` : ''}
          ${isAnswered && answered[current] === q.correct && q.resources ? `
            <div class="quiz-resources correct-resources">
              <div class="resources-header">延伸閱讀</div>
              ${q.resources.slice(0, 2).map(r => `
                <a href="${r.url}" class="quiz-resource-item" target="${r.type === 'page' ? '_self' : '_blank'}" rel="noopener">
                  <span class="resource-type-icon">${r.type === 'course' ? '🎓' : r.type === 'doc' ? '📖' : '📄'}</span>
                  <span class="resource-type-badge">${r.type === 'course' ? '課程' : r.type === 'doc' ? '文件' : '本站'}</span>
                  <div class="quiz-resource-text">
                    <strong>${r.title}</strong>
                    <span>${r.desc}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      <div class="quiz-nav">
        <button class="btn btn-secondary" ${current === 0 ? 'disabled' : ''} id="prev-btn">← 上一題</button>
        ${isAnswered
          ? `<button class="btn btn-primary" id="next-btn">${current === quizQuestions.length - 1 ? '查看結果' : '下一題 →'}</button>`
          : '<span></span>'
        }
      </div>
    `;

    // Option click handlers
    if (!isAnswered) {
      app.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          answered[current] = idx;
          if (idx === q.correct) score++;
          render();
        });
      });
    }

    // Navigation
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      if (current > 0) { current--; render(); }
    });
    document.getElementById('next-btn')?.addEventListener('click', () => {
      current++;
      render();
    });
  }

  function renderResult() {
    const pct = Math.round((score / quizQuestions.length) * 100);
    const pass = pct >= 72;

    // Collect wrong answers by domain
    const wrongByDomain = {};
    const domainPages = { D1: 'domain1.html', D2: 'domain2.html', D3: 'domain3.html', D4: 'domain4.html', D5: 'domain5.html' };
    const domainNames = { D1: 'Agentic 架構', D2: '工具與 MCP', D3: 'Claude Code', D4: 'Prompt 工程', D5: 'Context 管理' };
    quizQuestions.forEach((q, i) => {
      if (answered[i] !== q.correct) {
        if (!wrongByDomain[q.domain]) wrongByDomain[q.domain] = [];
        wrongByDomain[q.domain].push(q.concepts || []);
      }
    });

    const wrongDomains = Object.keys(wrongByDomain);

    app.innerHTML = `
      <div class="quiz-result">
        <h2>測驗結果</h2>
        <div class="quiz-score">${score} / ${quizQuestions.length}</div>
        <p>正確率 ${pct}%</p>
        <p style="font-size: 1.2rem; color: ${pass ? '#10b981' : '#ef4444'}; font-weight: 700;">
          ${pass ? '通過！繼續保持' : '需要加強，建議複習各 Domain 內容'}
        </p>
        <p style="font-size: 0.85rem; color: var(--text-dim)">
          CCA-F 實際考試及格線為 720/1000（約 72%），本模擬測驗以此為參考
        </p>
        ${wrongDomains.length > 0 ? `
          <div class="result-review-section">
            <h3>建議複習領域</h3>
            ${wrongDomains.map(d => `
              <a href="${domainPages[d]}" class="result-domain-link">
                <span class="result-domain-badge">${d}</span>
                <span>${domainNames[d]}</span>
                <span class="result-domain-count">${wrongByDomain[d].length} 題答錯</span>
              </a>
            `).join('')}
          </div>
        ` : ''}
        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" id="retry-btn">重新測驗</button>
          <a href="index.html" class="btn btn-secondary">回到首頁</a>
        </div>
      </div>
    `;

    document.getElementById('retry-btn')?.addEventListener('click', () => {
      current = 0;
      score = 0;
      answered = new Array(quizQuestions.length).fill(null);
      render();
    });
  }

  render();
});
