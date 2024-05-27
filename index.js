import {menuArray} from './data.js'

let orderArray = []
let itemTotals = {}
let totalPrice = 0
document.addEventListener('click', function(e){
    if(e.target.dataset.name && e.target.dataset.price){
        addItemToOrder(e.target.dataset.name, Number(e.target.dataset.price))
        displayOrderSummary(true)
    }
    if(e.target.dataset.item){
        const itemName = e.target.dataset.item
        remove(itemName)
    }
}

)


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
        itemTotals = {}
        totalPrice = 0
        orderArray.forEach(item => {
            if(!itemTotals[item.name]){
                itemTotals[item.name] = item.price
                totalPrice += item.price
            }
            else{
                itemTotals[item.name] += item.price
                totalPrice += item.price
            }
        })
        let orderSummaryHtml = ""

        for (const itemName in itemTotals){
            orderSummaryHtml += `
                <li>
                    <div class="item-sum">
                        <div class="item-sum-no-total">
                            <h2>${itemName}</h2>
                            <p class="remove" data-item="${itemName}">remove</p>
                        </div>
                        <p>$${itemTotals[itemName]}</p>
                    </div>
                </li>
            `
        }

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
                                <p>${item.ingredients.join(", ")}</p>
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