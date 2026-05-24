/* records */

function loadRecords() {
    const data = localStorage.getItem('healing_records');

    if (data) {
      try {
        records = JSON.parse(data);
      } catch (error) {
        records = [];
        localStorage.removeItem('healing_records');
      }
    }

    renderPage();
  }


function saveRecords() {
    localStorage.setItem('healing_records', JSON.stringify(records));
  }


function submitRecord() {
    const amtVal = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value.trim();
    const amount = Math.round(parseFloat(amtVal));

    if (!amtVal || isNaN(amount) || amount <= 0) {
      showToast('⚠️ 請輸入有效的金額');
      return;
    }

    if (!date) {
      showToast('⚠️ 請選擇日期');
      return;
    }

    if (!selectedCat) {
      showToast('⚠️ 請選擇分類');
      return;
    }

    const cat = categories.find(c => c.id === selectedCat);

    if (!cat) {
      showToast('⚠️ 分類不存在，請重新選擇');
      return;
    }

    records.push({
      id: uid(),
      catId: cat.id,
      type: currentType,
      amount,
      date,
      notes,
      icon: cat.icon,
      label: cat.label
    });

    saveRecords();

    document.getElementById('amount').value = '';
    document.getElementById('notes').value = '';

    currentMonth = date.slice(0, 7);
    selectedCat = null;

    renderCats();
    renderPage();

    showToast(`${cat.icon} ${cat.label} 已記錄！`);
  }


function delRecord(id) {
    records = records.filter(r => r.id !== id);
    saveRecords();
    renderPage();
    showToast('🗑️ 已刪除紀錄');
  }


function changeMonth(d) {
    const [y, m] = currentMonth.split('-').map(Number);
    currentMonth = new Date(y, m - 1 + d, 1).toISOString().slice(0, 7);

    document.getElementById('compare-current-month').value = currentMonth;
    document.getElementById('compare-previous-month').value = getPreviousMonth(currentMonth);

    renderPage();
  }


function getMonthRecords(month) {
    return records.filter(r => r.date && r.date.slice(0, 7) === month);
  }


function getYearRecords(year) {
    return records.filter(r => r.date && r.date.slice(0, 4) === String(year));
  }


function getPeriodRecords(periodValue, mode) {
    if (mode === 'year') {
      return getYearRecords(periodValue);
    }

    return getMonthRecords(periodValue);
  }


function getPeriodTotal(periodValue, mode, type) {
    return getPeriodRecords(periodValue, mode)
      .filter(r => r.type === type)
      .reduce((sum, r) => sum + Number(r.amount || 0), 0);
  }


function getPeriodCategoryTotals(periodValue, mode, type) {
    const map = {};

    getPeriodRecords(periodValue, mode)
      .filter(r => r.type === type)
      .forEach(r => {
        const id = r.catId || 'unknown';

        if (!map[id]) {
          map[id] = {
            id,
            label: r.label || '其他',
            icon: r.icon || '✨',
            amount: 0
          };
        }

        map[id].amount += Number(r.amount || 0);
      });

    return map;
  }

