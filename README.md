# API Obfuscation Research

## The Problem

Several malicious package detectors such as [GuardDog](https://github.com/DataDog/guarddog) rely on static analysis techniques based on pattern matching to catch suspicious API calls and malicious behaviors.  
However, API pattern matching can be easily bypassed by exploiting the Python's inherent polymorphic nature to make malicious code invisible to static analysis tools.


## The Core Technique
API obfuscation rewrites malicious API calls using semantically equivalent but syntactically different approaches.
The following malicious Python code:

```python
import os
os.system("malicious_command")
```

can be transformed into the following equivalent code that bypass the matching of `os.system`:

```python
getattr(__import__("os"), "system").__call__("malicious_command")
```

Similarly, the following malicious Javascript (JS) code:

```javascript
const child_process = require("node:child_process");
child_process.exec("malicious_command");
```

can be obfuscated using the following equivalent syntax:
```javascript
Reflect.get(child_process, "exec")("malicious_command");
```

And it's not over yet.
Strings representing malicious payloads, modules and APIs'names such as `os` and `system` can be further obfuscated using common techniques including string splitting and several encoding techniques such as Base64 and hexadecimal.

## Key Pillars of API Obfuscation

### Python
**Dynamic (inline) Import:** `import os` → `__import__("os")`

**Alternative Function Calling:** `system(...)` → `system.__call__(...)`

**Indirect Referencing:** from `os.system(...)` to:
- `getattr(os, "system")(...)`
- `os.__getattribute__("system")(...)`  
- `os.__dict__["system"](...)`

By combining the above techniques we can create the following obfuscated variants of the original malicious code `os.system("malicious_command")`:
```python
os.__dict__['system']("malicious_command")
os.__dict__['system'].__call__("malicious_command")
os.__getattribute__('system')("malicious_command")
os.__getattribute__('system').__call__("malicious_command")
getattr(os, 'system')("malicious_command")
getattr(os, 'system').__call__("malicious_command")
__import__('os').system("malicious_command")
__import__('os').system.__call__("malicious_command")
__import__('os').__dict__['system']("malicious_command")
__import__('os').__dict__['system'].__call__("malicious_command")
getattr(__import__('os'), 'system')("malicious_command")
getattr(__import__('os'), 'system').__call__("malicious_command")
__import__('os').__getattribute__('system')("malicious_command")
__import__('os').__getattribute__('system').__call__("malicious_command")
```

### JS

**Alternative Function Calling:** from `child_process.exec(...)` to:
- `child_process.exec.call({}, ...)`
- `child_process.exec.apply({}, [...])`
- `child_process.exec.bind({})(...)`

**Indirect Referencing:** from `child_process.exec(...)` to:
- `child_process["exec"](...)`
- `Reflect.get(child_process, "exec")(...)`
- `Object.getOwnPropertyDescriptor(child_process, "exec").value(...)`
- `child_process[Object.getOwnPropertyNames(child_process).find(name => name === "exec")](...)`
- `child_process[Object.keys(child_process).find(name => name === "exec")](...)`
- `Object.entries(child_process).find(([name, value]) => name === "exec")[1](...)`
- `Object.entries(child_process).filter(([k]) => k === 'exec')[0][1](...)`

By combining the above techniques we can create the following obfuscated variants of the original malicious code `child_process.exec("malicious_command")`:
```javascript
child_process["exec"]("malicious_command")
child_process["exec"].call({}, "malicious_command")
child_process["exec"].apply({}, ["malicious_command"])
child_process["exec"].bind({})("malicious_command")
Reflect.get(child_process, "exec")("malicious_command")
Reflect.get(child_process, "exec").call({}, "malicious_command")
Reflect.get(child_process, "exec").apply({}, ["malicious_command"])
Reflect.get(child_process, "exec").bind({})("malicious_command")
Object.getOwnPropertyDescriptor(child_process, "exec").value("malicious_command")
Object.getOwnPropertyDescriptor(child_process, "exec").value.call({}, "malicious_command")
Object.getOwnPropertyDescriptor(child_process, "exec").value.apply({}, ["malicious_command"])
Object.getOwnPropertyDescriptor(child_process, "exec").value.bind({})("malicious_command")
child_process[Object.getOwnPropertyNames(child_process).find(name => name === "exec")]("malicious_command")
child_process[Object.getOwnPropertyNames(child_process).find(name => name === "exec")].call({}, "malicious_command")
child_process[Object.getOwnPropertyNames(child_process).find(name => name === "exec")].apply({}, ["malicious_command"])
child_process[Object.getOwnPropertyNames(child_process).find(name => name === "exec")].bind({})("malicious_command")
child_process[Object.keys(child_process).find(name => name === "exec")]("malicious_command")
child_process[Object.keys(child_process).find(name => name === "exec")].call({}, "malicious_command")
child_process[Object.keys(child_process).find(name => name === "exec")].apply({}, ["malicious_command"])
child_process[Object.keys(child_process).find(name => name === "exec")].bind({})("malicious_command")
Object.entries(child_process).find(([name, value]) => name === "exec")[1]("malicious_command")
Object.entries(child_process).find(([name, value]) => name === "exec")[1].call({}, "malicious_command")
Object.entries(child_process).find(([name, value]) => name === "exec")[1].apply({}, ["malicious_command"])
Object.entries(child_process).find(([name, value]) => name === "exec")[1].bind({})("malicious_command")
Object.entries(child_process).filter(([k]) => k === 'exec')[0][1]("malicious_command")
Object.entries(child_process).filter(([k]) => k === 'exec')[0][1].call({}, "malicious_command")
Object.entries(child_process).filter(([k]) => k === 'exec')[0][1].apply({}, ["malicious_command"])
Object.entries(child_process).filter(([k]) => k === 'exec')[0][1].bind({})("malicious_command")
```

## Detection of API obfuscation patterns

### Python
I created the following Semgrep rule (see `api-obfuscation-py.yml`) for GuardDog in order to detect the API obfuscation pattern:
```yaml
rules:
  - id: api-obfuscation
    languages:
      - python
    message: This package uses obfuscated API calls that may evade static analysis detection
    metadata:
      description: Identify obfuscated API calls using alternative Python syntax patterns
    severity: WARNING
    patterns:
      - pattern-either:
        # Covered cases:
        # 1) __dict__ access patterns: $MODULE.__dict__[$METHOD](...) / .__call__(...)
        # 2) __getattribute__ patterns: $MODULE.__getattribute__($METHOD)(...) / .__call__(...)
        # 3) getattr patterns: getattr($MODULE, $METHOD)(...) / .__call__(...)
        # It also covers the case where $MODULE is imported as __import__($mod),
        # where $mod is a generic expression (e.g., string literal, variable, etc.)
        - patterns:
          - pattern-either:
              - pattern: $MODULE.__dict__[$METHOD]($...ARGS)
              - pattern: $MODULE.__dict__[$METHOD].__call__($...ARGS)
              - pattern: $MODULE.__getattribute__($METHOD)($...ARGS)
              - pattern: $MODULE.__getattribute__($METHOD).__call__($...ARGS)
              - pattern: getattr($MODULE, $METHOD)($...ARGS)
              - pattern: getattr($MODULE, $METHOD).__call__($...ARGS)
          - metavariable-regex:
              metavariable: $MODULE
              regex: "^[A-Za-z_][A-Za-z0-9_\\.]*$|^__import__\\(.*\\)$"

        # --- Additional Cases: __import__('mod').method(...) / .__call__(...)
        - patterns:
          - pattern-either:
              - pattern: __import__($MODULE).$METHOD($...ARGS)
              - pattern: __import__($MODULE).$METHOD.__call__($...ARGS)
          - metavariable-regex:
              metavariable: $METHOD
              # avoid matching __getattribute__
              regex: "[^(__getattribute__)][A-Za-z_][A-Za-z0-9_]*"
```

**This new rule has been [integrated into GuardDog v2.7.0](https://github.com/DataDog/guarddog/releases/tag/v2.7.0).**  
By leveraging this new rule, I managed to find a new malware campaign of 10 malicious packages leveraging the `__import__('module')` pattern, which were previously undetected by GuardDog.  
See `results_vetting.txt` for more info.

### JS
Similarly to Python, I created the following Semgrep rule (see `api-obfuscation-js.yml`) to detect several API obfuscation patterns in JS code:
```yaml
rules:
  - id: npm-api-obfuscation
    languages:
      - javascript
    message: This package uses obfuscated API calls that may evade static analysis detection
    metadata:
      description: Identify obfuscated API calls using alternative JS syntax patterns
    severity: WARNING
    patterns:
      - pattern-either:
        # Covered cases:
        # 1) module["function"]()
        # 2) Reflect.get(module, "function")()
        # 3) Object.getOwnPropertyDescriptor(module, "function").value()
        # 4) module[Object.getOwnPropertyNames(module).find(name => name === "function")]()
        # 5) module[Object.keys(module).find(name => name === "function")]()
        # 6) Object.entries(module).find(([name, value]) => name === "function")[1]()
        # 7) Object.entries(module).filter(([k]) => k === 'function')[0][1]()
        # Each of these can also use .call(), .apply(), .bind() variants as well:
        # e.g., module["function"].call({}, ...), module["function"].apply({}, [...]), module["function"].bind({})(...)
        - pattern: $MODULE[$FUNCTION]($...ARGS)
        - pattern: $MODULE[$FUNCTION].call($...ARGS)
        - pattern: $MODULE[$FUNCTION].apply($...ARGS)
        - pattern: $MODULE[$FUNCTION].bind($...ARGS)()
        - pattern: Reflect.get($MODULE, $FUNCTION)($...ARGS)
        - pattern: Reflect.get($MODULE, $FUNCTION).call($...ARGS)
        - pattern: Reflect.get($MODULE, $FUNCTION).apply($...ARGS)
        - pattern: Reflect.get($MODULE, $FUNCTION).bind($...ARGS)()
        - pattern: Object.getOwnPropertyDescriptor($MODULE, $FUNCTION).value($...ARGS)
        - pattern: Object.getOwnPropertyDescriptor($MODULE, $FUNCTION).value.call($...ARGS)
        - pattern: Object.getOwnPropertyDescriptor($MODULE, $FUNCTION).value.apply($...ARGS)
        - pattern: Object.getOwnPropertyDescriptor($MODULE, $FUNCTION).value.bind($...ARGS)()
        - pattern: $MODULE[Object.getOwnPropertyNames($MODULE).find($VAR => $VAR === $FUNCTION)]($...ARGS)
        - pattern: $MODULE[Object.getOwnPropertyNames($MODULE).find($VAR => $VAR === $FUNCTION)].call($...ARGS)
        - pattern: $MODULE[Object.getOwnPropertyNames($MODULE).find($VAR => $VAR === $FUNCTION)].apply($...ARGS)
        - pattern: $MODULE[Object.getOwnPropertyNames($MODULE).find($VAR => $VAR === $FUNCTION)].bind($...ARGS)()
        - pattern: $MODULE[Object.keys($MODULE).find($VAR => $VAR === $FUNCTION)]($...ARGS)
        - pattern: $MODULE[Object.keys($MODULE).find($VAR => $VAR === $FUNCTION)].call($...ARGS)
        - pattern: $MODULE[Object.keys($MODULE).find($VAR => $VAR === $FUNCTION)].apply($...ARGS)
        - pattern: $MODULE[Object.keys($MODULE).find($VAR => $VAR === $FUNCTION)].bind($...ARGS)()
        - pattern: Object.entries($MODULE).find(([$VAR, $VALUE]) => $VAR === $FUNCTION)[1]($...ARGS)
        - pattern: Object.entries($MODULE).find(([$VAR, $VALUE]) => $VAR === $FUNCTION)[1].call($...ARGS)
        - pattern: Object.entries($MODULE).find(([$VAR, $VALUE]) => $VAR === $FUNCTION)[1].apply($...ARGS)
        - pattern: Object.entries($MODULE).find(([$VAR, $VALUE]) => $VAR === $FUNCTION)[1].bind($...ARGS)()
        - pattern: Object.entries($MODULE).filter(([$VAR]) => $VAR === $FUNCTION)[0][1]($...ARGS)
        - pattern: Object.entries($MODULE).filter(([$VAR]) => $VAR === $FUNCTION)[0][1].call($...ARGS)
        - pattern: Object.entries($MODULE).filter(([$VAR]) => $VAR === $FUNCTION)[0][1].apply($...ARGS)
        - pattern: Object.entries($MODULE).filter(([$VAR]) => $VAR === $FUNCTION)[0][1].bind($...ARGS)()
      - metavariable-regex:
          metavariable: $MODULE
          regex: "^[A-Za-z_][A-Za-z0-9_]*$"
```

## Instructions to replicate the research PoC

### Python

#### 1) Evaluate GuardDog against a real-world malicious package (`1337c-4.4.7`) and its obfuscated version:

##### Run GuardDog v2.6.0 (without the new rule) to scan both packages:
```
python3 -m venv gd-base && source gd-base/bin/activate

(gd-base) python3 -m pip install guarddog==2.6.0

(gd-base) guarddog pypi scan ./packages_pypi/1337c-4.4.7 --output-format=json | python -m json.tool > ./out/scan_1337c-4.4.7.json

(gd-base) guarddog pypi scan ./packages_pypi/1337c-4.4.7_obfuscated --output-format=json | python -m json.tool > ./out/scan_1337c-4.4.7_obfuscated.json
```
The original package is detected as potentially malicious with 3 matches, while the obfuscated one has no findings.

##### Run GuardDog v2.7.0 (with the new rule) to scan the obfuscated package again:
```
python3 -m venv gd-new && source gd-new/bin/activate

(gd-new) python3 -m pip install guarddog==2.7.0

(gd-new) guarddog pypi scan ./packages_pypi/1337c-4.4.7_obfuscated --output-format=json | python -m json.tool > ./out/scan_1337c-4.4.7_obfuscated_new.json
```
Now the obfuscated package is correctly detected, matching the new API obfuscation rule.

#### 2) Run Semgrep to test the new rule to detect API obfuscation patterns:

##### Positive test cases (`tests_py/test_positive_cases.py`)
```
semgrep --config=api-obfuscation-py.yml ./tests_py/test_positive_cases.py
```

##### Negative test cases (`tests_py/test_negative_cases.py`)
```
semgrep --config=api-obfuscation-py.yml ./tests_py/test_negative_cases.py
```

##### Unit tests to evaluate if the API obfuscation preserve the original functionality:
```
python ./tests_py/test_obfuscation_integrity.py
```

### JS

#### 1) Evaluate GuardDog against a PoC malicious package (`packages_npm/test-1.0.0`) and its obfuscated version:

```
source gd-new/bin/activate

(gd-new) guarddog npm scan ./packages_npm/test-1.0.0 --output-format=json | python -m json.tool > ./out/scan_test-1.0.0.json

(gd-new) guarddog npm scan ./packages_npm/test-1.0.0_obfuscated --output-format=json | python -m json.tool > ./out/scan_test-1.0.0_obfuscated.json
```
The original package is detected as potentially malicious with 2 matches, while the obfuscated one has no findings.


#### 2) Run Semgrep to test the new rule to detect API obfuscation patterns:

##### Positive test cases (`tests_js/test_positive_cases.js`)
```
semgrep --config=api-obfuscation-js.yml ./tests_js/test_positive_cases.js
```

##### Unit tests to evaluate if the API obfuscation preserve the original functionality:
```
node ./tests_js/test_obfuscation_integrity.js
```

## Changelog
- **2024-09-12:** Initial release of the research:
  - API obfuscation patterns for Python
  - Semgrep rule for GuardDog to detect Python API obfuscation
  - Malicious package PoC and unit tests
- **2025-11-12:** Update README.md:
  - State that the new Python rule has been integrated into GuardDog v2.7.0
  - Update instructions to replicate the research PoC for BSides Barcelona 2025 talk
- **2025-12-30:** Major update:
  - API obfuscation patterns for JS
  - Semgrep rule for GuardDog to detect JS API obfuscation
  - Malicious package PoC and unit tests for JS
  - Update of Python Semgrep rule to be more robust against string obfuscation
  - Add presentation related to BSides Barcelona 2025 talk
  - Major refactor of README.md
- **2025-12-31:** Minor update of Python and JS Semgrep rules:
  - Formatting and improve generalization of Python rule
  - Formatting of JS rule and fix documentation

## Disclaimers
First, I would like to say a big thank you to the DataDog Security Labs Team for their effort in maintaining and improving GuardDog.  
It's a great and very useful tool for detecting malicious packages.  
This research has the **main goal** to improve its detection capabilities against adversarial manipulation of source code aiming to bypass static analysis technique, hence anticipating "smart" attackers.