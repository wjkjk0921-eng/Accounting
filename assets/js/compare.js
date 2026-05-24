/* compare */

function initCompareControls() {
    const previousMonth = getPreviousMonth(currentMonth);
    const currentYear = new Date().getFullYear();

    document.getElementById('compare-current-month').value = currentMonth;
    document.getElementById('compare-previous-month').value = previousMonth;

    document.getElementById('compare-current-year').value = currentYear;
    document.getElementById('compare-previous-year').value = currentYear - 1;
  }


function switchPage(page) {
    currentPage = page;

    document.getElementById('page-record').classList.toggle('active', page === 'record');
    document.getElementById('page-compare').classList.toggle('active', page === 'compare');

    document.getElementById('tab-record').classList.toggle('active', page === 'record');
    document.getElementById('tab-compare').classList.toggle('active', page === 'compare');

    renderPage();
  }


function setCompareMode(mode) {
    compareMode = mode;

    document.getElementById('mode-month-btn').classList.toggle('active', mode === 'month');
    document.getElementById('mode-year-btn').classList.toggle('active', mode === 'year');

    document.getElementById('month-compare-controls').classList.toggle('hidden', mode !== 'month');
    document.getElementById('year-compare-controls').classList.toggle('hidden', mode !== 'year');

    renderComparePage();
  }


function setCompareType(type) {
    compareType = type;

    document.getElementById('compare-expense-btn').classList.toggle('active', type === 'expense');
    document.getElementById('compare-expense-btn').classList.toggle('expense', type === 'expense');

    document.getElementById('compare-income-btn').classList.toggle('active', type === 'income');
    document.getElementById('compare-income-btn').classList.toggle('income', type === 'income');

    renderComparePage();
  }


function getDeltaText(current, previous) {
    const diff = current - previous;

    if (diff === 0) {
      return { text: '持平', cls: 'neutral' };
    }

    const sign = diff > 0 ? '+' : '-';
    const abs = Math.abs(diff);

    if (previous === 0) {
      return {
        text: `${sign}${money(abs)}｜新增`,
        cls: diff > 0 ? 'up' : 'down'
      };
    }

    const percent = Math.round((abs / previous) * 100);

    return {
      text: `${sign}${money(abs)}｜${percent}%`,
      cls: diff > 0 ? 'up' : 'down'
    };
  }


function isValidComparePeriod(value) {
    return compareMode === 'year'
      ? isValidYearString(value)
      : isValidMonthString(value);
  }


function renderPage() {
    document.getElementById('month-label').textContent = getMonthText(currentMonth);

    renderRecordPage();
    renderComparePage();
  }


function renderRecordPage() {
    const monthRecords = getMonthRecords(currentMonth)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const inc = monthRecords
      .filter(r => r.type === 'income')
      .reduce((s, r) => s + r.amount, 0);

    const exp = monthRecords
      .filter(r => r.type === 'expense')
      .reduce((s, r) => s + r.amount, 0);

    document.getElementById('stat-income').textContent = money(inc);
    document.getElementById('stat-expense').textContent = money(exp);
    document.getElementById('stat-balance').textContent = money(inc - exp);

    const listEl = document.getElementById('rec-list');

    if (monthRecords.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding:20px; color:var(--text3);">
          這個月還沒有紀錄喔，快來記下第一筆吧！✨
        </div>
      `;
      return;
    }

    listEl.innerHTML = monthRecords.map(r => {
      const sign = r.type === 'income' ? '+' : '-';
      const amountClass = r.type === 'income' ? 'income' : 'expense';

      return `
        <div class="rec-row">
          <div class="rec-icon">${escapeHtml(r.icon || '✨')}</div>

          <div class="rec-info">
            <div class="rec-cat-name">${escapeHtml(r.label || '其他')}</div>
            <div class="rec-date-notes">
              ${escapeHtml(r.date)} ${r.notes ? '｜' + escapeHtml(r.notes) : ''}
            </div>
          </div>

          <div class="rec-amount ${amountClass}">
            ${sign}${money(r.amount)}
          </div>

          <button class="btn-del" onclick="delRecord('${r.id}')">✕</button>
        </div>
      `;
    }).join('');
  }


function renderComparePage() {
    const currentPeriod = compareMode === 'year'
      ? document.getElementById('compare-current-year').value
      : document.getElementById('compare-current-month').value;

    const previousPeriod = compareMode === 'year'
      ? document.getElementById('compare-previous-year').value
      : document.getElementById('compare-previous-month').value;

    if (!currentPeriod || !previousPeriod) return;

    if (!isValidComparePeriod(currentPeriod) || !isValidComparePeriod(previousPeriod)) {
      document.getElementById('compare-subtitle').textContent =
        compareMode === 'year'
          ? '請輸入正確年份，格式為 YYYY。'
          : '請輸入正確月份，格式為 YYYY-MM。';

      ['cmp-income', 'cmp-expense', 'cmp-balance'].forEach(id => {
        document.getElementById(id).textContent = money(0);
      });

      ['cmp-income-delta', 'cmp-expense-delta', 'cmp-balance-delta'].forEach(id => {
        const el = document.getElementById(id);
        el.textContent = '—';
        el.className = 'delta neutral';
      });

      document.getElementById('compare-list').innerHTML = `
        <div class="compare-empty">
          請確認期間格式後再比較。
        </div>
      `;
      return;
    }

    const currentText = compareMode === 'year'
      ? `${currentPeriod} 年`
      : getMonthText(currentPeriod);

    const previousText = compareMode === 'year'
      ? `${previousPeriod} 年`
      : getMonthText(previousPeriod);

    document.getElementById('compare-subtitle').textContent =
      `${currentText} 與 ${previousText} 的金額變化`;

    const currentIncome = getPeriodTotal(currentPeriod, compareMode, 'income');
    const previousIncome = getPeriodTotal(previousPeriod, compareMode, 'income');

    const currentExpense = getPeriodTotal(currentPeriod, compareMode, 'expense');
    const previousExpense = getPeriodTotal(previousPeriod, compareMode, 'expense');

    const currentBalance = currentIncome - currentExpense;
    const previousBalance = previousIncome - previousExpense;

    setCompareCard('cmp-income', 'cmp-income-delta', currentIncome, previousIncome);
    setCompareCard('cmp-expense', 'cmp-expense-delta', currentExpense, previousExpense);
    setCompareCard('cmp-balance', 'cmp-balance-delta', currentBalance, previousBalance);

    renderCompareList();
  }


function setCompareCard(amountId, deltaId, current, previous) {
    const delta = getDeltaText(current, previous);

    document.getElementById(amountId).textContent = money(current);

    const deltaEl = document.getElementById(deltaId);
    deltaEl.textContent = delta.text;
    deltaEl.className = `delta ${delta.cls}`;
  }


function renderCompareList() {
    const listEl = document.getElementById('compare-list');

    const currentPeriod = compareMode === 'year'
      ? document.getElementById('compare-current-year').value
      : document.getElementById('compare-current-month').value;

    const previousPeriod = compareMode === 'year'
      ? document.getElementById('compare-previous-year').value
      : document.getElementById('compare-previous-month').value;

    if (!currentPeriod || !previousPeriod) {
      listEl.innerHTML = `
        <div class="compare-empty">
          請先選擇要比較的期間。
        </div>
      `;
      return;
    }

    if (!isValidComparePeriod(currentPeriod) || !isValidComparePeriod(previousPeriod)) {
      listEl.innerHTML = `
        <div class="compare-empty">
          請確認期間格式後再比較。
        </div>
      `;
      return;
    }

    const currentMap = getPeriodCategoryTotals(currentPeriod, compareMode, compareType);
    const previousMap = getPeriodCategoryTotals(previousPeriod, compareMode, compareType);

    const allIds = Array.from(new Set([
      ...Object.keys(currentMap),
      ...Object.keys(previousMap)
    ]));

    if (allIds.length === 0) {
      listEl.innerHTML = `
        <div class="compare-empty">
          目前沒有可比較的${compareType === 'income' ? '收入' : '支出'}紀錄。<br>
          先建立兩個期間的資料，這裡就會顯示分類比較。
        </div>
      `;
      return;
    }

    const rows = allIds.map(id => {
      const cur = currentMap[id] || previousMap[id] || {
        id,
        label: '其他',
        icon: '✨',
        amount: 0
      };

      const currentAmount = currentMap[id]?.amount || 0;
      const previousAmount = previousMap[id]?.amount || 0;
      const delta = getDeltaText(currentAmount, previousAmount);
      const max = Math.max(currentAmount, previousAmount, 1);
      const width = Math.round((currentAmount / max) * 100);

      return {
        id,
        icon: cur.icon,
        label: cur.label,
        currentAmount,
        previousAmount,
        delta,
        width
      };
    }).sort((a, b) => {
      const aAbs = Math.abs(a.currentAmount - a.previousAmount);
      const bAbs = Math.abs(b.currentAmount - b.previousAmount);
      return bAbs - aAbs;
    });

    listEl.innerHTML = rows.map(row => {
      return `
        <div class="compare-row">
          <div class="compare-row-top">
            <div class="compare-cat">
              <div class="compare-cat-icon">${escapeHtml(row.icon)}</div>
              <div class="compare-cat-name">${escapeHtml(row.label)}</div>
            </div>
            <div class="compare-delta ${row.delta.cls}">${row.delta.text}</div>
          </div>

          <div class="compare-row-detail">
            <div class="compare-mini">
              期間 A
              <strong>${money(row.currentAmount)}</strong>
            </div>

            <div class="compare-mini">
              期間 B
              <strong>${money(row.previousAmount)}</strong>
            </div>
          </div>

          <div class="bar-wrap">
            <div class="bar-current ${compareType === 'income' ? 'income' : ''}" style="width:${row.width}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }


function getMockInsight() {
    const currentRecords = records.filter(r => {
      return r.date && r.date.slice(0, 7) === currentMonth;
    });

    const exp = currentRecords
      .filter(r => r.type === 'expense')
      .reduce((s, r) => s + r.amount, 0);

    const inc = currentRecords
      .filter(r => r.type === 'income')
      .reduce((s, r) => s + r.amount, 0);

    const balance = inc - exp;

    if (currentRecords.length === 0) {
      alert('AI 理財精靈：這個月還沒有紀錄喔，先記下一筆，讓我幫你觀察金錢流向吧 ✨');
    } else if (exp === 0) {
      alert('AI 理財精靈：你這個月還沒有支出紀錄，是個超棒的開始喔 ✨');
    } else if (balance > 0 && exp < 5000) {
      alert('AI 理財精靈：你目前支出控制得很好，而且還有結餘，是非常穩定的理財節奏 💖');
    } else if (balance > 0) {
      alert('AI 理財精靈：這個月仍有結餘，建議可以檢查主要支出分類，找出最值得保留與可以調整的花費 💡');
    } else {
      alert('AI 理財精靈：這個月支出已超過收入，可以先檢查主要支出分類，找出下個月最容易改善的地方 💪');
    }
  }
