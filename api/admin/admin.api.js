    exports.doAdminGet = function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


        res.format({
            html: function () {
                res.send('<p>hey admin, this is the page to do that</p>');
            },
            text: function () {
                res.send('<p>hey</p>');
            },

            csv: function () {
                res.send('<p>hey</p>');
            },

            json: function () {
                res.send('<p>hey</p>');
            },

            'default': function () {
                res.send('<p>hey</p>');
            }
        });
    }