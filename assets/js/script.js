function initClient() {
    gapi.client.init({
        apiKey: 'AIzaSyBoz-9E3O9YsJVl8_gXkUTFR_5_FRYqY0g', // Replace with your API key
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    }).then(function () {
        return gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1Vqi85cRWNqcdp3sxAa1ew4TIqelYyzi7EM773bqjW-A', // Replace with your spreadsheet ID
            range: 'Lịch công tác!A1:D100', // Replace with your desired range
        });
    }).then(function (response) {
        const range = response.result;
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        const header = [];
        if (range.values.length > 0) {
            const data = range.values;
            
            // Get the swiper wrapper
            const swiperWrapper = document.getElementById('swiper-wrapper');

            // Split the data into chunks and create tables
            const header = data[0]; // Keep the header separate
            const rows = data.slice(1); // All rows except the header
            const chunkedRows = chunkArray(rows, 3);

            chunkedRows.forEach(chunk => {
                const tableData = [header, ...chunk]; // Add the header to each chunk
                const table = createTable(tableData);

                // Create a swiper slide for each table
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.appendChild(table);
                swiperWrapper.appendChild(slide);
            });


            // initSwiper();
        } else {
            console.log('Không có dữ liệu.');
        }
    }, function (response) {
        console.error('Error: ' + response.result.error.message);
    });
}

function initSwiper() {
    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
        },
        // pagination: {
        //     el: '.swiper-pagination',
        //     clickable: true,
        // },
        // navigation: {
        //     nextEl: '.swiper-button-next',
        //     prevEl: '.swiper-button-prev',
        // },
    });
}

// Function to split array into chunks
function chunkArray(array, chunkSize) {
    let results = [];
   
    for (let i = 0; i < array.length; i += chunkSize) {
        if (array[i].length > 1) {
            results.push(array.slice(i, i + chunkSize));
        }
    }
    return results;
}

// Function to create table
function createTable(data) {
    // Create table element
    const table = document.createElement('table');

    // Loop through array to create rows and cells
    data.forEach((rowData, rowIndex) => {
        const row = document.createElement('tr');
        if (rowData.length > 1) {
            rowData.forEach(cellData => {
                const cell = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
                cell.textContent = cellData;
                row.appendChild(cell);
            });
            table.appendChild(row);
        }
    });

    return table;
}

function getFormattedDate(selector) {
    // Define the day and month names in Vietnamese
    const days = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    
    // Create a new Date object
    const today = new Date();
    
    // Get the day of the week, date, month, and year
    const dayOfWeek = days[today.getDay()];
    const date = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based, so add 1
    const year = today.getFullYear();
    
    // Format the date
    const formattedDate = `${dayOfWeek}, ${date}/${month}/${year}`;
    
    // Update the HTML element with the formatted date
    document.getElementById(selector).innerHTML = formattedDate;
}

getFormattedDate('currentDateHeader');

gapi.load('client', initClient);