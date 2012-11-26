var appender = require('append-only');
var peeps = appender();

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
        req.pipe(emitter.createStream()).pipe(res);
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
server.listen(5000);

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
