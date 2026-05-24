/* 啟動流程與全域事件 */

document.getElementById('category-modal').addEventListener('click', function(event) {
  if (event.target === this) {
    closeCategoryManager();
  }
});

document.getElementById('date').value = new Date().toISOString().slice(0, 10);

applyLayoutSettings();
loadCategories();
loadTheme();
setType('expense');
initCompareControls();
loadRecords();
