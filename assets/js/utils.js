/* utils */

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }


function money(n) {
    return '$' + Number(n || 0).toLocaleString();
  }


function pad2(value) {
    return String(value).padStart(2, '0');
  }


function formatLocalDate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }


function getCurrentMonth() {
    const today = new Date();
    return `${today.getFullYear()}-${pad2(today.getMonth() + 1)}`;
  }


function getTodayDate() {
    return formatLocalDate(new Date());
  }


function addMonths(monthStr, diff) {
    const [year, month] = monthStr.split('-').map(Number);
    const date = new Date(year, month - 1 + diff, 1);
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  }


function isValidMonthString(value) {
    if (!/^\d{4}-\d{2}$/.test(value)) return false;

    const [, month] = value.split('-').map(Number);
    return month >= 1 && month <= 12;
  }


function isValidDateString(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return date.getFullYear() === year
      && date.getMonth() === month - 1
      && date.getDate() === day;
  }


function isValidYearString(value) {
    return /^\d{4}$/.test(value);
  }


function getPreviousMonth(monthStr) {
    return addMonths(monthStr, -1);
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
