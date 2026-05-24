/* 啟動流程與全域事件 */

document.getElementById('category-modal').addEventListener('click', function(event) {
  if (event.target === this) {
    closeCategoryManager();
  }
});

function bindMonthButton(id, direction) {
  const button = document.getElementById(id);

  if (!button) return;

  button.addEventListener('click', function(event) {
    event.preventDefault();
    changeMonth(direction);
  });
}

bindMonthButton('month-prev-btn', -1);
bindMonthButton('month-next-btn', 1);

document.getElementById('date').value = getTodayDate();

applyLayoutSettings();
loadCategories();
loadTheme();
setType('expense');
initCompareControls();
loadRecords();
