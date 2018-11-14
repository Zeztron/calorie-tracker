/*
===============================================================================
                            S T O R A G E  C O N T R O L L E R
===============================================================================
*/

const StorageCtrl = (function() {
    // Public methods
    return {
        storeItem: function(item) {
            let items;
            // check if any items in local Storage
            if(localStorage.getItem("items") === null) {
                items = [];
                // Push the new item
                items.push(item);
                // set the local storage
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                // get what is already in local storage
                items = JSON.parse(localStorage.getItem("items"));
                // Push the new item
                items.push(item);
                // Reset local storage
                localStorage.setItem("items", JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem("items") === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem("items"));
            // loop through each item
            items.forEach(function(item, index) {
                // update item with new item
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
                // reset local storage
                localStorage.setItem("items", JSON.stringify(items));
            });
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem("items"));
            // loop through each item
            items.forEach(function(item, index) {
                // update item with new item
                if(id === item.id) {
                    items.splice(index, 1);
                }
                // reset local storage
                localStorage.setItem("items", JSON.stringify(items));
            });
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem("items");
        }
    }
})();

/*
===============================================================================
                            I T E M   C O N T R O L L E R
===============================================================================
*/

const ItemCtrl = (function() { // <--- this is calked in iffy
    // Item Contructror
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {

            let ID;
            // Create id
            if(data.items.length > 0 ) {
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
        getItemById: function(id) {
            let found = null;
            // loop through the items
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);
            let found = null;
            // loop through the items
            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;

        },
        deleteItem: function(id) {
            // Get the ids
            const ids = data.items.map(function(item) {
                return item.id
            });
            // Get the index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let calories = 0;
            // Loops trough all the calories and sums them
            data.items.forEach(function(item) {
                calories += item.calories;
            });
            // set total calories in data structure
            data.totalCalories = calories;

            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})();

/*
===============================================================================
                            U I   C O N T R O L L E R
===============================================================================
*/

const UICtrl = (function() { // <--- this is called in iffy
    const UISelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    }

    // Public methods
    return {
        populateItemList: function(items) {
            let html = "";
            items.forEach(function(item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>
                </li>`;
            });
            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show list
            document.querySelector(UISelectors.itemList).style.display = "block";
            // Create li element
            const li = document.createElement("li");
            // Add class
            li.className = "collection-item";
            // Add ID
            li.id = `item-${item.id}`;

            // Add html
            li.innerHTML =
            `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fas fa-pencil-alt"></i>
            </a>`;

            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn Node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute("id");
                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML =
                    `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            });
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        // Change the UI state
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
        // Function that allows to use UISelectors publicly
        getSelectors: function() {
            return UISelectors;
        }
    }
})();

/*
===============================================================================
                            A P P   C O N T R O L L E R
===============================================================================
*/

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // get UI selectors from UICtrl
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
        // disable submit on enter
        document.addEventListener("keypress", function(e) {
            // if enter was hit form is disabled
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);
        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);
        // clear all
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // get form input from UI controller
        const input = UICtrl.getItemInput();
        // Check for name and calorie input
        if(input.name !== "" && input.calories !== "") {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add item to the UI list
            UICtrl.addListItem(newItem);
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            // Strore in local storage
            StorageCtrl.storeItem(newItem);
            // Clear input fields
            UICtrl.clearInput();

        }
        e.preventDefault();
    }

    // click edit item
    const itemEditClick = function(e) {
        if(e.target.classList.contains("edit-item")) {
            // get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            // split the item id into ("item", 0)
            const listIdArr = listId.split("-");
            // get the actual id number
            const id = parseInt(listIdArr[1]);
            // get item
            const itemToEdit = ItemCtrl.getItemById(id);
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    // item update submit
    const itemUpdateSubmit = function(e) {
        // get item input
        const input = UICtrl.getItemInput();
        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // Update the UI
        UICtrl.updateListItem(updatedItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // item delete submit
    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete from the data structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete fromn the UI
        UICtrl.deleteListItem(currentItem.id);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    // clear all items
    const clearAllItemsClick = function() {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);
        // Remove from the UI
        UICtrl.removeItems();
        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();
        // Clear input fields
        UICtrl.clearInput();
        // Hide the list
        UICtrl.hideList();
    }

    // ======================== I N I T ======================== //
    return {
        init: function() {
            // Set inital state
            UICtrl.clearEditState();
            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            // load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// initialize App
App.init();