"use strict";

/* global exports */

var symbols = [];
let OANDA_SYMBOLS = [{
    "description": "Gold/AUD",
    "displaySymbol": "XAU/AUD",
    "symbol": "OANDA:XAU_AUD"
}, {"description": "AUD/CHF", "displaySymbol": "AUD/CHF", "symbol": "OANDA:AUD_CHF"}, {
    "description": "USD/INR",
    "displaySymbol": "USD/INR",
    "symbol": "OANDA:USD_INR"
}, {"description": "UK 10Y Gilt", "displaySymbol": "UK10YB/GBP", "symbol": "OANDA:UK10YB_GBP"}, {
    "description": "Bund",
    "displaySymbol": "DE10YB/EUR",
    "symbol": "OANDA:DE10YB_EUR"
}, {"description": "USD/SEK", "displaySymbol": "USD/SEK", "symbol": "OANDA:USD_SEK"}, {
    "description": "GBP/SGD",
    "displaySymbol": "GBP/SGD",
    "symbol": "OANDA:GBP_SGD"
}, {
    "description": "US Wall St 30",
    "displaySymbol": "US30/USD",
    "symbol": "OANDA:US30_USD"
}, {"description": "Soybeans", "displaySymbol": "SOYBN/USD", "symbol": "OANDA:SOYBN_USD"}, {
    "description": "Silver/AUD",
    "displaySymbol": "XAG/AUD",
    "symbol": "OANDA:XAG_AUD"
}, {"description": "SGD/JPY", "displaySymbol": "SGD/JPY", "symbol": "OANDA:SGD_JPY"}, {
    "description": "SGD/HKD",
    "displaySymbol": "SGD/HKD",
    "symbol": "OANDA:SGD_HKD"
}, {"description": "EUR/CHF", "displaySymbol": "EUR/CHF", "symbol": "OANDA:EUR_CHF"}, {
    "description": "US T-Bond",
    "displaySymbol": "USB30Y/USD",
    "symbol": "OANDA:USB30Y_USD"
}, {"description": "Gold/NZD", "displaySymbol": "XAU/NZD", "symbol": "OANDA:XAU_NZD"}, {
    "description": "NZD/CAD",
    "displaySymbol": "NZD/CAD",
    "symbol": "OANDA:NZD_CAD"
}, {"description": "Gold/GBP", "displaySymbol": "XAU/GBP", "symbol": "OANDA:XAU_GBP"}, {
    "description": "Gold/JPY",
    "displaySymbol": "XAU/JPY",
    "symbol": "OANDA:XAU_JPY"
}, {"description": "EUR/NOK", "displaySymbol": "EUR/NOK", "symbol": "OANDA:EUR_NOK"}, {
    "description": "USD/JPY",
    "displaySymbol": "USD/JPY",
    "symbol": "OANDA:USD_JPY"
}, {"description": "EUR/TRY", "displaySymbol": "EUR/TRY", "symbol": "OANDA:EUR_TRY"}, {
    "description": "Singapore 30",
    "displaySymbol": "SG30/SGD",
    "symbol": "OANDA:SG30_SGD"
}, {"description": "AUD/HKD", "displaySymbol": "AUD/HKD", "symbol": "OANDA:AUD_HKD"}, {
    "description": "NZD/SGD",
    "displaySymbol": "NZD/SGD",
    "symbol": "OANDA:NZD_SGD"
}, {"description": "Silver/CHF", "displaySymbol": "XAG/CHF", "symbol": "OANDA:XAG_CHF"}, {
    "description": "EUR/NZD",
    "displaySymbol": "EUR/NZD",
    "symbol": "OANDA:EUR_NZD"
}, {"description": "Platinum", "displaySymbol": "XPT/USD", "symbol": "OANDA:XPT_USD"}, {
    "description": "Netherlands 25",
    "displaySymbol": "NL25/EUR",
    "symbol": "OANDA:NL25_EUR"
}, {"description": "Gold/EUR", "displaySymbol": "XAU/EUR", "symbol": "OANDA:XAU_EUR"}, {
    "description": "EUR/SGD",
    "displaySymbol": "EUR/SGD",
    "symbol": "OANDA:EUR_SGD"
}, {"description": "Gold/SGD", "displaySymbol": "XAU/SGD", "symbol": "OANDA:XAU_SGD"}, {
    "description": "TRY/JPY",
    "displaySymbol": "TRY/JPY",
    "symbol": "OANDA:TRY_JPY"
}, {"description": "USD/CHF", "displaySymbol": "USD/CHF", "symbol": "OANDA:USD_CHF"}, {
    "description": "AUD/SGD",
    "displaySymbol": "AUD/SGD",
    "symbol": "OANDA:AUD_SGD"
}, {"description": "EUR/CZK", "displaySymbol": "EUR/CZK", "symbol": "OANDA:EUR_CZK"}, {
    "description": "Taiwan Index",
    "displaySymbol": "TWIX/USD",
    "symbol": "OANDA:TWIX_USD"
}, {"description": "Corn", "displaySymbol": "CORN/USD", "symbol": "OANDA:CORN_USD"}, {
    "description": "West Texas Oil",
    "displaySymbol": "WTICO/USD",
    "symbol": "OANDA:WTICO_USD"
}, {"description": "Gold", "displaySymbol": "XAU/USD", "symbol": "OANDA:XAU_USD"}, {
    "description": "EUR/CAD",
    "displaySymbol": "EUR/CAD",
    "symbol": "OANDA:EUR_CAD"
}, {"description": "AUD/USD", "displaySymbol": "AUD/USD", "symbol": "OANDA:AUD_USD"}, {
    "description": "GBP/PLN",
    "displaySymbol": "GBP/PLN",
    "symbol": "OANDA:GBP_PLN"
}, {"description": "EUR/USD", "displaySymbol": "EUR/USD", "symbol": "OANDA:EUR_USD"}, {
    "description": "US Nas 100",
    "displaySymbol": "NAS100/USD",
    "symbol": "OANDA:NAS100_USD"
}, {"description": "Gold/HKD", "displaySymbol": "XAU/HKD", "symbol": "OANDA:XAU_HKD"}, {
    "description": "CAD/HKD",
    "displaySymbol": "CAD/HKD",
    "symbol": "OANDA:CAD_HKD"
}, {"description": "NZD/CHF", "displaySymbol": "NZD/CHF", "symbol": "OANDA:NZD_CHF"}, {
    "description": "CHF/HKD",
    "displaySymbol": "CHF/HKD",
    "symbol": "OANDA:CHF_HKD"
}, {"description": "USD/ZAR", "displaySymbol": "USD/ZAR", "symbol": "OANDA:USD_ZAR"}, {
    "description": "EUR/JPY",
    "displaySymbol": "EUR/JPY",
    "symbol": "OANDA:EUR_JPY"
}, {"description": "NZD/JPY", "displaySymbol": "NZD/JPY", "symbol": "OANDA:NZD_JPY"}, {
    "description": "Europe 50",
    "displaySymbol": "EU50/EUR",
    "symbol": "OANDA:EU50_EUR"
}, {
    "description": "Australia 200",
    "displaySymbol": "AU200/AUD",
    "symbol": "OANDA:AU200_AUD"
}, {"description": "USD/TRY", "displaySymbol": "USD/TRY", "symbol": "OANDA:USD_TRY"}, {
    "description": "GBP/JPY",
    "displaySymbol": "GBP/JPY",
    "symbol": "OANDA:GBP_JPY"
}, {"description": "EUR/DKK", "displaySymbol": "EUR/DKK", "symbol": "OANDA:EUR_DKK"}, {
    "description": "EUR/PLN",
    "displaySymbol": "EUR/PLN",
    "symbol": "OANDA:EUR_PLN"
}, {"description": "EUR/HKD", "displaySymbol": "EUR/HKD", "symbol": "OANDA:EUR_HKD"}, {
    "description": "France 40",
    "displaySymbol": "FR40/EUR",
    "symbol": "OANDA:FR40_EUR"
}, {"description": "GBP/CAD", "displaySymbol": "GBP/CAD", "symbol": "OANDA:GBP_CAD"}, {
    "description": "USD/SAR",
    "displaySymbol": "USD/SAR",
    "symbol": "OANDA:USD_SAR"
}, {"description": "Hong Kong 33", "displaySymbol": "HK33/HKD", "symbol": "OANDA:HK33_HKD"}, {
    "description": "Silver",
    "displaySymbol": "XAG/USD",
    "symbol": "OANDA:XAG_USD"
}, {
    "description": "US 5Y T-Note",
    "displaySymbol": "USB05Y/USD",
    "symbol": "OANDA:USB05Y_USD"
}, {"description": "USD/THB", "displaySymbol": "USD/THB", "symbol": "OANDA:USD_THB"}, {
    "description": "GBP/CHF",
    "displaySymbol": "GBP/CHF",
    "symbol": "OANDA:GBP_CHF"
}, {"description": "UK 100", "displaySymbol": "UK100/GBP", "symbol": "OANDA:UK100_GBP"}, {
    "description": "USD/CAD",
    "displaySymbol": "USD/CAD",
    "symbol": "OANDA:USD_CAD"
}, {"description": "SGD/CHF", "displaySymbol": "SGD/CHF", "symbol": "OANDA:SGD_CHF"}, {
    "description": "Gold/CHF",
    "displaySymbol": "XAU/CHF",
    "symbol": "OANDA:XAU_CHF"
}, {"description": "Silver/CAD", "displaySymbol": "XAG/CAD", "symbol": "OANDA:XAG_CAD"}, {
    "description": "Palladium",
    "displaySymbol": "XPD/USD",
    "symbol": "OANDA:XPD_USD"
}, {
    "description": "Brent Crude Oil",
    "displaySymbol": "BCO/USD",
    "symbol": "OANDA:BCO_USD"
}, {"description": "India 50", "displaySymbol": "IN50/USD", "symbol": "OANDA:IN50_USD"}, {
    "description": "Japan 225",
    "displaySymbol": "JP225/USD",
    "symbol": "OANDA:JP225_USD"
}, {"description": "China A50", "displaySymbol": "CN50/USD", "symbol": "OANDA:CN50_USD"}, {
    "description": "Natural Gas",
    "displaySymbol": "NATGAS/USD",
    "symbol": "OANDA:NATGAS_USD"
}, {"description": "Germany 30", "displaySymbol": "DE30/EUR", "symbol": "OANDA:DE30_EUR"}, {
    "description": "USD/PLN",
    "displaySymbol": "USD/PLN",
    "symbol": "OANDA:USD_PLN"
}, {"description": "GBP/AUD", "displaySymbol": "GBP/AUD", "symbol": "OANDA:GBP_AUD"}, {
    "description": "USD/MXN",
    "displaySymbol": "USD/MXN",
    "symbol": "OANDA:USD_MXN"
}, {"description": "GBP/USD", "displaySymbol": "GBP/USD", "symbol": "OANDA:GBP_USD"}, {
    "description": "CAD/CHF",
    "displaySymbol": "CAD/CHF",
    "symbol": "OANDA:CAD_CHF"
}, {"description": "Silver/HKD", "displaySymbol": "XAG/HKD", "symbol": "OANDA:XAG_HKD"}, {
    "description": "Wheat",
    "displaySymbol": "WHEAT/USD",
    "symbol": "OANDA:WHEAT_USD"
}, {"description": "EUR/GBP", "displaySymbol": "EUR/GBP", "symbol": "OANDA:EUR_GBP"}, {
    "description": "Silver/SGD",
    "displaySymbol": "XAG/SGD",
    "symbol": "OANDA:XAG_SGD"
}, {"description": "EUR/HUF", "displaySymbol": "EUR/HUF", "symbol": "OANDA:EUR_HUF"}, {
    "description": "Silver/EUR",
    "displaySymbol": "XAG/EUR",
    "symbol": "OANDA:XAG_EUR"
}, {"description": "NZD/USD", "displaySymbol": "NZD/USD", "symbol": "OANDA:NZD_USD"}, {
    "description": "CHF/ZAR",
    "displaySymbol": "CHF/ZAR",
    "symbol": "OANDA:CHF_ZAR"
}, {"description": "GBP/NZD", "displaySymbol": "GBP/NZD", "symbol": "OANDA:GBP_NZD"}, {
    "description": "USD/NOK",
    "displaySymbol": "USD/NOK",
    "symbol": "OANDA:USD_NOK"
}, {"description": "USD/CZK", "displaySymbol": "USD/CZK", "symbol": "OANDA:USD_CZK"}, {
    "description": "CAD/SGD",
    "displaySymbol": "CAD/SGD",
    "symbol": "OANDA:CAD_SGD"
}, {
    "description": "US Russ 2000",
    "displaySymbol": "US2000/USD",
    "symbol": "OANDA:US2000_USD"
}, {"description": "AUD/CAD", "displaySymbol": "AUD/CAD", "symbol": "OANDA:AUD_CAD"}, {
    "description": "ZAR/JPY",
    "displaySymbol": "ZAR/JPY",
    "symbol": "OANDA:ZAR_JPY"
}, {"description": "USD/DKK", "displaySymbol": "USD/DKK", "symbol": "OANDA:USD_DKK"}, {
    "description": "GBP/HKD",
    "displaySymbol": "GBP/HKD",
    "symbol": "OANDA:GBP_HKD"
}, {"description": "USD/HUF", "displaySymbol": "USD/HUF", "symbol": "OANDA:USD_HUF"}, {
    "description": "US 10Y T-Note",
    "displaySymbol": "USB10Y/USD",
    "symbol": "OANDA:USB10Y_USD"
}, {"description": "Silver/JPY", "displaySymbol": "XAG/JPY", "symbol": "OANDA:XAG_JPY"}, {
    "description": "Silver/GBP",
    "displaySymbol": "XAG/GBP",
    "symbol": "OANDA:XAG_GBP"
}, {"description": "CAD/JPY", "displaySymbol": "CAD/JPY", "symbol": "OANDA:CAD_JPY"}, {
    "description": "USD/SGD",
    "displaySymbol": "USD/SGD",
    "symbol": "OANDA:USD_SGD"
}, {"description": "EUR/SEK", "displaySymbol": "EUR/SEK", "symbol": "OANDA:EUR_SEK"}, {
    "description": "Sugar",
    "displaySymbol": "SUGAR/USD",
    "symbol": "OANDA:SUGAR_USD"
}, {
    "description": "US SPX 500",
    "displaySymbol": "SPX500/USD",
    "symbol": "OANDA:SPX500_USD"
}, {"description": "USD/HKD", "displaySymbol": "USD/HKD", "symbol": "OANDA:USD_HKD"}, {
    "description": "EUR/AUD",
    "displaySymbol": "EUR/AUD",
    "symbol": "OANDA:EUR_AUD"
}, {"description": "Gold/Silver", "displaySymbol": "XAU/XAG", "symbol": "OANDA:XAU_XAG"}, {
    "description": "AUD/NZD",
    "displaySymbol": "AUD/NZD",
    "symbol": "OANDA:AUD_NZD"
}, {"description": "EUR/ZAR", "displaySymbol": "EUR/ZAR", "symbol": "OANDA:EUR_ZAR"}, {
    "description": "HKD/JPY",
    "displaySymbol": "HKD/JPY",
    "symbol": "OANDA:HKD_JPY"
}, {"description": "CHF/JPY", "displaySymbol": "CHF/JPY", "symbol": "OANDA:CHF_JPY"}, {
    "description": "Copper",
    "displaySymbol": "XCU/USD",
    "symbol": "OANDA:XCU_USD"
}, {
    "description": "US 2Y T-Note",
    "displaySymbol": "USB02Y/USD",
    "symbol": "OANDA:USB02Y_USD"
}, {"description": "Silver/NZD", "displaySymbol": "XAG/NZD", "symbol": "OANDA:XAG_NZD"}, {
    "description": "Gold/CAD",
    "displaySymbol": "XAU/CAD",
    "symbol": "OANDA:XAU_CAD"
}, {"description": "NZD/HKD", "displaySymbol": "NZD/HKD", "symbol": "OANDA:NZD_HKD"}, {
    "description": "AUD/JPY",
    "displaySymbol": "AUD/JPY",
    "symbol": "OANDA:AUD_JPY"
}, {"description": "USD/CNH", "displaySymbol": "USD/CNH", "symbol": "OANDA:USD_CNH"}, {
    "description": "GBP/ZAR",
    "displaySymbol": "GBP/ZAR",
    "symbol": "OANDA:GBP_ZAR"
}]
OANDA_SYMBOLS.forEach(s => {
    symbols.push({
        "name": s['displaySymbol'], "description": s['description'], "exchange": "OANDA", "type": "forex"
    })
})

function searchResultFromDatabaseItem(item) {
    return {
        symbol: item.name,
        full_name: item.name,
        description: item.description,
        exchange: item.exchange,
        type: item.type
    };
}


exports.search = function (searchString, type, exchange, maxRecords) {
    var MAX_SEARCH_RESULTS = !!maxRecords ? maxRecords : 50;
    var results = []; // array of WeightedItem { item, weight }
    var queryIsEmpty = !searchString || searchString.length === 0;
    var searchStringUpperCase = searchString.toUpperCase();

    for (var i = 0; i < symbols.length; ++i) {
        var item = symbols[i];

        if (type && type.length > 0 && item.type != type) {
            continue;
        }
        if (exchange && exchange.length > 0 && item.exchange != exchange) {
            continue;
        }

        var positionInName = item.name.toUpperCase().indexOf(searchStringUpperCase);
        var positionInDescription = item.description.toUpperCase().indexOf(searchStringUpperCase);

        if (queryIsEmpty || positionInName >= 0 || positionInDescription >= 0) {
            var found = false;
            for (var resultIndex = 0; resultIndex < results.length; resultIndex++) {
                if (results[resultIndex].item == item) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                var weight = positionInName >= 0 ? positionInName : 8000 + positionInDescription;
                results.push({item: item, weight: weight});
            }
        }
    }

    results = results
        .sort(function (weightedItem1, weightedItem2) {
            return weightedItem1.weight - weightedItem2.weight;
        })
        .map(function (weightedItem) {
            return searchResultFromDatabaseItem(weightedItem.item);
        })
        .slice(0, Math.min(results.length, MAX_SEARCH_RESULTS));

    console.log("results: ", results);

    return results;
};


exports.addSymbols = function (newSymbols) {
    symbols = symbols.concat(newSymbols);
};

exports.symbolInfo = function (symbolName) {

    var data = symbolName.split(':');
    var exchange = (data.length > 1 ? data[0] : "").toUpperCase();
    var symbol = (data.length > 1 ? data[1] : symbolName).toUpperCase();

    for (var i = 0; i < symbols.length; ++i) {
        var item = symbols[i];

        if (item.name.toUpperCase() == symbol && (exchange.length === 0 || exchange == item.exchange.toUpperCase())) {
            return item;
        }
    }

    return null;
};
