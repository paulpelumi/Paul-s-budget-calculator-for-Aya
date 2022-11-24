// Add event listeners to all buttons

document.addEventListener('click', function () {

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener('click', function () {
            let att = this.getAttribute('id');
            switch (att) {
                case 'calc-btn':
                    validator();
                    break;
                case 'income':
                    addBox('income', 'not used');
                    break;
                case 'bills':
                    addBox('expenses', 'bills');
                    break;
                case 'savings':
                    addBox('expenses', 'keep');
                    break;
                case 'rentage':
                    addBox('expenses', 'rentage');
                    break;
                case 'insurance':
                    addBox('expenses', 'insurance');
                    break;
                case 'unexpected':
                    addBox('expenses', 'unexpected');
                    break;
                case 'transport':
                    addBox('expenses', 'transport');
                    break;
                case 'groceries':
                    addBox('expenses', 'groceries');
                    break;
                case 'hospital':
                    addBox('expenses', 'hospital');
                    break;
                case 'enjoyment':
                    addBox('expenses', 'enjoyment');
                    break;
                default:
                    window.location.reload();
            }
        });
    }
});


// call dropScroll function
dropScroll();

// Return page to top on reload
window.onbeforeunload = () => {
    window.scrollTo(0, 0);
};

// Redraw chart on window resize
window.onresize = drawChart;

// Add event listener and functionality for the currency select option.

let selectedCurrency = document.getElementById('currency');

selectedCurrency.addEventListener('change', function () {

    let currencyPlaceholders = document.getElementsByClassName('amount');
    for (let currencyPlaceholder of currencyPlaceholders) {
        currencyPlaceholder.placeholder = selectedCurrency.value;
    }
});


/**
 * Gets details elements and scrolls the element to top when element is open
 */
 function dropScroll() {

    let dropDown = document.getElementsByClassName('drop-down');

    for (let drop of dropDown) {
        drop.addEventListener('toggle', function () {

            if (drop.open) {
                drop.scrollIntoView({
                    block: 'start',
                    inline: 'nearest',
                    behavior: 'smooth'
                });
            }
        });
    }
}


function validator() {

    let userNums = document.getElementsByClassName('amount');
    let valid = 0;
    for (let userNum of userNums) {

        if (userNum.value >= 0 && (userNum.value == parseFloat(userNum.value).toFixed(2) || userNum.value == parseInt(userNum.value))) {
            userNum.style.backgroundColor = 'red';
            userNum.style.color = 'blue';
            valid++;
        } else if (userNum.value === '') {
            valid++;
            continue;
        } else {
            userNum.style.backgroundColor = 'black';
            userNum.style.color = 'brown';
            alert('Please enter a valid amount.\nValues must be greater than 0 and be no more than 2 decimal places.\nExample: 10.99');
        }
    }

    if (valid == userNums.length) {
        calculateResult();
        drawChart();
    }

}



/**
 * Calculates total monthly income
 */
 function calcIncome() {

    let userIncome = document.getElementsByClassName('income');
    let totalIncome = 0;

    for (let i of userIncome) {

        if (i.value) {
            totalIncome += parseFloat(i.value);
        } else {
            totalIncome += 0;
        }
    }
    return totalIncome;
}

console.log(calcIncome("1000"));


/**
 * Calculate total monthly expenses
 */
 function calcExpenses() {

    let userExpense = document.getElementsByClassName('expenses');
    let totalExpense = 0;

    for (let e of userExpense) {

        if (e.value) {
            totalExpense += parseFloat(e.value);
        } else {
            totalExpense += 0;
        }
    }
    return totalExpense;
}



/**
 * Calculates the result of total income minus total expenditure and outputs data to the DOM
 */
 function calculateResult() {

    
    let outcome = calcIncome() - calcExpenses();

    let resHtml =
        `
    <div id='incomeTotal'>
        <h3>Total Monthly Income</h3>
        <p>${selectedCurrency.value}${Math.round(calcIncome()* 100) / 100}</p>
    </div>
    <div id='expenseTotal'>
        <h3>Total Monthly Expenditure</h3>
        <p>${selectedCurrency.value}${Math.round(calcExpenses()* 100) / 100}</p>
    </div>
    <div id='outcome'>
        <h3>Total Remaining</h3>
        <p>${selectedCurrency.value}${Math.round(outcome* 100) / 100}</p>
    </div>
    `;

    document.getElementById('results').innerHTML = resHtml;

    let resDiv = document.getElementById('results')

    // Scroll results into view
    resDiv.scrollIntoView({
        block: 'start',
        inline: 'center',
        behavior: 'smooth'
    });

    // Style the outcomes using conditional statements
    if (calcIncome() > 0) {
        document.getElementById('incomeTotal').style.color = 'green';
    } else {
        document.getElementById('incomeTotal').style.color = 'blue';
    }

    if (outcome > 0) {
        document.getElementById('outcome').style.color = 'red';
    } else {tycgh
        document.getElementById('outcome').style.color = 'black';
    }

    // Call draw chart function
    drawChart();

    // Hide results and chart divs if not needed
    document.getElementById('results').style.display = 'block';

    if (calcExpenses() === 0) {
        document.getElementById('chart').style.display = 'none';
    } else {
        document.getElementById('chart').style.display = 'block';
        let chartDiv = document.getElementById('chart')
        // Scroll results into view       
        chartDiv.scrollIntoView({
            block: 'start',
            inline: 'center',
            behavior: 'smooth'
        });
    }

    // Reset drop down buttons back to Monthly after calculation
    let selectedPeriods = document.getElementsByClassName('period');
    for (let selected of selectedPeriods) {
        selected.selectedIndex = '2';
    }
}


// Load the Visualization API and the corechart package for the pie chart.
google.charts.load('current', {
    'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);


/**
 * Calculate user input sections and use data to create a pie chart
 */
function drawChart() {

    // Calculate sum of section data for pie chart
    let billsAndDebt = document.getElementsByClassName('bills');
    let billsAndDebtSum = 0;

    for (let bills of billsAndDebt) {

        if (bills.value) {
            billsAndDebtSum += parseFloat(bills.value);
        } else {
            billsAndDebtSum += 0;
        }
    }

    let savingsSection = document.getElementsByClassName('keep');
    let savingsSum = 0;

    for (let saving of savingsSection) {

        if (saving.value) {
            savingsSum += parseFloat(saving.value);
        } else {
            savingsSum += 0;
        }
    }


    let rentageSection = document.getElementsByClassName('rentage');
    let rentageSum = 0;

    for (let rentage of rentageSection) {

        if (rentage.value) {
            rentageSum += parseFloat(rentage.value);
        } else {
            rentageSum += 0;
        }
    }

    let insuranceSection = document.getElementsByClassName('insurance');
    let insuranceSum = 0;

    for (let insure of insuranceSection) {

        if (insure.value) {
            insuranceSum += parseFloat(insure.value);
        } else {
            insuranceSum += 0;
        }
    }

    let miscSection = document.getElementsByClassName('unexpected');
    let miscSum = 0;

    for (let misc of miscSection) {

        if (misc.value) {
            miscSum += parseFloat(misc.value);
        } else {
            miscSum += 0;
        }
    }

    let tranSection = document.getElementsByClassName('transport');
    let tranSum = 0;

    for (let tran of tranSection) {

        if (tran.value) {
            tranSum += parseFloat(tran.value);
        } else {
            tranSum += 0;
        }
    }

    let foodSection = document.getElementsByClassName('groceries');
    let foodSum = 0;

    for (let food of foodSection) {

        if (food.value) {
            foodSum += parseFloat(live.value);
        } else {
            foodSum += 0;
        }
    }

    let healthSection = document.getElementsByClassName('hospital');
    let healSum = 0;

    for (let heal of healthSection) {

        if (heal.value) {
            healSum += parseFloat(heal.value);
        } else {
            healSum += 0;
        }
    }

    let enjoymentSection = document.getElementsByClassName('enjoyment');
    let enjoySum = 0;

    for (let enjoy of enjoymentSection) {

        if (enjoy.value) {
            enjoySum += parseFloat(l.value);
        } else {
            enjoySum += 0;
        }
    }

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.    

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Expenses');
    data.addColumn('number', 'Total');
    data.addRows([
        ['Bills & Debt', billsAndDebtSum],
        ['Savings', savingsSum],
        ['Rentage', rentageSum],
        ['Insurance', insuranceSum],
        ['Miscelleanous', miscSum],
        ['Transport', tranSum],
        ['Food', foodSum],
        ['Healthcare', healSum],
        ['Enjoyment', enjoySum]
    ]);

    // Set chart options
    var options = {
        'title': 'Expenditure Overview',
        titleTextStyle: {
            color: '#008600',
            fontName: 'Roboto',
            fontSize: '18'
        },
        is3D: true,
        width: '100%',
        height: '400'
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById("chart"));
    chart.draw(data, options);
}

/**
 * Add and remove input fields as and when required
 */
 function addBox(incOrExp, btnAssign, secAssign) {

    // template literal for new input fields + remove button
    let newBoxHtml = `
    <div class='newBox'>
        <div class='rem-box'>
            <p>Remove box</p>
            <button class='rem-box-btn' type='button'>&#x2716;</button>
        </div class='user-input'>
        <div class='user-input'>
        <input type='text' class='new-box' name='new-box' placeholder='Name of item'>
        <input type='number' class='${incOrExp} ${btnAssign} ${secAssign} user-value' value='' placeholder='${selectedCurrency.value}' step='0.01' min='0'>
        <select class='period' name='period'>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly' selected>Monthly</option>
            <option value='yearly'>Yearly</option>
        </div>
    </div>
    `;

    // Add template literal to specific section with relevant class names
    let addBtnHtml = document.getElementById(btnAssign);
    addBtnHtml.insertAdjacentHTML('beforebegin', newBoxHtml);

    // Remove nearest new fields when remove button clicked
    let remButton = document.getElementsByClassName('rem-box-btn');

    for (let rem of remButton) {
        rem.addEventListener('click', function (r) {
            r.target.closest('.newBox').remove();
        });
    }
}