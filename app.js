// Storage controller for local Storage

// Item controller
const ItemCtrl = (function() { // <--- this is calked in iffy
    // Item Contructror
    const Item = function(id, name, calories) {
        this.id = id;
        this.name - name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            {id: 0, name: "Steak Dinner", calories: 1200},
            {id: 1, name: "Cookie", calories: 400},
            {id: 2, name: "Eggs", calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        logData: function() {
            return data;
        }
    }
})();



// UI controller
const UICtrl = (function() { // <--- this is called in iffy

    // Public methods
    return {

    }
});



// App controller
const App = (function(ItemCtrl, UICtrl) {

    // Public methods
    return {
        init: function() {
            console.log("Initializing App...");
        }
    }

})(ItemCtrl, UICtrl);



// initialize App
App.init();