import {menuArray} from './data.js'

const cardDetailsForm = document.getElementById('card-details-form')
const cvvInput = document.getElementById('cvv-input')
const completeButton = document.getElementById('complete-btn')
const modalCloseBtn = document.getElementById('modal-close-btn')

let orderArray = []
let itemTotals = {}
let totalPrice = 0

function handleClick(e){
    if(e.target.dataset.name && e.target.dataset.price){
        addItemToOrder(e.target.dataset.name, Number(e.target.dataset.price))
        displayOrderSummary(true)
    }
    if(e.target.dataset.item){
        const itemName = e.target.dataset.item
        remove(itemName)
    }
}

document.addEventListener('click', handleClick)

completeButton.addEventListener('click', function(){
    const cardsDetailsDiv = document.getElementById('card-details')
    cardsDetailsDiv.classList.add('show');
})

modalCloseBtn.addEventListener('click', () => {
    const cardsDetailsDiv = document.getElementById('card-details')
    cardsDetailsDiv.classList.remove('show');
})

cvvInput.addEventListener("input", function() {
    
    let userInput = cvvInput.value;
    
    if (userInput === "" || isNaN(userInput) || userInput.length !== 3 || userInput < 0 || userInput > 999) {
        cvvInput.setCustomValidity("Please enter exactly three numbers between 0 and 9.")
    } else {
        cvvInput.setCustomValidity("") // Clear any previous validation message
    }
  });

cardDetailsForm.addEventListener('submit', function(e){
    e.preventDefault();
    const cardDetails = new FormData(cardDetailsForm)
    const userName = cardDetails.get('cardName')
    document.getElementById('card-details').style.display = "none"
    const thankYou = `
        <div class="thank-you">
            <h2 class="thank-you-text">Thanks, ${userName}! Your order is on its way!</h2>
        </div>
    `
    document.getElementById("order-sum").innerHTML = thankYou
    
    document.removeEventListener('click', handleClick)

    document.querySelectorAll('.add').forEach(button => {
        button.style.display = "none"
})
})



function addItemToOrder(itemName, itemPrice){
    const newItem = {
        name : itemName,
        price : itemPrice        
    }
    orderArray.push(newItem)
}

function remove(itemName) {

    orderArray = orderArray.filter(item => item.name !== itemName)
    if(!orderArray.length){
        displayOrderSummary(false)
    }
    else{
        displayOrderSummary(true)
    }
}

function displayOrderSummary(param){
    if(param){
        itemTotals = []
        totalPrice = 0
        let itemMap = {};
        orderArray.forEach(item => {
            const { name, price } = item;
            if (itemMap[name]) {
                // Increment quantity and update total price
                itemMap[name].quantity++;
                itemMap[name].total += price;
                totalPrice += price
            } else {
                // Add new item to the map
                itemMap[name] = { name, price, quantity: 1, total: price };
                totalPrice += price
                
            }
        });
        for (const itemName in itemMap) {
            itemTotals.push(itemMap[itemName]);
        }

        let orderSummaryHtml = ""

        itemTotals.forEach(item => {
            orderSummaryHtml += `
                <li>
                    <div class="item-sum">
                        <div class="item-sum-no-total">
                            <h2>${item.name} x ${item.quantity}</h2>
                            <p class="remove" data-item="${item.name}">remove</p>
                        </div>
                        <p>$${item.total}</p>
                    </div>
                </li>
            `;
        });

        orderSummaryHtml += `
            <div class="total-price">
              <h2>Total price:</h2>
              <p>$${totalPrice}</p>
            </div>
        `
        

        document.getElementById("order-sum").style.display = "block"
        document.getElementById("order-sum-ul").innerHTML = orderSummaryHtml
    }
    else{
        document.getElementById("order-sum").style.display = "none"
    }
}


function render(){
    const menuHtml = menuArray.map(item => { 
    
        return `
            <li>
                <div class="item">
                    <div class="item-no-btn">
                        <div class="icon">${item.emoji}</div>
                            <div class="item-desc">
                                <h2>${item.name}</h2>
                                <p class="gray">${item.ingredients.join(", ")}</p>
                                <h3>$${item.price}</h3>
                            </div>
                        </div>
                    <div class="add-btn-div">
                        <button class="add" data-name="${item.name}" data-price="${item.price}">+</button>
                    </div>
                </div>
            </li>
        `
    }).join("")
    document.getElementById("items").innerHTML = menuHtml
}

render()

// Add event listener to all elements with class "add"
document.querySelectorAll('.add').forEach(button => {
    button.addEventListener('click', function() {
        // Find the parent <li> element
        const listItem = button.closest('li');
        
        // Add a CSS class to change background color temporarily
        listItem.classList.add('highlight');
        
        // Remove the class after 0.5 seconds
        setTimeout(() => {
            listItem.classList.remove('highlight');
        }, 300); // 500 milliseconds (0.5 seconds)
    })
})