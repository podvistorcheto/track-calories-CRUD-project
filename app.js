"use strict";

// Storage Controller

// Item Controller
const ItemCtrl = (function () {
    // Item contsructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data structure / State
    const data = {
        items: [{
                id: 0,
                name: "Breakfast",
                calories: 1200
            },
            {
                id: 1,
                name: "Lunch",
                calories: 1200
            },
            {
                id: 2,
                name: "Dinner",
                calories: 1200
            },
        ],
        currentItem: null, // picked one for editing
        totalCalories: 0,
    };
    // public methoh shows data in the console with ItemCtrl.logData()
    return {
        getItems: function () {
            return data.items;
        },
        logData: function () {
            return data;
        },
    };
})();

// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: "#item-list",
    };
    // Public methods
    return {
        populateItemList: function (items) {
            let html = "";
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fas fa-edit"></i>
        </a>
      </li>`;
            });
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
    };
})();

// App Controller
const AppCtrl = (function (ItemCtrl, UICtrl) {
    return {
        init: function () {
            console.log("app init");
            // fetch items from data structure
            const items = ItemCtrl.getItems();
            // Populate list with Items
            UICtrl.populateItemList(items);
        },
    };
})(ItemCtrl, UICtrl);

// Start the app
AppCtrl.init();