/* categories */

function loadCategories() {
    const data = localStorage.getItem('healing_categories');

    if (data) {
      try {
        categories = JSON.parse(data);
      } catch (error) {
        categories = [...DEFAULT_CATS];
        localStorage.removeItem('healing_categories');
      }
    } else {
      categories = [...DEFAULT_CATS];
    }
  }


function saveCategories() {
    localStorage.setItem('healing_categories', JSON.stringify(categories));
  }


function setType(type) {
    currentType = type;
    selectedCat = null;

    document.querySelectorAll('.type-btn').forEach(btn => {
      if (btn.dataset.type === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    updateButtonStyle();
    renderCats();
  }


function renderCats() {
    const catGrid = document.getElementById('cat-grid');
    const filtered = categories.filter(c => c.type === currentType);

    if (filtered.length === 0) {
      catGrid.innerHTML = `
        <button class="cat-btn" onclick="openCategoryManager()">
          <div class="cat-circle">＋</div>
          <div class="cat-label">新增</div>
        </button>
      `;
      return;
    }

    catGrid.innerHTML = filtered.map(c => {
      const on = selectedCat === c.id;
      const cls = on ? (c.type === 'income' ? ' active-income' : ' active') : '';

      return `
        <button class="cat-btn${cls}" onclick="selectCategory('${c.id}')">
          <div class="cat-circle">${escapeHtml(c.icon)}</div>
          <div class="cat-label">${escapeHtml(c.label)}</div>
        </button>
      `;
    }).join('');
  }


function selectCategory(id) {
    selectedCat = id;
    renderCats();
  }


function openCategoryManager() {
    editingCategories = JSON.parse(JSON.stringify(categories));
    selectedNewIcon = '✨';
    renderManageList();
    renderIconPicker();
    document.getElementById('category-modal').classList.add('show');
  }


function closeCategoryManager() {
    document.getElementById('category-modal').classList.remove('show');
  }


function renderManageList() {
    const list = document.getElementById('manage-list');
    const filtered = editingCategories.filter(c => c.type === currentType);

    if (filtered.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; color:var(--text3); padding:14px;">
          目前沒有分類，請新增一個分類。
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(cat => {
      return `
        <div class="manage-row">
          <input
            class="manage-icon-input"
            value="${escapeHtml(cat.icon)}"
            maxlength="3"
            onchange="updateEditingCategory('${cat.id}', 'icon', this.value)"
          />

          <input
            value="${escapeHtml(cat.label)}"
            onchange="updateEditingCategory('${cat.id}', 'label', this.value)"
          />

          <button class="mini-btn" onclick="moveCategory('${cat.id}', -1)">↑</button>
          <button class="mini-btn" onclick="moveCategory('${cat.id}', 1)">↓</button>
          <button class="mini-btn danger" onclick="deleteCategory('${cat.id}')">×</button>
        </div>
      `;
    }).join('');
  }


function renderIconPicker() {
    const picker = document.getElementById('icon-picker');
    const preview = document.getElementById('selected-icon-preview');

    if (!picker || !preview) return;

    picker.innerHTML = ICON_OPTIONS.map(icon => {
      const activeClass = icon === selectedNewIcon ? ' active' : '';

      return `
        <button
          type="button"
          class="icon-option${activeClass}"
          onclick="selectNewIcon('${icon}')"
        >
          ${icon}
        </button>
      `;
    }).join('');

    preview.textContent = selectedNewIcon;
  }


function selectNewIcon(icon) {
    selectedNewIcon = icon;
    renderIconPicker();
  }


function updateEditingCategory(id, field, value) {
    const target = editingCategories.find(c => c.id === id);

    if (!target) return;

    const cleanValue = value.trim();

    if (field === 'label' && !cleanValue) {
      showToast('分類名稱不可空白');
      renderManageList();
      return;
    }

    if (field === 'icon' && !cleanValue) {
      showToast('分類圖案不可空白');
      renderManageList();
      return;
    }

    target[field] = cleanValue;
  }


function moveCategory(id, direction) {
    const sameType = editingCategories.filter(c => c.type === currentType);
    const currentInSameTypeIndex = sameType.findIndex(c => c.id === id);

    if (currentInSameTypeIndex < 0) return;

    const targetInSameTypeIndex = currentInSameTypeIndex + direction;

    if (targetInSameTypeIndex < 0 || targetInSameTypeIndex >= sameType.length) return;

    const currentCat = sameType[currentInSameTypeIndex];
    const targetCat = sameType[targetInSameTypeIndex];

    const currentGlobalIndex = editingCategories.findIndex(c => c.id === currentCat.id);
    const targetGlobalIndex = editingCategories.findIndex(c => c.id === targetCat.id);

    const temp = editingCategories[currentGlobalIndex];
    editingCategories[currentGlobalIndex] = editingCategories[targetGlobalIndex];
    editingCategories[targetGlobalIndex] = temp;

    renderManageList();
  }


function deleteCategory(id) {
    const used = records.some(r => r.catId === id);

    if (used) {
      const confirmDelete = confirm('這個分類已有記帳紀錄。刪除後，舊紀錄仍會保留原本名稱與圖案。確定刪除嗎？');
      if (!confirmDelete) return;
    }

    editingCategories = editingCategories.filter(c => c.id !== id);

    if (selectedCat === id) {
      selectedCat = null;
    }

    renderManageList();
  }


function addCategory() {
    const labelInput = document.getElementById('new-cat-label');

    const icon = selectedNewIcon || '✨';
    const label = labelInput.value.trim();

    if (!label) {
      showToast('請輸入分類名稱');
      return;
    }

    editingCategories.push({
      id: 'cat_' + uid(),
      label,
      icon,
      type: currentType
    });

    selectedNewIcon = '✨';
    labelInput.value = '';

    renderManageList();
    renderIconPicker();
  }


function saveCategoryManager() {
    const invalid = editingCategories.some(c => !c.label || !c.icon);

    if (invalid) {
      showToast('分類圖案與名稱不可空白');
      return;
    }

    categories = JSON.parse(JSON.stringify(editingCategories));
    saveCategories();

    if (selectedCat && !categories.some(c => c.id === selectedCat)) {
      selectedCat = null;
    }

    renderCats();
    renderComparePage();
    closeCategoryManager();
    showToast('分類設定已儲存');
  }

