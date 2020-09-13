const PORT = process.env.PORT || 5000

const http = require("http");
const url = require("url");
const symbolsDatabase = require("./symbols_database");
const RequestProcessor = require("./request-processor").RequestProcessor;

var requestProcessor = new RequestProcessor(symbolsDatabase);

//	Usage:
//		/config
//		/symbols?symbol=A
//		/search?query=B&limit=10
//		/history?symbol=C&from=DATE&resolution=E

http.createServer(function(request, response) {
    var uri = url.parse(request.url, true);
    var action = uri.pathname;
    return requestProcessor.processRequest(action, uri.query, response);

}).listen(PORT);

console.log("Datafeed running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");
