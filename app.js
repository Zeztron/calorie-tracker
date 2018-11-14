// Storage controller for local Storage

// Item controller
const ItemCtrl = (function() { // <--- this is calked in iffy
    // Item Contructror
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: "Steak Dinner", calories: 1200},
            // {id: 1, name: "Cookie", calories: 400},
            // {id: 2, name: "Eggs", calories: 300}
        ],
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



// UI controller
const UICtrl = (function() { // <--- this is called in iffy
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
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
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        // Function that allows to use UISelectors publicly
        getSelectors: function() {
            return UISelectors;
        }
    }
})();



// App controller
const App = (function(ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function() {
        // get UI selectors from UICtrl
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
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
            // Clear input fields
            UICtrl.clearInput();

        }

        e.preventDefault();
    }

    // Public methods
    return {
        init: function() {
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

})(ItemCtrl, UICtrl);



// initialize App
App.init();