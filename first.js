const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, executionTimeout: 10000 });

let data = nightmare
  .goto('https://google.com')
  .type('.gLFyf.gsfi', 'datatables')
  .click('.gNO89b')
  .click('a[href*="datatables.net"]')
  .evaluate(() => {
    let arr = []; // store scraped data
    let pageArr = []; // temporary data from scraping various selectors
    pageArr = Array.from(document.querySelectorAll('tr[role="row"] th')).map(object => object.innerHTML);
    arr = arr.concat(pageArr);
    pageArr = Array.from(document.querySelectorAll('tr.even td,tr.odd td')).map(row => row.innerHTML);
    arr = arr.concat(pageArr);

    while (document.querySelector('#example_next.paginate_button.next[tabindex="0"]')) {
      pageArr = Array.from(document.querySelectorAll('tr.even td,tr.odd td')).map(row => row.innerHTML);
      arr = arr.concat(pageArr);
      document.querySelector('#example_next.paginate_button.next').click();
    }

    return arr;
  })
  .end()
  .then(dataArray => {
    // Remove all of the existing commas in the data and add to new array
    let filtered = [];
    for (element in dataArray) {
      filtered.push(dataArray[element].replace(",", ""));
    }
    // Forming the csv file
    let csv = ""; // Replace with the headers separated by ,
    let row = [""]
    while (row.length != 0) {
      row = filtered.splice(0, 6);
      csv += row.join(',') + "\n";
    }
    //let csv = filtered.join(',');
    console.log(csv);
    return csv;
  })
  .catch(error => {
    console.error('Search failed:', error)
  });
