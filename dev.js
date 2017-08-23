function getAxiNames() {
  var relics = SpreadsheetApp.getActive();
  var axi = relics.getSheets()[0];
  for (var i = 2; i <= 13; i++) {
    Logger.log(axi.getRange(i, 2).getValue());
  }
}

function getValueFor(item) {
  var argonScope = UrlFetchApp.fetch('https://warframe.market/api/get_orders/Mod/Argon%20Scope');
  var orders = JSON.parse(argonScope.getContentText());
  Logger.log(JSON.stringify(orders.response.sell));
}

function helloWorld() {
  return "Hello, world!";
}
