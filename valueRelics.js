/*
 * Author: Brandon Presley
 * Description: A set of functions for the purpose of valuating relics in Warframe.
 * GitHub: https://github.com/brandonp2412/RelicValuation
 */

function test() {
  var minSell, maxBuy, date = valueItem("Tesla Link", "Mod");
  Logger.log(minSell);
  Logger.log(maxBuy);
  Logger.log(date);
}


function valueItem(item, category) {
  var orders = getOrders(item, category);
  var maxBuy = getMaxBuy(orders.buy);
  var minSell = getMinSell(orders.sell);
  var today = new Date();
  return [[minSell, maxBuy, getDate()]];
}

function findItem(items, key) {
  for (var i = 0; i < items.length; i++) {
    if (items[i].key === key) {
      return items[i].value;
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
      axi.devareRow(i+1);
    }
  }
}

function getOrders(item, category) {
  var url = encodeURI("https://warframe.market/api/get_orders/" + category + "/" + item);
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
