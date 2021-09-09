// Storage Controller
const StorageCtrl = (function () {
    // Public method
    return {
        storeItem: function (item) {
            let items;
            // check if any items in LS
            if (localStorage.getItem("items") === null) {
                items = [];
                // push the argument of the function (item)
                items.push(item);
                // set first brand item in LS
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                // display existing tasks from LS
                items = JSON.parse(localStorage.getItem("items"));
                // then push new item
                items.push(item);
                // set new item in LS
                localStorage.setItem("items", JSON.stringify(items));
            }
        },
        // take the items from LS to display in UI
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem("items") === null) {
                let items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },
    };
})();

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structure / State
    const data = {
        // items: [
        // {id: 0, name: 'Steak Dinner', calories: 1200},
        // {id: 1, name: 'Cookie', calories: 400},
        // {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0,
    };

    // Public methods
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            // Create ID
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            //loop through the array
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function (name, calories) {
            // calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function (id) {
            // get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });
            // get index
            const index = ids.indexOf(id);
            // remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            // Loop through items and add cals
            data.items.forEach(function (item) {
                total += item.calories;
            });

            // Set total cal in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
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
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        backBtn: ".back-btn",
        deleteBtn: ".delete-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
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

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            };
        },
        addListItem: function (item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = "block";
            // Create li element
            const li = document.createElement("li");
            // Add class
            li.className = "collection-item";
            // Add ID
            li.id = `item-${item.id}`;
            // Add HTML
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
          <i class="edit-item fas fa-edit"></i>
          </a>`;
            // Insert item
            document
                .querySelector(UISelectors.itemList)
                .insertAdjacentElement("beforeend", li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // loop through the list
            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute("id");
                if (itemID === `item-${item.id}`) {
                    document.querySelector(
                        `#${itemID}`
                    ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fas fa-edit"></i>
            </a>`;
                }
            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value =
                ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value =
                ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeAllItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn it node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function (item) {
                item.remove();
            });
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent =
                totalCalories;
        },
        //
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
        getSelectors: function () {
            return UISelectors;
        },
    };
})();

// App Controller
const App = (function (StorageCtrl, ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document
            .querySelector(UISelectors.addBtn)
            .addEventListener("click", itemAddSubmit);

        // Diable Enter key after submit
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // Edit icon click event
        document
            .querySelector(UISelectors.itemList)
            .addEventListener("click", itemUpdateClick);
        // Edit item submit event
        document
            .querySelector(UISelectors.updateBtn)
            .addEventListener("click", itemUpdateSubmit);
        // Delete item submit event
        document
            .querySelector(UISelectors.deleteBtn)
            .addEventListener("click", itemDeleteSubmit);
        // Back button event
        document
            .querySelector(UISelectors.backBtn)
            .addEventListener("click", UICtrl.clearEditState);

        // Clear all items submit event
        document
            .querySelector(UISelectors.clearBtn)
            .addEventListener("click", ClearAllItemsClick);
    };

    // Add item submit
    const itemAddSubmit = function (e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if (input.name !== "" && input.calories !== "") {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI list
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in localStorage
            StorageCtrl.storeItem(newItem);
            // Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    };
    // Update item click
    const itemUpdateClick = function (e) {
        if (e.target.classList.contains("edit-item")) {
            // get list item id
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split("-");
            // get the actual id
            const id = parseInt(listIdArr[1]);
            // get item
            const itemToEdit = ItemCtrl.getItemById(id);
            console.log(itemToEdit);
            // set to current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // add item to html form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    };
    const itemUpdateSubmit = function (e) {
        // get item input
        const input = UICtrl.getItemInput();
        // update item in data structure
        const updateItem = ItemCtrl.updateItem(input.name, input.calories);
        // update item in UI
        UICtrl.updateListItem(updateItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // clear input after editing item
        UICtrl.clearEditState();
        e.preventDefault();
    };

    // Delete button event
    const itemDeleteSubmit = function (e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete item from Data Structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete item from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // clear input after editing item
        UICtrl.clearEditState();

        e.preventDefault();
    };

    // clear items event
    const ClearAllItemsClick = function (e) {
        // clear all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // clear input after editing item
        UICtrl.clearEditState();
        // clear all items from UI
        UICtrl.removeAllItems();

        // hide UL style
        UICtrl.hideList();

        e.preventDefault();
    };

    // Public methods
    return {
        init: function () {
            // hide the edit state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        },
    };
})(StorageCtrl, ItemCtrl, UICtrl);

// Initialize App
App.init();