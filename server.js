#!/usr/bin/env node

var appender = require('append-only');
var peeps = appender();
var argv = require('optimist').argv;

peeps.on('item', function (peep) {
    var s = peep.__id.split(':');
    var who = s[0], timestamp = s[1];
    
    var title = peep.name + '{' + who + '}';
    title += Array(Math.max(4, 50 - title.length)).join(' ');
    title += timestamp;
    
    console.log('# ' + title);
    console.log('  ' + slashify(peep.message));
});

var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');

var server = http.createServer(function (req, res) {
    if (req.url === '/replicate') {
        res.setHeader('content-type', 'application/json-lines');
        req.pipe(peeps.createStream()).pipe(res);
    }
    else if (req.method === 'POST') {
        var name = req.url.replace(/^\//, '');
        
        var data = '';
        req.on('data', function (buf) { data += buf });
        req.on('end', function () {
            peeps.push({
                name : name,
                message : data
            });
            res.end();
        });
    }
    else res.end('...\n');
});
server.listen(argv._[0]);

function slashify (s) {
    return s.replace(/[\r\n\t\f]/g, function (x) {
        return {
            '\r' : '\\r',
            '\n' : '\\n',
            '\t' : '\\t',
            '\f' : '\\f'
        }[x];
    });
}

var request = require('request');
argv._.slice(1).forEach(function (u) {
    var r = request.post(u);
    r.pipe(peeps.createStream()).pipe(r);
});
