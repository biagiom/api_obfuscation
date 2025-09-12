# API Obfuscation Research

## The Problem

Several malicious package detectors such as [GuardDog](https://github.com/DataDog/guarddog) rely on pattern matching to catch suspicious API calls and malicious behavior.
However, API pattern matching can be easily bypassed by exploiting the Python's inherent polymorphic nature to make malicious code invisible to static analysis tools.


## The Core Technique
API obfuscation rewrites malicious API calls using semantically equivalent but syntactically different approaches.
The following malicious code:

```python
import os
os.system("malicious_command")
```

can be transformed into the following equivalent code that bypass the matching of `os.system`:

```python
getattr(__import__("os"), "system").__call__("malicious_command")
```

And it's not over yet.
Strings representing malicious payloads, modules and APIs'names such as `os` and `system` can be further obfuscated using common techniques including string splitting and
several encoding techniques such as Base64 and hexadecimal.

## Three Pillars of Python API Obfuscation

**Dynamic (inline) imports:** `import os` → `__import__("os")`

**Alternative Calling:** `system()` → `system.__call__()`

**Indirect Referencing:** from `os.system()` to:
- `getattr(os, "system")`
- `os.__getattribute__("system")`  
- `os.__dict__["system"]`

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

## Detection of API obfuscation patterns
I created the following Semgrep rule (see `api-obfuscation-final.yml`) that can be integrated into GuardDog in order to detect the API obfuscation pattern:
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
          # It also covers the case where $MODULE is imported as __import__('mod')
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
                  regex: "^[A-Za-z_][A-Za-z0-9_\\.]*$|^__import__\\([\"'][A-Za-z_][A-Za-z0-9_]*[\"']\\)$"
              - metavariable-regex:
                  metavariable: $METHOD
                  regex: "^[\"'][A-Za-z_][A-Za-z0-9_]*[\"']$"

          # --- Additional Cases: __import__('mod').method(...) / .__call__(...)
          - patterns:
              - pattern-either:
                  - pattern: __import__($MODULE).$METHOD($...ARGS)
                  - pattern: __import__($MODULE).$METHOD.__call__($...ARGS)
              - metavariable-regex:
                  metavariable: $MODULE
                  regex: "^[\"'][A-Za-z_][A-Za-z0-9_]*[\"']$"
              - metavariable-regex:
                  metavariable: $METHOD
                  # avoid matching __getattribute__
                  regex: "[^(__getattribute__)][A-Za-z_][A-Za-z0-9_]*"
```

I tested GuardDog with this new rule and managed to find a new malware campaign of 10 malicious packages leveraging the `__import__('module')` pattern, which were previously undetected by GuardDog.  
See `results_vetting.txt` for more info.

## Instructions to replicate the research PoC

### Evaluate GuardDog against a real-world malicious package (`1337c-4.4.7`) and its obfuscated version:
```
python -m pip install guarddog

guarddog pypi scan ./packages_pypi/1337c-4.4.7 --output-format=json | python -m json.tool > ./out/scan_1337c-4.4.7.json

guarddog pypi scan ./packages_pypi/1337c-4.4.7_obfuscated --output-format=json | python -m json.tool > ./out/scan_1337c-4.4.7_obfuscated.json
```

### Run Semgrep to test the new rule to detect API obfuscation patterns:

#### Positive test cases (`test_positive_cases.py`)
```
semgrep --config=api-obfuscation-final.yml ./tests_py/test_positive_cases.py
```

#### Negative test cases (`test_negative_cases.py`)
```
semgrep --config=api-obfuscation-final.yml ./tests_py/test_negative_cases.py
```

#### Unit tests to evaluate if the API obfuscation preserve the original functionality:
```
python ./test_py/test_obfuscation_integrity.py
```

## Disclaimers
First, I would like to say a big thank you to the DataDog Security Labs Team for their effort in maintaining and improving GuardDog.  
It's a great and very useful tool for detecting malicious packages.  
This research has the **main goal** to improve its detection capabilities against adversarial manipulation of source code aiming to bypass static analysis technique,
hence anticipating "smart" attackers.