// "use strict";
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
        addItem: function (name, calories) {
            // Create id for items
            let ID;
            if (data.items.length > 0) {
                // make the id with auto increment
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
                console.log(ID);
            }
            // calories to number
            calories = parseInt(calories);
            // create new item
            newItem = new Item(ID, name, calories);
            // add to items array
            data.items.push(newItem);
            console.log(newItem);
            return newItem;
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
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
    };
    // Public methods
    return {
        populateItemList: function (items) {
            let html = "";
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fas fa-edit"></i>
          </a>
        </li>`;
            });
            // insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            };
        },
        getSelectors: function () {
            return UISelectors;
        },
    };
})();

// App Controller
const AppCtrl = (function (ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // this method get the UI selectors
        const UISelectors = UICtrl.getSelectors();
        // event to add item
        document
            .querySelector(UISelectors.addBtn)
            .addEventListener("click", itemAddSubmit);
    };

    // Add item submit
    const itemAddSubmit = function (e) {
        // get form input from UI controller
        const input = UICtrl.getItemInput();
        //check for user input
        if (input.name !== "" && input.calories !== "") {
            // add item to the list
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            console.log(newItem);
        }
        e.preventDefault();
    };
    // Public methods
    return {
        init: function () {
            console.log("app init");
            // fetch items from data structure
            const items = ItemCtrl.getItems();
            // Populate list with Items
            UICtrl.populateItemList(items);

            // load event listerners
            loadEventListeners();
        },
    };
})(ItemCtrl, UICtrl);

// Start the app
AppCtrl.init();