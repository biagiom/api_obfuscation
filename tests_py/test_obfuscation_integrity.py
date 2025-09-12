import os


def test_obfuscation_integrity():
    res_base = os.getcwd()

    res_1 = os.__dict__['getcwd']()
    res_2 = os.__dict__['getcwd'].__call__()
    res_3 = os.__getattribute__('getcwd')()
    res_4 = os.__getattribute__('getcwd').__call__()
    res_5 = getattr(os, 'getcwd')()
    res_6 = getattr(os, 'getcwd').__call__()
    res_7 = __import__('os').getcwd()
    res_8 = __import__('os').getcwd.__call__()
    res_9 = getattr(__import__('os'), 'getcwd')()
    res_10 = getattr(__import__('os'), 'getcwd').__call__()
    res_11 = __import__('os').__dict__['getcwd']()
    res_12 = __import__('os').__dict__['getcwd'].__call__()
    res_13 = __import__('os').__getattribute__('getcwd')()
    res_14 = __import__('os').__getattribute__('getcwd').__call__()

    try:
        assert res_base == res_1 == res_2 == res_3 == res_4 == res_5 == res_6 == res_7 == res_8 == res_9 == res_10 == res_11 == res_12 == res_13 == res_14
    except AssertionError:
        print("Obfuscation integrity test failed!")
    else:
        print("Obfuscation integrity test passed!")
    
    os.system("malicious_command")
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


if __name__ == "__main__":
    test_obfuscation_integrity()