function testValueItem() {
  valueItem("Nikana Prime Hilt");
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

function valueItem(item) {
  var orders = figureItemType(item);
  var maxBuy = getMaxBuy(orders.buy);
  var minSell = getMinSell(orders.sell);
  return [[minSell, maxBuy]];
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