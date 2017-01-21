var net = require('net');

//configure i_log with module name 
var i_log = require('i-log')('Index');
//get configuration data
var myAppConfig = require('./I_Jmonitor.json');
//start output
i_log.info('booting ', myAppConfig.name);

/* Or use this example tcp client written in node.js.  (Originated with 
example code from 
http://www.hacksparrow.com/tcp-socket-programming-in-node-js.html.) */

var net = require('net');

interface Message {
    src:string;
    action:string;
    message:any;
}

var client = new net.Socket();
client.connect(myAppConfig.socket.port, myAppConfig.socket.host, function() {
	i_log.info('Connected to JMonitor');
	client.write('Hello, jmonitor! Love, ' + myAppConfig.name);
});

client.on('data', function(data) {
	console.log('Received:\n' + data);
});

client.on('close', function() {
	i_log.info('Connection closed');
});
var writeHello = () =>{
    var message:Message = {
        src: myAppConfig.name,
        action:'say',
        message:'Hello Jmonitor'
    }
    client.write(JSON.stringify(message));
}
setInterval(() => {
    writeHello();
}, 10000);