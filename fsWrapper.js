var fs = require("fs");

module.exports = {
    jsonToFileSync: function (fileName, json) {
        var strJson = JSON.stringify(json, null, 4);
        fs.writeFileSync(fileName, strJson);
    },
    fileToJsonSync: function (fileName) {
        try {
            return JSON.parse(fs.readFileSync(fileName));
        } catch (err) {
            console.error("error parsing JSON file: " + fileName, err);
            return {};
        }
    },
    jsonToFile: function (filename, json, callback) {
        try {
            if(json !== undefined) {
                var string = JSON.stringify(json, null, 4);
                fs.writeFile(filename, string, function(err, data) {
                    if (err){
                       callback({"error": err });
                    }
                    callback(null, {"data": json});
                });
            } else {
                throw new Error("File body is undefined");
            }
        } catch (err) {
            console.error("error writing to file: " + filename, err);
            callback({"error": err });
        }
    },
    fileToJson: function (filename, callback) {
        try {
            fs.readFile(filename, 'utf8', function(err, data){
                if(err){
                    callback({"error": err });
                    return;
                }
                try {
                    var parsed = JSON.parse(data);
                    callback(null, parsed);
                } catch(err2) {
                    console.log('in data', err2);
                }
            });
        } catch (err) {

            console.error("error converting from file: " + filename, err);
            callback({"error": err });
        }
    }
};
