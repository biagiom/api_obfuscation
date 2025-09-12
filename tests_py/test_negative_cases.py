# test_negative_cases.py - These should NOT be detected by the rule

# Test 1: Normal imports and function calls
import os
import sys
import json
os.system('ls')
sys.exit(0)
json.loads('{"key": "value"}')

# Test 2: Standard function definitions and calls
def my_function():
    return "hello"

def another_function(arg1, arg2):
    return arg1 + arg2

result = my_function()
result2 = another_function(1, 2)

# Test 3: Class methods
class MyClass:
    def method(self):
        return "test"
    
    def another_method(self, arg):
        return f"arg: {arg}"

obj = MyClass()
obj.method()
obj.another_method("test")

# Test 4: Normal dictionary access
my_dict = {'key': 'value', 'system': 'not_a_function'}
value = my_dict['key']
system_val = my_dict['system']  # This is just string access

# Test 5: List access
my_list = ['item1', 'item2', 'system']
item = my_list[0]

# Test 6: Normal getattr usage on custom objects
class Configuration:
    def __init__(self):
        self.setting1 = "value1"
        self.setting2 = "value2"

config = Configuration()
setting = getattr(config, 'setting1')
default_setting = getattr(config, 'nonexistent', 'default')

# Test 7: Normal __dict__ access on custom objects
class DataHolder:
    def __init__(self):
        self.data = "some data"

holder = DataHolder()
data_dict = holder.__dict__
data_value = holder.__dict__['data']

# Test 8: Built-in functions called normally
result = eval('1 + 1')
exec('x = 5')
imported = __import__('json')  # Just importing, not calling methods

# Test 9: String operations that might look suspicious
string_system = "system"
string_import = "__import__"
method_name = "call"

# Test 10: Lambda functions
func = lambda x: x * 2
result = func(5)

# Test 11: Decorators
def my_decorator(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@my_decorator
def decorated_function():
    return "decorated"

decorated_function()

# Test 12: Context managers
with open('file.txt', 'w') as f:
    f.write('content')

# Test 13: Exception handling
try:
    risky_operation()
except Exception as e:
    handle_error(e)

# Test 14: List comprehensions and generators
numbers = [x * 2 for x in range(10)]
gen = (x for x in range(5))

# Test 15: Normal module attribute access
import datetime
now = datetime.datetime.now()
timestamp = now.timestamp()

# Test 16: Property access
class PropertyClass:
    @property
    def my_property(self):
        return "property_value"

prop_obj = PropertyClass()
value = prop_obj.my_property

# Test 17: Multiple normal imports
from collections import defaultdict
from functools import partial
from itertools import chain

dd = defaultdict(list)
dd['key'].append('value')

# Test 18: Normal subprocess usage (not obfuscated)
import subprocess
result = subprocess.run(['ls', '-la'], capture_output=True)
output = subprocess.check_output(['echo', 'hello'])

# Test 19: Regular expressions and string methods
import re
pattern = re.compile(r'\d+')
matches = pattern.findall('123 456 789')

text = "hello world"
upper_text = text.upper()
split_text = text.split(' ')

# Test 20: File operations
with open('test.txt', 'r') as file:
    content = file.read()
    lines = file.readlines()

# Test 21: Variable assignments (does not match)
cmd_func = __import__('os').__dict__['system']
cmd_func('malicious_command')