/* utils */

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }


function money(n) {
    return '$' + Number(n || 0).toLocaleString();
  }


function getPreviousMonth(monthStr) {
    const [y, m] = monthStr.split('-').map(Number);
    return new Date(y, m - 2, 1).toISOString().slice(0, 7);
  }


function getMonthText(monthStr) {
    return monthStr.replace('-', ' 年 ') + ' 月';
  }


function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');

    setTimeout(() => {
      el.classList.remove('show');
    }, 2200);
  }


function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

