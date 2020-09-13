"use strict";

var version = '2.0.4';

var https = require("https");
var http = require("http");
const fetch = require("node-fetch");

var quandlCache = {};

var quandlCacheCleanupTime = 3 * 60 * 60 * 1000; // 3 hours
var quandlKeysValidateTime = 15 * 60 * 1000; // 15 minutes
var quandlMinimumDate = '1970-01-01';

// this cache is intended to reduce number of requests to Quandl
setInterval(function () {
    quandlCache = {};
    console.warn(dateForLogs() + 'Quandl cache invalidated');
}, quandlCacheCleanupTime);

function dateForLogs() {
    return (new Date()).toISOString() + ': ';
}

var defaultResponseHeader = {
    "Content-Type": "text/plain",
    'Access-Control-Allow-Origin': '*'
};

function sendJsonResponse(response, jsonData) {
    response.writeHead(200, defaultResponseHeader);
    response.write(JSON.stringify(jsonData));
    response.end();
}

function dateToYMD(date) {
    var obj = new Date(date);
    var year = obj.getFullYear();
    var month = obj.getMonth() + 1;
    var day = obj.getDate();
    return year + "-" + month + "-" + day;
}

process.env["QUANDL_API_KEY"] = "6LvAYZLsJKu2rTRbmzmY"
var quandlKeys = process.env.QUANDL_API_KEY.split(','); // you should create a free account on quandl.com to get this key, you can set some keys concatenated with a comma
var invalidQuandlKeys = [];

function getValidQuandlKey() {
    for (var i = 0; i < quandlKeys.length; i++) {
        var key = quandlKeys[i];
        if (invalidQuandlKeys.indexOf(key) === -1) {
            return key;
        }
    }
    return null;
}

function markQuandlKeyAsInvalid(key) {
    if (invalidQuandlKeys.indexOf(key) !== -1) {
        return;
    }

    invalidQuandlKeys.push(key);

    console.warn(dateForLogs() + 'Quandl key invalidated ' + key);

    setTimeout(function () {
        console.log(dateForLogs() + "Quandl key restored: " + invalidQuandlKeys.shift());
    }, quandlKeysValidateTime);
}

function sendError(error, response) {
    response.writeHead(200, defaultResponseHeader);
    response.write("{\"s\":\"error\",\"errmsg\":\"" + error + "\"}");
    response.end();
}

function httpGet(datafeedHost, path, callback) {
    var options = {
        host: datafeedHost,
        path: path
    };

    function onDataCallback(response) {
        var result = '';

        response.on('data', function (chunk) {
            result += chunk;
        });

        response.on('end', function () {
            if (response.statusCode !== 200) {
                callback({status: 'ERR_STATUS_CODE', errmsg: response.statusMessage || ''});
                return;
            }

            callback({status: 'ok', data: result});
        });
    }

    var req = https.request(options, onDataCallback);

    req.on('socket', function (socket) {
        socket.setTimeout(5000);
        socket.on('timeout', function () {
            console.log(dateForLogs() + 'timeout');
            req.abort();
        });
    });

    req.on('error', function (e) {
        callback({status: 'ERR_SOCKET', errmsg: e.message || ''});
    });

    req.end();
}

function convertQuandlHistoryToUDFFormat(data) {
    function parseDate(input) {
        var parts = input.split('-');
        return Date.UTC(parts[0], parts[1] - 1, parts[2]);
    }

    function columnIndices(columns) {
        var indices = {};
        for (var i = 0; i < columns.length; i++) {
            indices[columns[i].name] = i;
        }

        return indices;
    }

    var result = {
        t: [],
        c: [],
        o: [],
        h: [],
        l: [],
        v: [],
        s: "ok"
    };

    try {
        var json = JSON.parse(data);
        var datatable = json.datatable;
        var idx = columnIndices(datatable.columns);

        datatable.data
            .sort(function (row1, row2) {
                return parseDate(row1[idx.date]) - parseDate(row2[idx.date]);
            })
            .forEach(function (row) {
                result.t.push(parseDate(row[idx.date]) / 1000);
                result.o.push(row[idx.open]);
                result.h.push(row[idx.high]);
                result.l.push(row[idx.low]);
                result.c.push(row[idx.close]);
                result.v.push(row[idx.volume]);
            });

    } catch (error) {
        return null;
    }

    return result;
}

function proxyRequest(controller, options, response) {
    controller.request(options, function (res) {
        var result = '';

        res.on('data', function (chunk) {
            result += chunk;
        });

        res.on('end', function () {
            if (res.statusCode !== 200) {
                response.writeHead(200, defaultResponseHeader);
                response.write(JSON.stringify({
                    s: 'error',
                    errmsg: 'Failed to get news'
                }));
                response.end();
                return;
            }
            response.writeHead(200, defaultResponseHeader);
            response.write(result);
            response.end();
        });
    }).end();
}

function RequestProcessor(symbolsDatabase) {
    this._symbolsDatabase = symbolsDatabase;
}

function filterDataPeriod(data, fromSeconds, toSeconds) {
    if (!data || !data.t) {
        return data;
    }

    if (data.t[data.t.length - 1] < fromSeconds) {
        return {
            s: 'no_data',
            nextTime: data.t[data.t.length - 1]
        };
    }

    var fromIndex = null;
    var toIndex = null;
    var times = data.t;
    for (var i = 0; i < times.length; i++) {
        var time = times[i];
        if (fromIndex === null && time >= fromSeconds) {
            fromIndex = i;
        }
        if (toIndex === null && time >= toSeconds) {
            toIndex = time > toSeconds ? i - 1 : i;
        }
        if (fromIndex !== null && toIndex !== null) {
            break;
        }
    }

    fromIndex = fromIndex || 0;
    toIndex = toIndex ? toIndex + 1 : times.length;

    var s = data.s;

    if (toSeconds < times[0]) {
        s = 'no_data';
    }

    toIndex = Math.min(fromIndex + 1000, toIndex); // do not send more than 1000 bars for server capacity reasons

    return {
        t: data.t.slice(fromIndex, toIndex),
        o: data.o.slice(fromIndex, toIndex),
        h: data.h.slice(fromIndex, toIndex),
        l: data.l.slice(fromIndex, toIndex),
        c: data.c.slice(fromIndex, toIndex),
        v: data.v.slice(fromIndex, toIndex),
        s: s
    };
}

RequestProcessor.prototype._sendConfig = function (response) {

    var config = {
        supports_search: true,
        supports_group_request: false,
        supports_marks: true,
        supports_timescale_marks: true,
        supports_time: true,
        exchanges: [
            {
                value: "OANDA",
                name: "OANDA",
                desc: "OANDA"
            },
        ],
        symbols_types: [
            {
                name: "All types",
                value: ""
            }
        ],
        supported_resolutions: ["1", "3", "5", "15", "30", "60", "120", "240", "D"]
    };

    response.writeHead(200, defaultResponseHeader);
    response.write(JSON.stringify(config));
    response.end();
};


RequestProcessor.prototype._sendMarks = function (response) {
    var lastMarkTimestamp = 1522108800;
    var day = 60 * 60 * 24;

    var marks = {
        id: [0, 1, 2, 3, 4, 5],
        time: [
            lastMarkTimestamp,
            lastMarkTimestamp - day * 4,
            lastMarkTimestamp - day * 7,
            lastMarkTimestamp - day * 7,
            lastMarkTimestamp - day * 15,
            lastMarkTimestamp - day * 30
        ],
        color: ["red", "blue", "green", "red", "blue", "green"],
        text: ["Red", "Blue", "Green + Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", "Red again", "Blue", "Green"],
        label: ["A", "B", "CORE", "D", "EURO", "F"],
        labelFontColor: ["white", "white", "red", "#FFFFFF", "white", "#000"],
        minSize: [14, 28, 7, 40, 7, 14]
    };

    response.writeHead(200, defaultResponseHeader);
    response.write(JSON.stringify(marks));
    response.end();
};

RequestProcessor.prototype._sendTime = function (response) {
    var now = new Date();
    response.writeHead(200, defaultResponseHeader);
    response.write(Math.floor(now / 1000) + '');
    response.end();
};

RequestProcessor.prototype._sendTimescaleMarks = function (response) {
    var lastMarkTimestamp = 1522108800;
    var day = 60 * 60 * 24;

    var marks = [
        {
            id: "tsm1",
            time: lastMarkTimestamp,
            color: "red",
            label: "A",
            tooltip: ""
        },
        {
            id: "tsm2",
            time: lastMarkTimestamp - day * 4,
            color: "blue",
            label: "D",
            tooltip: ["Dividends: $0.56", "Date: " + new Date((lastMarkTimestamp - day * 4) * 1000).toDateString()]
        },
        {
            id: "tsm3",
            time: lastMarkTimestamp - day * 7,
            color: "green",
            label: "D",
            tooltip: ["Dividends: $3.46", "Date: " + new Date((lastMarkTimestamp - day * 7) * 1000).toDateString()]
        },
        {
            id: "tsm4",
            time: lastMarkTimestamp - day * 15,
            color: "#999999",
            label: "E",
            tooltip: ["Earnings: $3.44", "Estimate: $3.60"]
        },
        {
            id: "tsm7",
            time: lastMarkTimestamp - day * 30,
            color: "red",
            label: "E",
            tooltip: ["Earnings: $5.40", "Estimate: $5.00"]
        },
    ];

    response.writeHead(200, defaultResponseHeader);
    response.write(JSON.stringify(marks));
    response.end();
};


RequestProcessor.prototype._sendSymbolSearchResults = function (query, type, exchange, maxRecords, response) {
    if (!maxRecords) {
        throw "wrong_query";
    }

    var result = this._symbolsDatabase.search(query, type, exchange, maxRecords);

    response.writeHead(200, defaultResponseHeader);
    response.write(JSON.stringify(result));
    response.end();
};

RequestProcessor.prototype._prepareSymbolInfo = function (symbolName) {
    var symbolInfo = this._symbolsDatabase.symbolInfo(symbolName);

    if (!symbolInfo) {
        throw "unknown_symbol " + symbolName;
    }

    return {
        "description": symbolInfo.description.length > 0 ? symbolInfo.description : symbolInfo.name,
        "data_status": "streaming",
        "exchange-traded": symbolInfo.exchange,
        "exchange-listed": symbolInfo.exchange,
        "exchange": symbolInfo.exchange,
        "full_name": "EUR/USD",
        "has_daily": true,
        "has_intraday": true,
        "has_weekly_and_monthly": true,
        "listed_exchange": symbolInfo.exchange,
        "minmov": 1,
        "minmov2": 0,
        "minmovement": 1,
        "minmovement2": 0,
        "name": symbolInfo.name,
        "pointvalue": 1,
        "pricescale": 100000,
        "session": "24x7",
        "supported_resolutions": [
            "1",
            "3",
            "5",
            "15",
            "30",
            "60",
            "120",
            "240",
            "360",
            "480",
            "720",
            "1D",
            "3D",
            "1W",
            "1M"
        ],
        "symbol": symbolInfo.name,
        "ticker": symbolInfo.name,
        "timezone": "UTC",
        "type": symbolInfo.type
    }

};

RequestProcessor.prototype._sendSymbolInfo = function (symbolName, response) {
    var info = this._prepareSymbolInfo(symbolName);

    response.writeHead(200, defaultResponseHeader);
    response.write(JSON.stringify(info));
    response.end();
};

RequestProcessor.prototype._sendSymbolHistory = function (symbol, startDateTimestamp, endDateTimestamp, resolution, response) {

    console.log(symbol, startDateTimestamp, endDateTimestamp, resolution)

    function sendResult(content) {
        var header = Object.assign({}, defaultResponseHeader);
        header["Content-Length"] = content.length;
        response.writeHead(200, header);
        response.write(content, null, function () {
            response.end();
        });
    }

    /**
     * { t: [], o: [], h: [], l: [], c: [], v: [], s: 'ok' }
     *
     * */
    fetch(`https://finnhub.io/api/v1/forex/candle?symbol=OANDA:${symbol.replace("/", "_")}&resolution=${resolution.toUpperCase()}&from=${startDateTimestamp}&to=${endDateTimestamp}&token=btcfrof48v6rudsh8hv0`, {
        "credentials": "include",
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7",
            "cache-control": "max-age=0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors"
    }).then(r => {
        return r.json()
    }).then(r => {
        // for(let i=0; i < r['t'].length; i++) {
        //      r['t'][i] = r['t'][i] * 1000
        // }
        sendResult(JSON.stringify(r));
    });
};

RequestProcessor.prototype._quotesQuandlWorkaround = function (tickersMap) {
    var from = quandlMinimumDate;
    var to = dateToYMD(Date.now());

    var result = {
        s: "ok",
        d: [],
        source: 'Quandl',
    };

    Object.keys(tickersMap).forEach(function (symbol) {
        var key = symbol + "|" + from + "|" + to;
        var ticker = tickersMap[symbol];

        var data = quandlCache[key];
        var length = data === undefined ? 0 : data.c.length;

        if (length > 0) {
            var lastBar = {
                o: data.o[length - 1],
                h: data.o[length - 1],
                l: data.o[length - 1],
                c: data.o[length - 1],
                v: data.o[length - 1],
            };

            result.d.push({
                s: "ok",
                n: ticker,
                v: {
                    ch: 0,
                    chp: 0,

                    short_name: symbol,
                    exchange: '',
                    original_name: ticker,
                    description: ticker,

                    lp: lastBar.c,
                    ask: lastBar.c,
                    bid: lastBar.c,

                    open_price: lastBar.o,
                    high_price: lastBar.h,
                    low_price: lastBar.l,
                    prev_close_price: length > 1 ? data.c[length - 2] : lastBar.o,
                    volume: lastBar.v,
                }
            });
        }
    });

    return result;
};

RequestProcessor.prototype._sendQuotes = function (tickersString, response) {
    var tickersMap = {}; // maps YQL symbol to ticker

    var tickers = tickersString.split(",");
    [].concat(tickers).forEach(function (ticker) {
        var yqlSymbol = ticker.replace(/.*:(.*)/, "$1");
        tickersMap[yqlSymbol] = ticker;
    });

    sendJsonResponse(response, this._quotesQuandlWorkaround(tickersMap));
    console.log("Quotes request : " + tickersString + ' processed from quandl cache');
};

RequestProcessor.prototype._sendNews = function (symbol, response) {
    var options = {
        host: "feeds.finance.yahoo.com",
        path: "/rss/2.0/headline?s=" + symbol + "&region=US&lang=en-US"
    };

    proxyRequest(https, options, response);
};

RequestProcessor.prototype._sendFuturesmag = function (response) {
    var options = {
        host: "www.oilprice.com",
        path: "/rss/main"
    };

    proxyRequest(http, options, response);
};

RequestProcessor.prototype.processRequest = function (action, query, response) {
    try {
        if (action === "/config") {
            this._sendConfig(response);
        } else if (action === "/symbols" && !!query["symbol"]) {
            this._sendSymbolInfo(query["symbol"], response);
        } else if (action === "/search") {
            this._sendSymbolSearchResults(query["query"], query["type"], query["exchange"], query["limit"], response);
        } else if (action === "/history") {
            this._sendSymbolHistory(query["symbol"], query["from"], query["to"], query["resolution"].toLowerCase(), response);
        } else if (action === "/quotes") {
            this._sendQuotes(query["symbols"], response);
        } else if (action === "/marks") {
            this._sendMarks(response);
        } else if (action === "/time") {
            this._sendTime(response);
        } else if (action === "/timescale_marks") {
            this._sendTimescaleMarks(response);
        } else if (action === "/news") {
            this._sendNews(query["symbol"], response);
        } else if (action === "/futuresmag") {
            this._sendFuturesmag(response);
        } else {
            response.writeHead(200, defaultResponseHeader);
            response.write('Datafeed version is ' + version +
                '\nValid keys count is ' + String(quandlKeys.length - invalidQuandlKeys.length) +
                '\nCurrent key is ' + (getValidQuandlKey() || '').slice(0, 3) +
                (invalidQuandlKeys.length !== 0 ? '\nInvalid keys are ' + invalidQuandlKeys.reduce(function (prev, cur) {
                    return prev + cur.slice(0, 3) + ',';
                }, '') : ''));
            response.end();
        }
    } catch (error) {
        sendError(error, response);
        console.error('Exception: ' + error);
    }
};

exports.RequestProcessor = RequestProcessor;
