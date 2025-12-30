const os = require('node:os');
const assert = require('node:assert/strict');


function test_obfuscation_integrity() {
    res1 = os['hostname']();
    res2 = os['hostname'].call({});
    res3 = os['hostname'].apply({});
    res4 = os['hostname'].bind({})();

    res5 = Reflect.get(os, 'hostname')();
    res6 = Reflect.get(os, 'hostname').call({});
    res7 = Reflect.get(os, 'hostname').apply({});
    res8 = Reflect.get(os, 'hostname').bind({})();

    res9 = Object.getOwnPropertyDescriptor(os, 'hostname').value();

    res10 = os[Object.getOwnPropertyNames(os).find(name => name === 'hostname')]();
    res11 = os[Object.getOwnPropertyNames(os).filter(name => name === 'hostname')].call({});
    res12 = os[Object.getOwnPropertyNames(os).filter(name => name === 'hostname')].apply({});
    res13 = os[Object.getOwnPropertyNames(os).filter(name => name === 'hostname')].bind({})();

    res14 = os[Object.keys(os).find(name => name === 'hostname')]();
    res15 = os[Object.keys(os).filter(name => name === 'hostname')].call({});
    res16 = os[Object.keys(os).filter(name => name === 'hostname')].apply({});
    res17 = os[Object.keys(os).filter(name => name === 'hostname')].bind({})();

    res18 = Object.entries(os).find(([name]) => name === 'hostname')[1]();
    res19 = Object.entries(os).filter(([name]) => name === 'hostname')[0][1].call({});
    res20 = Object.entries(os).filter(([name]) => name === 'hostname')[0][1].apply({});
    res21 = Object.entries(os).filter(([name]) => name === 'hostname')[0][1].bind({})();
    
    res22 = Object.entries(os).filter(([k]) => k === 'hostname')[0][1]();
    res23 = Object.entries(os).filter(([k]) => k === 'hostname')[0][1].call({});
    res24 = Object.entries(os).filter(([k]) => k === 'hostname')[0][1].apply({});
    res25 = Object.entries(os).filter(([k]) => k === 'hostname')[0][1].bind({})();

    res26 = os['host' + 'name']();
    res27 = os[Buffer.from("aG9zdG5hbWU=", 'base64').toString()]();
    res28 = os[String.fromCharCode(0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65)]();
    res29 = os[Buffer.from([0x68, 0x6f, 0x73, 0x74, 0x6e, 0x61, 0x6d, 0x65]).toString()]();
    res30 = os["\x68\x6f\x73\x74\x6e\x61\x6d\x65"]();

    const results = [
        res1, res2, res3, res4, res5, res6, res7, res8, res9, res10, res11, res12, res13,
        res14, res15, res16, res17, res18, res19, res20, res21, res22, res23, res24, res25,
        res26, res27, res28, res29, res30
    ];

    // console.log(results.every(r => r === os.hostname()));
    assert.ok(results.every(r => r === os.hostname()));
}

test_obfuscation_integrity();