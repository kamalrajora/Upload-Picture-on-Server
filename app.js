var path = require('path');
var Hapi = require('hapi');
var fs = require('fs')

var server = Hapi.createServer('localhost', Number(process.argv[2] || 8089));
server.views({
    engines: {
        html: require('handlebars')
    },
    path: 'public'
});

var routes=[
    {
        method:'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('home.html');
        }
    },
    {
        method: 'POST',
        path: '/upload',
        config: {
            handler: function (req, reply) {
                fs.readFile(req.payload.image_file, function (err, data) {
                    var now = new Date();
                    now = now.toJSON().toString();
                    var imageName = now + ".jpg"
                    base64_decode(req.payload.image_file, imageName);
                    function base64_decode(base64str, file) {
                        var bitmap = new Buffer(base64str, 'base64');
                        fs.writeFile(file, bitmap);
                        reply("Uploaded Successfully");
                    }
                });
            }
        }
    }
]
server.route(routes);
server.start(function(req, res){
    console.log("hello , server is available at ", server.info.uri);
});

