
document.body.style.marginTop = `0vh`

if(localStorage.calendarXeventData) {
    var eventData = JSON.parse(localStorage.calendarXeventData);
} else {
    var eventData = evtDefault;
}

const sliderContainer = document.getElementById('sliderContainer');
const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
    if (sliderContainer.style.right === '0px') {
        sliderContainer.style.right = '-300px'; // Hide
    } else {
        sliderContainer.style.right = '60px'; // Show
    }
});

var inputIds = ['colorInput', 'titleInput', 'timeInputS', 'timeInputE'];

var isChecked = false;

let today = new Date();
let tdmonth = today.getMonth() + 1;
let tdyear = today.getFullYear();

var theStrategy = tdmonth + (tdyear * 12);

var checkToday = [today.getDate(), tdmonth, tdyear];
var selected = [];
var dayID;

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function $(id) {
    return document.querySelector(id)
}

function getDayOfWeek(month, year) {
    const date = new Date(year, month - 1, 1);
    const dayOfWeek = date.getDay();
    return dayOfWeek;
}

function formatMonthYear(year, month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] + ' ' + year;
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function createGrid() {
    $('#calendar-grid').innerHTML = ``

    let month = theStrategy % 12;
    month = month !== 0 ? month : 12
    let year = (theStrategy - month) / 12;

    let rows = 6
    let columns = 7

    let firstDay = getDayOfWeek(month, year);
    let monthLength = new Date(year, month, 0).getDate();

    for (let i = 1; i <= rows; i++) {
        if (i === 5) {
            if ($('#calendar-grid').lastChild.lastChild.innerHTML == monthLength) {
                $('#calendar-grid').style.height = `calc(50px * 4)`
                $('#calendar-grid').style.padding = `10px 25px 75px 25px`
                $(`#dayWeek`).style.paddingTop = `50px`
                break;
            }
        } else if (i === 6) {
            if ($('#calendar-grid').lastChild.lastChild.innerHTML == monthLength) {
                $('#calendar-grid').style.height = `calc(50px * 5)`
                $('#calendar-grid').style.padding = `10px 25px 50px 25px`
                $(`#dayWeek`).style.paddingTop = `25px`
                break;
            } else {
                $('#calendar-grid').style.height = `calc(50px * 6)`
                $('#calendar-grid').style.padding = `10px 25px 25px 25px`
                $(`#dayWeek`).style.paddingTop = `0px`
            }
        }

        for (let p = 1; p <= columns; p++) {
            const elem = document.createElement('div');


            let id = ((i - 1) * 7) + p
            let day = id - firstDay;

            elem.id = `calendar-box-${id}`
            elem.innerHTML = `<div class="circle">${day}</div>`

            elem.className = `cl-box`
            elem.style.gridRowStart = i
            elem.style.gridColumnStart = p
            elem.style.gridRowEnd = i + 1
            elem.style.gridColumnEnd = p + 1;

            const circle = elem.lastChild;
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            circle.onclick = () => {
                if (circle.className === `circle selected`) {
                    circle.className = 'circle'
                    $('#two').className = `hidden`
                    $('#monthSelect').style.borderRadius = `10px 10px 0 0`
                    $('.grid-parent').style.borderRadius = `0 0 10px 10px`
                } else {
                    if (document.getElementsByClassName('selected')[0]) {
                        document.getElementsByClassName('selected')[0].className = 'circle'
                    }
                    circle.className = 'circle selected'
                    selected = [day, month, year]
                    $('#dateP').innerHTML = months[month - 1] + ` ${day}` + getDaySuffix(day) + `, ${year}`
                    $('#two').className = `shown`
                    $('#monthSelect').style.borderRadius = `10px 0px 0 0`
                    $('.grid-parent').style.borderRadius = `0 0 0px 10px`
                    dayID = year + `m` + month + `d` + day;
                    loadEvents()
                }
            }

            var JCalID = year + `m` + month + `d` + day;
            let foundObject = eventData.find(obj => obj.id === JCalID);
            if(foundObject) {
                if(foundObject.contents[0]) {
                    circle.innerHTML += '<div></div>'
                }
            }

            var check = [day, month, year];

            if (JSON.stringify(selected) === '[]') {
                if (JSON.stringify(check) === JSON.stringify(checkToday)) {
                    circle.click();
                }
            }


            if (!(day < 1) && !(day > monthLength)) {
                $('#calendar-grid').appendChild(elem)
            }
        }
    }

    $("#monthSelect p").innerHTML = formatMonthYear(year, month)

}
function initDOW() {
    for (let i = 0; i < 7; i++) {
        var DOW = days[i];
        const box = document.createElement('div');

        box.innerHTML = `<div class="spedcircle">${DOW}</div>`;

        box.style.gridRowStart = 1
        box.style.gridColumnStart = i + 1
        box.style.gridRowEnd = 2
        box.style.gridColumnEnd = i + 2

        $('#dayWeek').appendChild(box);
    }
}

function removeEvent(index) {
    foundObject.contents.splice(index, 1);

    localStorage.calendarXeventData = JSON.stringify(eventData);

    loadEvents();
}


function editEvent(index) {
    moveMenu();

    $('#titleInput').value = foundObject.contents[index].title
    $('#colorInput').value = foundObject.contents[index].color
    $('#timeInputS').value = foundObject.contents[index].startTime
    $('#timeInputE').value = foundObject.contents[index].endTime

    foundObject.contents.splice(index, 1);

    localStorage.calendarXeventData = JSON.stringify(eventData);

    loadEvents();
}

var foundObject;

function loadEvents() {
    var idToFind = dayID;
    foundObject = eventData.find(obj => obj.id === idToFind);

    if (foundObject) {
        if (foundObject.contents[0]) {
            $('#eventsContainer').innerHTML = ''
            for (let i = 0; i < foundObject.contents.length; i++) {
                var time;
                if (foundObject.contents[i].allDay) {
                    time = `All Day`
                } else {
                    time = `${foundObject.contents[i].startTime} - ${foundObject.contents[i].endTime}`
                }
                const eventDiv = document.createElement('div');
                eventDiv.style.borderLeft = `5px solid ${foundObject.contents[i].color}`
                eventDiv.className = 'event'
                eventDiv.innerHTML = `${foundObject.contents[i].title}
                <div class="evtTime">${time}</div>
                <div class="eventActions">
                    <button id="deleteBtn" onclick="removeEvent('${i}');"><img src="assets/delete.svg"></button>
                    <button onclick="editEvent('${i}');"><img src="assets/edit.svg"></button>
                </div>`

                $('#eventsContainer').appendChild(eventDiv);
            }
        } else {
            $('#eventsContainer').innerHTML = `
                <p>No Events Here!</p>
            `
        }
    } else {
        $('#eventsContainer').innerHTML = `
            <p>No Events Here!</p>
        `
    }
}

function formatTime(timeInput) {
    var timeParts = timeInput.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = timeParts[1];
    var period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    formattedTime = hours + ":" + minutes + " " + period;

    return formattedTime
}

function addEvent() {
    if(aic()) {
        moveMenu();

        var event = {
            title: $('#titleInput').value,
            color: $('#colorInput').value,
            startTime: formatTime($('#timeInputS').value),
            endTime: formatTime($('#timeInputE').value),
            allDay: isChecked
        }
    
        $('#titleInput').value = ''
        $('#colorInput').value = ''
        $('#timeInputS').value = ''
        $('#timeInputE').value = ''
    
        var idToFind = dayID;
        var foundObject = eventData.find(obj => obj.id === idToFind);
    
        if (foundObject) {
            foundObject.contents.push(event)
        } else {
            var newDay = {
                id: dayID,
                contents: []
            }
    
            newDay.contents.push(event)
            eventData.push(newDay)
        }
    
        localStorage.calendarXeventData = JSON.stringify(eventData);
    
        loadEvents();
    }
    

}

function moveMenu() {
    
    if ($('#overlay').style.opacity === '0') {
        $('.popup').style.zIndex = '999999'
        $('#overlay').style.visibility = 'visible'
        $('#overlay').style.opacity = "0.5"
        $('.popup').style.opacity = '1'
    } else {
        $('.popup').style.zIndex = '-55'
        $('#overlay').style.opacity = '0'
        setTimeout(() => {
            $('#overlay').style.visibility = 'hidden'
        }, 500);
        $('.popup').style.opacity = '0'
    }
}


function check(checked) {
    isChecked = checked
    if (checked) {
        inputIds = ['colorInput', 'titleInput'];
        document.querySelector('.time').style.display = 'none';
    } else {
        inputIds = ['colorInput', 'titleInput', 'timeInputS', 'timeInputE'];
        document.querySelector('.time').style.display = 'flex';
    }
}

function aic() {
    // Loop through each input ID
    for (let id of inputIds) {
        // Get the input element by ID
        const inputElement = document.getElementById(id);
        
        // Check if the input element exists and is not empty
        if (!inputElement || inputElement.value.trim() === '') {
            return false; // Return false if any input is not completed
        }
    }
    return true; // Return true if all inputs are completed
  }

  function updateColorTheme(hue) {
    // Define the red scale colors
    const redScaleColors = {
        calendarBackground: 'rgb(47, 0, 0)',
        calendarGridSpace: 'rgb(77, 0, 0)',
        headerColor: 'rgb(96, 18, 18)',
        twoColor: 'rgb(71, 11, 11)',
        secEventColor: 'rgb(136, 7, 7)',
        selectedColor: 'rgb(200, 0, 0)'
    };

    // Convert the hue to a HSL color
    const hslColor = `hsl(${hue}, 100%, 20%)`;

    // Function to convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }

    // Function to convert HSL to RGB
    function hslToRgb(h, s, l) {
        let r, g, b;
        h /= 360;
        s /= 100;
        l /= 100;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function hueToRgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    // Set the new colors based on the specified hue
    for (const [key, value] of Object.entries(redScaleColors)) {
        const rgbValues = value.match(/\d+/g).map(Number);
        const hslValues = rgbToHsl(...rgbValues);
        hslValues[0] = hue; // Set the new hue
        const newRgb = hslToRgb(...hslValues);
        const newColor = `rgb(${newRgb.join(',')})`;
        document.documentElement.style.setProperty(`--${key}`, newColor);
    }
}

$('#overlay').style.opacity = '0'


/* 
    [
        {
        'id': 'dayID',
        'contents': [
            {
                'title': 'SigmaVent'
            }
        ]
        }
    ]
*/
createGrid();
initDOW();