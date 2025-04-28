# reconstruct_payload_url_logic.py

import base64

def decode_utf8_buffer(string):
    """Simulate Buffer.from(str, 'utf8').toString('utf8')"""
    try:
        return bytes(string, 'utf8').decode('utf8')
    except Exception as e:
        return "[ERROR: Invalid UTF-8]"

# Simulated F() array (manually extracted relevant parts)
F = [
    "MTc5MzM=",        # 0x00
    "704776XcIsUB",    # 0x01
    "dXNlcm5hbWU",     # 0x02
    "4A1",             # 0x03
    "cG9zdA",          # 0x04
    "tcGF0aA",         # 0x05 → "OTIu===="
    "Ybm9kZTpwcm9",    # 0x06
    "Z2V0",            # ...
    "constructor",     # ...
    "6GIhNLI",
    "177330uvjtwe",
    "L2tleXM",         # ...
    "/s/",             # 0x0D (13)
    "cmp",
    "OTIu====",        # 0x0F (15)
    "split",           # 0x10
    "cZm9ybURhdGE",    # 0x11
    "YcGxhdGZvcm0",    # 0x12
    "length",          # 0x13
    "join",            # 0x14
    "AcmVxdWVzdA",     # ...
    "bWtkaXJTeW5j",
    "d3JpdGVGaWxl",
    "RaG9tZWRpcg",
    "ZdXNlckluZm8",
    "now",
    "NDcuMTE4Mzgu",    # 0x1A → 26 → '47.11838.'
    "ZT3",
    "sZXhlYw",
    "search",
    "fromCharCode",
    "2660600VygmMI",
    "bc7f301710f4",
    "810189YRoXjW",
    "from",            # 0x22
    "substring",
    "871972JtXaNK",
    "base64",
    "adXJs",           # 0x26
    "(((.+)+)+)+$",
    "LjEzNS4xOTUu",    # 0x28 → 40 → '.135.195.'
    "slice",
    "54gVKMRW",
    "aaHR0cDovLw=",    # 0x2B → 43 → 'http://'
    "toString",        # 0x2C
    "EaG9zdG5hbWU",
    "68774xrQFIJ",
    "13xuwWYi",
    "cm1TeW5j",
    "126203qHmhCQ",
    "YXJndg",
    "11zmpQVh",
    "utf8",
    "jZXNz",
]

# H(index) = F()[index - 0x140]
def H(hex_index):
    return F[hex_index - 0x140]

# Simulate the logic from aw(0x0)
def simulate_aw_logic():
    # We're simulating aD = 0 → use this path:
    aI = H(0x151) + H(0x145)  # "NDcuMTE4Mzgu" + "OTIu===="
    
    aJ = ''
    aK = ''
    aL = ''
    for aM in range(4):
        aJ += aI[2 * aM] + aI[2 * aM + 1]
        aK += aI[8 + 2 * aM] + aI[9 + 2 * aM]
        aL += aI[16 + aM]

    combo = aK + aJ + aL
    print("🔹 Interpolated combined string (aK + aJ + aL):", combo)

    # Final URL result
    url = decode_utf8_buffer("http://") + decode_utf8_buffer(combo) + ":1244"
    print("📡 Reconstructed C2 URL:", url)

simulate_aw_logic()
