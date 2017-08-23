function testGetMaxBuy() {
  var testItem = "Oberon Prime Systems";
  getMaxBuy(testItem);
}

function testGetMinSell() {
  var testItem = "Oberon Prime Systems";
  getMinSell(testItem);
}

/*  =========================================================================
 *  Items can be blueprints or sets. More often than not, they're blueprints.
 *  But if they are actually a set this will change the URI to be correct.
 *  =========================================================================
 */ 
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

function getMaxBuy(item) {
  var orders = figureItemType(item);
  var buyPrices = [];
  for (var i = 0; i < orders.buy.length; i++) {
    var buyOrder = orders.buy[i];
    if (buyOrder.online_ingame === true) {
      buyPrices.push(buyOrder.price);
    }
  }
  if (buyPrices.length == 0) return 0;
  return Math.max.apply(Math, buyPrices);
}

function getMinSell(item) {
  var orders = figureItemType(item);
  var sellPrices = [];
  for (var i = 0; i < orders.sell.length; i++) {
    var buyOrder = orders.sell[i];
    if (buyOrder.online_ingame === true) {
      sellPrices.push(buyOrder.price);
    }
  }
  if (sellPrices.length == 0) return 0;
  return Math.min.apply(Math, sellPrices);
}