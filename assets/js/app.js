/* 啟動流程與全域事件 */

document.getElementById('category-modal').addEventListener('click', function(event) {
  if (event.target === this) {
    closeCategoryManager();
  }
});

document.getElementById('date').value = getTodayDate();

applyLayoutSettings();
loadCategories();
loadTheme();
setType('expense');
initCompareControls();
loadRecords();
