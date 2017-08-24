/*
 * Author: Brandon Presley
 * Description: A set of functions for the purpose of valuating relics in Warframe.
 * GitHub: https://github.com/brandonp2412/RelicValuation
 */

function setupSpreadsheet() {
  buildAll();
  separate();
}

// Takes all the records from All and separates them by relic
function separate() {
  filter('All', 'Axi', 'Axi');
  filter('All', 'Neo', 'Neo');
  filter('All', 'Meso', 'Meso');
  filter('All', 'Lith', 'Lith');
}

function valueItem(item) {
  var orders = figureItemType(item);
  var maxBuy = getMaxBuy(orders.buy);
  var minSell = getMinSell(orders.sell);
  var today = new Date();
  return [[minSell, maxBuy, getDate()]];
}

// Option for building All sheet programmatically
function buildAll() {
  var itemNames = getItemNames('All');
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var all = ss.getSheetByName('All');
  var colCDE = all.getRange("C2:E");
  var items = [];
  for (var i = 1; i <= itemNames.length; i++) {
    var item = itemNames[i-1];
    var found = findItem(items, item);
    if (!found) {
      try {
        found = valueItem(item);
        items.push({key: item, value: found});
      }
      catch (e) {
        Logger.log(e);
      }
    }
    colCDE.getCell(i, 1).setValue(found[0][0]);
    colCDE.getCell(i, 2).setValue(found[0][1]);
    colCDE.getCell(i, 3).setValue(found[0][2]);
  }
}

function findItem(items, key) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].key === key) {
      return items[i].value;
    }
  }
}

/*
 * Description: Filters rows from input table to output table based on whether 
 *              or not they contain a pattern.
 * @param {String} input    Table name of source data.
 * @param {String} outut    Table name for output.
 * @param {String} pattern  String to evaluate against each record of input.
 */
function filter(input, output, pattern) {
  var inputTable = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(input);
  var inputData = inputTable.getRange("A2:E").getDisplayValues();
  var outputTable = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(output);
  outputTable = outputTable.getRange("A2:E");
  var offset = 0;
  for (var i = 0; i < inputData.length; i++) {
    if (!inputData[i][0].toString()) break;
    if (inputData[i][0].toString().indexOf(pattern) !== -1) {
      for (var j = 0; j < inputData[0].length; j++) {
        outputTable.getCell(i+1-offset, j+1).setValue(inputData[i][j]);
      }
    } else {
      offset++;
    }
  }
}

function getItemNames(sheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var testing = ss.getSheetByName(sheet);
  var colB = testing.getRange("B2:B").getDisplayValues();
  var itemNames = [];
  for (var i = 0; i < colB.length; i++) {
    if (colB[i][0]) {
      itemNames.push(colB[i]);
    }
  }
  return itemNames;
}

function getRelicNames(sheet) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var testing = ss.getSheetByName(sheet);
  var colB = testing.getRange("A2:A").getDisplayValues();
  var relicNames = [];
  for (var i = 0; i < colB.length; i++) {
    if (colB[i][0]) {
      relicNames.push(colB[i]);
    }
  }
  return relicNames;
}

function removeRows() {
  var relicNames = getRelicNames("Axi");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var axi = ss.getSheetByName("Axi");
  for (var i = 0; i < relicNames.length; i++) {
    if (relicNames[i].toString().indexOf("Neo") !== -1) {
      axi.deleteRow(i+1);
    }
  }
}

// Items can be blueprints or sets. More often than not, they're blueprints.
// But if they are actually a set this will change the URI to be correct.
function figureItemType(item) {
  var orders = getOrders(item, 'https://warframe.market/api/get_orders/Blueprint/');
  if (orders === "Wrong request") {
    orders = getOrders(item, 'https://warframe.market/api/get_orders/Set/');
  }
  return orders;
}

function getOrders(item, url) {
  var url = encodeURI(url + item);
  var get = UrlFetchApp.fetch(url).getContentText();
  return JSON.parse(get).response;
}



function getMaxBuy(orders) {
  var buyPrices = [];
  for (var i = 0; i < orders.length; i++) {
    var buyOrder = orders[i];
    if (buyOrder.online_ingame === true) {
      buyPrices.push(buyOrder.price);
    }
  }
  if (buyPrices.length == 0) return 0;
  return Math.max.apply(Math, buyPrices);
}

function getMinSell(orders) {
  var sellPrices = [];
  for (var i = 0; i < orders.length; i++) {
    var buyOrder = orders[i];
    if (buyOrder.online_ingame === true) {
      sellPrices.push(buyOrder.price);
    }
  }
  if (sellPrices.length == 0) return 0;
  return Math.min.apply(Math, sellPrices);
}

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
    dd = '0'+dd
  } 
  if(mm<10) {
    mm = '0'+mm
  } 
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}
