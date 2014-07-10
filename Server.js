/**
 * Created by physics1 on 08-07-2014.
 */
var http = require('http');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'security'
});

connection.connect(function(err){
    console.log(err);
});

var server = http.createServer (function(req,res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    var softwares = [];
    var userlist  = [];
    var data = {

    };
    var noOfUsers = [];
    var query = connection.query('select sname from softwarelist', function (err, rows, fields) {
        if(err) {
            console.log(err);
        } else {
            rows.forEach(function (row) {
                softwares.push(row.sname);
            });
            console.log(softwares);
        }
    });

    query.on('end', function () {
        var count = 0;
        softwares.forEach(function (soft) {
            var q = 'select user from ' + soft;
            var query2 = connection.query(q, function (err, rows, fields) {
                userlist.push(rows);
                noOfUsers.push(rows.length);
            });

            query2.on('end', function () {
                count++;
                if(count == softwares.length) {
                    var i = 0;
                    //console.log('Users' , userlist[0][0].user);
                    //console.log('Softwares' + softwares);
                    softwares.forEach(function (soft) {
                        data[soft] = userlist[i];
                        i++;
                    });
                    data.noUsers = noOfUsers;
                    console.log('Data ', data);
                    console.log('up');
                    res.writeHead(200,{'Content-Type':'text/plain'});
                    var d = JSON.stringify(data);
                    console.log('di id ' + d);
                    res.end(d);
                }
            });
        });

    });


});

server.listen(8000);