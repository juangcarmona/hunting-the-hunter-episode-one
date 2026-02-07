# reconstruct_payload_url_logic.py

import base64

F = [
    "MTc5MzM=",
    "704776XcIsUB",
    "dXNlcm5hbWU",
    "4A1",
    "cG9zdA",
    "tcGF0aA",
    "Ybm9kZTpwcm9",
    "Z2V0",
    "constructor",
    "6GIhNLI",
    "177330uvjtwe",
    "L2tleXM",
    "/s/",
    "cmp",
    "OTIu====",
    "split",
    "cZm9ybURhdGE",
    "YcGxhdGZvcm0",
    "length",
    "join",
    "AcmVxdWVzdA",
    "bWtkaXJTeW5j",
    "d3JpdGVGaWxl",
    "RaG9tZWRpcg",
    "ZdXNlckluZm8",
    "now",
    "NDcuMTE4Mzgu",
    "ZT3",
    "sZXhlYw",
    "search",
    "fromCharCode",
    "2660600VygmMI",
    "bc7f301710f4",
    "810189YRoXjW",
    "from",
    "substring",
    "871972JtXaNK",
    "base64",
    "adXJs",
    "(((.+)+)+)+$",
    "LjEzNS4xOTUu",
    "slice",
    "54gVKMRW",
    "aaHR0cDovLw=",
    "toString",
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

def H(idx):
    return F[idx - 0x140]

def safe_char(s, i):
    # Emulate JavaScript string indexing (out-of-range → empty string)
    return s[i] if i < len(s) else ""

def maybe_b64(s):
    try:
        return base64.b64decode(s).decode("utf-8")
    except Exception:
        return None

def looks_like_ip_fragment(s):
    return s is not None and s != "" and all(c.isdigit() or c == "." for c in s)

def simulate_aw_partial():
    # === Seed construction (aD == 0 branch, using the same indices as the script) ===
    seed_left  = H(0x151)
    seed_right = H(0x145)
    seed = seed_left + seed_right

    print("[seed]")
    print(" left :", seed_left)
    print(" right:", seed_right)
    print(" full :", seed)
    print()

    # === Weaving logic (JS-compatible indexing) ===
    aJ, aK, aL = "", "", ""
    for i in range(4):
        aJ += safe_char(seed, 2*i)       + safe_char(seed, 2*i + 1)
        aK += safe_char(seed, 8 + 2*i)   + safe_char(seed, 9 + 2*i)
        aL += safe_char(seed, 16 + i)

    combo = aK + aJ + aL

    print("[woven chunks]")
    print(" aJ (head):", aJ)
    print(" aK (mid) :", aK)
    print(" aL (tail):", aL)
    print()

    print("[combined token]")
    print(" combo:", combo)
    print(" length:", len(combo))
    print()

    # === URL framing (protocol only, host unresolved) ===
    proto_b64 = "aaHR0cDovLw="
    proto = base64.b64decode(b64_fix_padding(proto_b64[1:])).decode("utf-8", errors="ignore")

    print("[url framing]")
    print(" protocol :", proto)
    print(" ip token :", "<base64:", combo, ">")
    print(" port     :", ":1244")
    print()

    # === Real analysis: derive numeric-looking fragments from F ===
    print("[numeric-looking fragments derived from F]")

    numeric_fragments = []
    for s in F:
        decoded = maybe_b64(s)
        if looks_like_ip_fragment(decoded):
            numeric_fragments.append(decoded)
            print(" ", decoded)

    print()
    print("\033[1;93;40m")  
    print("[url candidates]")

    for i in range(len(numeric_fragments)):
        for j in range(len(numeric_fragments)):
            if i == j:
                continue
            host_like = numeric_fragments[i] + numeric_fragments[j]
            print(f" {proto}{host_like}:1244")
    
    print("\033[0m")


def b64_fix_padding(s):
    return s + "=" * (-len(s) % 4)

simulate_aw_partial()
