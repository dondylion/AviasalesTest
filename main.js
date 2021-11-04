const toggles = document.querySelector('.toggles'),
    cheap = document.querySelector('.cheap'),
    fast = document.querySelector('.fast'),
    moreTickets = document.querySelector('.more-tickets'),
    ticketContainer = document.querySelector('.ticket-container'),
    filters = document.querySelector('.filters'),
    allFilters = document.querySelector('#all'),
    noTransfer = document.querySelector('#no-transfer'),
    oneTransfer = document.querySelector('#one-transfer'),
    twoTransfer = document.querySelector('#two-transfer'),
    threeTransfer = document.querySelector('#three-transfer');
    
let searchID = 'https://front-test.beta.aviasales.ru/tickets?searchId=',
    ticketsList = {};

const togglesChange = () => {
    toggles.addEventListener('click', (event) => {
        if (!event.target.classList.contains('selected')) {
            event.target.classList.add('selected');
        }
        if (event.target.classList.contains('cheap')) {
            fast.classList.remove('selected');
        } else {
            cheap.classList.remove('selected');
        }
    });
};

const filtersChange = () => {
    filters.addEventListener('click', (event) => {
        if (event.target === allFilters) {
            if (!allFilters.checked) {
                allFilters.checked = false;
            } else {
                allFilters.checked = true;
                noTransfer.checked = true;
                oneTransfer.checked = true;
                twoTransfer.checked = true;
                threeTransfer.checked = true;
            }
        }
        if (event.target === noTransfer || event.target === oneTransfer || 
        event.target === twoTransfer || event.target === threeTransfer) {
            if (!event.target.checked) {
                allFilters.checked = false;
            }
        }
    });
};

const filtersToggles = () => {
    let newObj = ticketsList.tickets;
    toggles.addEventListener('click', () => { 
        if (cheap.classList.contains('selected')) {
            ticketContainer.innerHTML = '';
            newObj.sort((prev, next) => 
                prev.price - next.price);
            for (let i=0; i<5; i++) {
                sortTickets(newObj[i]);
            }
        };  
        if (fast.classList.contains('selected')) {
            ticketContainer.innerHTML = '';
            newObj.sort((prev, next) => 
                (prev.segments[0].duration+prev.segments[1].duration) - (next.segments[0].duration+next.segments[1].duration));
            for (let i=0; i<5; i++) {
                sortTickets(newObj[i]);
            }
        }
    });
    filters.addEventListener('change', ()=>{
        newObj = ticketsList.tickets;
        if (!noTransfer.checked) {
            newObj = newObj.filter((a) => {return (a.segments[0].stops.length != 0 && a.segments[1].stops.length != 0)});
        }
        if (!oneTransfer.checked) {
            newObj = newObj.filter((a) => {return (a.segments[0].stops.length != 1 && a.segments[1].stops.length != 1)});
        }
        if (!twoTransfer.checked) {
            newObj = newObj.filter((a) => {return (a.segments[0].stops.length != 2 && a.segments[1].stops.length != 2)});
        }
        if (!threeTransfer.checked) {
            newObj = newObj.filter((a) => {return (a.segments[0].stops.length != 3 && a.segments[1].stops.length != 3)});
        }
        
        ticketContainer.innerHTML = '';
        if (!noTransfer.checked && !oneTransfer.checked && !twoTransfer.checked && !threeTransfer.checked) {
            ticketContainer.innerHTML = '';
        } else {
            if (cheap.classList.contains('selected')) {
                ticketContainer.innerHTML = '';
                newObj.sort((prev, next) => 
                    prev.price - next.price);
                for (let i=0; i<5; i++) {
                    sortTickets(newObj[i]);
                }
            };  
            if (fast.classList.contains('selected')) {
                ticketContainer.innerHTML = '';
                newObj.sort((prev, next) => 
                    (prev.segments[0].duration+prev.segments[1].duration) - (next.segments[0].duration+next.segments[1].duration));
                for (let i=0; i<5; i++) {
                    sortTickets(newObj[i]);
                }
            }
        }
    });
};

const addZero = (num) => {
    if (num < 10) {
        num = '0' + num;
        return num;
    } else {
        return num;
    }
};

const departureArrival = (obj) => {
    let hours1 = '', 
        minutes1 = '', 
        hours2 = '', 
        minutes2 = '';

    hours1 = addZero(Number(obj.date.slice(11, 13))), 
    minutes1 = addZero(Number(obj.date.slice(14, 16))), 
    hours2 = addZero((hours1 + Math.floor(obj.duration / 60)) % 24), 
    minutes2 = addZero((minutes1 + obj.duration % 60) % 60);

    return hours1 + ':' + minutes1 + ' - ' + hours2 + ':' + minutes2;
};

const stopsNumber = (num) => {
    let stopsHeader = '';
    switch (num) {
        case 1:
            stopsHeader = '1 ПЕРЕСАДКА';
            break;
        case 2:
            stopsHeader = '2 ПЕРЕСАДКИ';
            break;
        case 3:
            stopsHeader = '3 ПЕРЕСАДКИ';
            break;
        default:
            stopsHeader = 'БЕЗ ПЕРЕСАДОК';
            break;
    }
    return stopsHeader;
};

const sortTickets = (obj) => {
    let times1 = '', 
    times2 = '', 
    price = 0, 
    airlineLogo = '', 
    destination1 = '', 
    destination2 = '', 
    departureTime1 = '', 
    departureTime2 = '', 
    stopsNumber1 = '', 
    stopsNumber2 = '', 
    stops1 = '', 
    stops2 = '';

    // Стоимость билетов
    price = obj.price;
    // Авиалинии
    airlineLogo = 'http://pics.avs.io/99/36/' + obj.carrier + '.png';
    // Время в пути туда
    times1 = Math.floor(obj.segments[0].duration / 60) + 'ч ' + obj.segments[0].duration % 60 + 'м';
    // Время в пути обратно
    times2 = Math.floor(obj.segments[1].duration / 60) + 'ч ' + obj.segments[1].duration % 60 + 'м';
    // Маршрут туда
    destination1 = obj.segments[0].origin + '-' + obj.segments[0].destination;
    // Время вылета туда
    departureTime1 = departureArrival(obj.segments[0]);
    // Маршрут обратно
    destination2 = obj.segments[1].origin + '-' + obj.segments[1].destination;
    // Время вылета обратно
    departureTime2 = departureArrival(obj.segments[1]);
    // Количество пересадок туда
    stopsNumber1 = stopsNumber(obj.segments[0].stops.length);
    // Пересадки туда
    if (obj.segments[0].stops.length !== 0) {
        stops1 = obj.segments[0].stops[0];
        for (let i = 1; i < obj.segments[0].stops.length; i++) {
            stops1 += ', ' + obj.segments[0].stops[i];
        }
    };
    // Количество пересадок обратно
    stopsNumber2 = stopsNumber(obj.segments[1].stops.length);
    // Пересадки обратно
    if (obj.segments[1].stops.length !== 0) {
        stops2 = obj.segments[1].stops[0];
        for (let i = 1; i < obj.segments[1].stops.length; i++) {
            stops2 += ', ' + obj.segments[1].stops[i];
        }
    };
    
    ticketContainer.innerHTML += `
        <div class="ticket">
            <div class="ticket-header">
                <div class="price">${price} р</div>
                <div class="airlines"><img src=${airlineLogo}></div>
            </div>
            <div class="segment-one segment">
                <div>
                    <p>${destination1}</p>
                    <p>${departureTime1}</p>
                </div>
                <div>
                    <p>В ПУТИ</p>
                    <p>${times1}</p>
                </div>
                <div>
                    <p>${stopsNumber1}</p>
                    <p>${stops1}</p>
                </div>
            </div>
            <div class="segment-two segment">
                <div>
                    <p>${destination2}</p>
                    <p>${departureTime2}</p>
                </div>
                <div>
                    <p>В ПУТИ</p>
                    <p>${times2}</p>
                </div>
                <div>
                    <p>${stopsNumber2}</p>
                    <p>${stops2}</p>
                </div>
            </div>
        </div>
    `;
};

const getRequest = () => {
    fetch('https://front-test.beta.aviasales.ru/search')
        .then((response) => {
            return response.text();
        })
        .then((data) => {
            searchID += JSON.parse(data).searchId;
            fetch(searchID)
                .then((response) => {
                    if (response.status === 200) {
                        return response.text();
                    } else {
                        alert('Ошибка сервера: ' + response.status + '. Пожалуйста обновите страницу.');
                    }   
                })
                .then((tickets) => {
                    ticketsList = JSON.parse(tickets);
                    ticketsList.tickets.sort((prev, next) => prev.price - next.price);
                    for (let i=0; i<5; i++) {
                        sortTickets(ticketsList.tickets[i]);
                    }
                    filtersToggles();
                });
        });
};

getRequest();
togglesChange();
filtersChange();