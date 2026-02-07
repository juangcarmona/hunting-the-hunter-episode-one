#!/usr/bin/env python3
# extract_c2_url_parts.py
# NOTE: I created this file with ChatGPT 5.2. I gave him the distilled initial script, with comments... 
#       Surprsingly it baceme a lot more clever and efficient than its predecessors and was able to extract
#       two URL's:
#           - http://38.92.47.118:1244/s/bc7f301710f4 --> I aleady found this one leting a machine to be infected
#           - http://95.179.135.133:1244/s/bc7f301710f4 --> This is totally new to me. Feel free to investigate.
# Purpose:
# - Reproduce the malware’s string-table shuffle (the IIFE) so H(0xNNN) resolves correctly
# - Emulate Node Buffer.from(str, enc).toString(enc2) used by a4() and a0()
# - Rebuild the bootstrap URL parts used in aw(aD) for both branches (aD=0 and aD=1)
# - Print every intermediate component (seeds, weaved strings, encoded fragments, final URL-ish strings)
#
# No guesses. If something is not decodable, it prints the raw value and keeps going.

from __future__ import annotations
import base64
import re
from dataclasses import dataclass
from typing import List, Optional, Tuple


TARGET_CHECKSUM = 0x46D1A  # from the script

RAW_B5: List[str] = [
    'MTc5MzM=',
    '704776XcIsUB',
    'dXNlcm5hbWU',
    '4A1',
    'cG9zdA',
    'tcGF0aA',
    'Ybm9kZTpwcm9',
    'Z2V0',
    'constructor',
    '6GIhNLI',
    '177330uvjtwe',
    'L2tleXM',
    '/s/',
    'cmp',
    'OTIu====',
    'split',
    'cZm9ybURhdGE',
    'YcGxhdGZvcm0',
    'length',
    'join',
    'AcmVxdWVzdA',
    'bWtkaXJTeW5j',
    'd3JpdGVGaWxl',
    'RaG9tZWRpcg',
    'ZdXNlckluZm8',
    'now',
    'NDcuMTE4Mzgu',
    'ZT3',
    'sZXhlYw',
    'search',
    'fromCharCode',
    '2660600VygmMI',
    'bc7f301710f4',
    '810189YRoXjW',
    'from',
    'substring',
    '871972JtXaNK',
    'base64',
    'adXJs',
    '(((.+)+)+)+$',
    'LjEzNS4xOTUu',
    'slice',
    '54gVKMRW',
    'aaHR0cDovLw=',
    'toString',
    'EaG9zdG5hbWU',
    '68774xrQFIJ',
    '13xuwWYi',
    'cm1TeW5j',
    '126203qHmhCQ',
    'YXJndg',
    '11zmpQVh',
    'utf8',
    'jZXNz'
]


# ----------------------------- JS helpers -----------------------------

_INT_PREFIX = re.compile(r'^[\s]*([+-]?\d+)')


def js_parse_int(s: str) -> int:
    """
    Approximate JS parseInt(s) behavior for this malware context.
    - It’s only used on the obfuscation numeric-looking strings.
    - We take the leading signed decimal run; otherwise raise.
    """
    m = _INT_PREFIX.match(s)
    if not m:
        raise ValueError(f"parseInt failed for: {s!r}")
    return int(m.group(1), 10)


def b64_pad(s: str) -> str:
    """Pad base64 string to multiple of 4 (Node is permissive; Python isn’t)."""
    s = s.strip()
    missing = (-len(s)) % 4
    return s + ("=" * missing)


def try_b64_decode_to_utf8(s: str) -> Optional[str]:
    """Attempt base64 decode -> utf8, return None if it fails."""
    try:
        raw = base64.b64decode(b64_pad(s), validate=False)
        return raw.decode("utf-8", errors="strict")
    except Exception:
        return None


def buffer_from(text: str, enc: str) -> bytes:
    """
    Node Buffer.from(text, enc):
      - enc 'utf8' => encode to bytes
      - enc 'base64' => decode base64 into bytes
    """
    e = enc.lower()
    if e in ("utf8", "utf-8"):
        return text.encode("utf-8", errors="strict")
    if e == "base64":
        return base64.b64decode(b64_pad(text), validate=False)
    raise ValueError(f"Unsupported Buffer.from encoding: {enc!r}")


def buffer_to_string(buf: bytes, enc: str) -> str:
    """
    Node buf.toString(enc):
      - enc 'utf8' => decode bytes
      - enc 'base64' => base64 encode bytes
    """
    e = enc.lower()
    if e in ("utf8", "utf-8"):
        return buf.decode("utf-8", errors="replace")
    if e == "base64":
        return base64.b64encode(buf).decode("ascii")
    raise ValueError(f"Unsupported Buffer.toString encoding: {enc!r}")


@dataclass
class Table:
    arr: List[str]

    def H(self, hex_index: int) -> str:
        return self.arr[hex_index - 0x140]


def shuffle_table_to_checksum(raw: List[str], target: int = TARGET_CHECKSUM) -> Table:
    """
    Reproduce the IIFE shuffle loop:

      while(true){
        try{
          aG = parseInt(H(0x166))/1 * (parseInt(H(0x165))/2)
               + parseInt(H(0x158))/3 + -parseInt(H(0x15b))/4
               + parseInt(H(0x141))/5 + -parseInt(H(0x140))/6 * (-parseInt(H(0x168))/7)
               + -parseInt(H(0x16e))/8 * (parseInt(H(0x161))/9)
               + -parseInt(H(0x156))/10 * (-parseInt(H(0x16a))/11);
          if(aG===target) break;
          else arr.push(arr.shift());
        } catch { arr.push(arr.shift()); }
      }

    """
    arr = list(raw)
    while True:
        t = Table(arr)
        try:
            aG = (
                (js_parse_int(t.H(0x166)) / 0x1) * (js_parse_int(t.H(0x165)) / 0x2)
                + (js_parse_int(t.H(0x158)) / 0x3)
                + (-js_parse_int(t.H(0x15B)) / 0x4)
                + (js_parse_int(t.H(0x141)) / 0x5)
                + (-js_parse_int(t.H(0x140)) / 0x6) * (-js_parse_int(t.H(0x168)) / 0x7)
                + (-js_parse_int(t.H(0x16E)) / 0x8) * (js_parse_int(t.H(0x161)) / 0x9)
                + (-js_parse_int(t.H(0x156)) / 0xA) * (-js_parse_int(t.H(0x16A)) / 0xB)
            )
            if int(aG) == target:
                return t
            arr.append(arr.pop(0))
        except Exception:
            arr.append(arr.pop(0))


# ----------------------------- malware emulation -----------------------------

def a4_transform(s: str, O: str, L: str) -> str:
    """Emulate: Buffer.from(s, O).toString(L)"""
    return buffer_to_string(buffer_from(s, O), L)


def a0_transform(s: str, O: str, L: str) -> str:
    """Emulate: s1 = s.slice(1); Buffer.from(s1, O).toString(L)"""
    return buffer_to_string(buffer_from(s[1:], O), L)


def weave_seed(seed: str) -> Tuple[str, str, str, str]:
    """
    Emulate the aw() weaving:
      aJ += seed[2*m] + seed[2*m+1]
      aK += seed[8+2*m] + seed[9+2*m]
      aL += seed[16+m]
      combo = aK + aJ + aL
    """
    def ch(i: int) -> str:
        return seed[i] if 0 <= i < len(seed) else ""

    aJ = ""
    aK = ""
    aL = ""
    for m in range(4):
        aJ += ch(2*m) + ch(2*m + 1)
        aK += ch(8 + 2*m) + ch(9 + 2*m)
        aL += ch(16 + m)
    combo = aK + aJ + aL
    return aJ, aK, aL, combo


def dump_decoding_hints(label: str, value: str) -> None:
    """
    Print raw + (if possible) base64-decoded view.
    This helps spot which tokens are meant to be decoded vs used as-is.
    """
    print(f"\n[{label}]")
    print("raw:", repr(value))
    maybe = try_b64_decode_to_utf8(value)
    if maybe is not None:
        print("b64->utf8:", repr(maybe))


def main() -> None:
    # 1) Shuffle table exactly like the malware
    t = shuffle_table_to_checksum(RAW_B5)

    # 2) Resolve the key encodings used by Buffer.from(...).toString(...)
    L = t.H(0x16B)   # toString encoding
    O = t.H(0x15C)   # from encoding

    print("=== RESOLVED ENCODINGS (from shuffled table) ===")
    print("O (Buffer.from encoding):", repr(O))
    print("L (toString encoding):   ", repr(L))

    # 3) Pull the constants used in URL building
    #    These are the exact indices referenced in the snippet you posted.
    s_url_raw = t.H(0x15D)
    dump_decoding_hints("s_url_raw (aS(0x15d))", s_url_raw)

    a2_prefix = t.H(0x162) + "="  # a2 = aS(0x162) + '='
    a3_port = ":124"              # a3 is literal ':124'
    print("\n[a2 / a3]")
    print("a2 (raw):", repr(a2_prefix))
    print("a3 (raw):", repr(a3_port))

    # 4) Build the two seeds used by aw(aD): (aD==0) and (aD!=0)
    seed0 = t.H(0x151) + t.H(0x145)
    seed1 = t.H(0x15F) + t.H(0x16D)

    dump_decoding_hints("seed0 left (H(0x151))", t.H(0x151))
    dump_decoding_hints("seed0 right (H(0x145))", t.H(0x145))
    print("\n[seed0 combined]")
    print("seed0:", repr(seed0), "len=", len(seed0))

    dump_decoding_hints("seed1 left (H(0x15f))", t.H(0x15F))
    dump_decoding_hints("seed1 right (H(0x16d))", t.H(0x16D))
    print("\n[seed1 combined]")
    print("seed1:", repr(seed1), "len=", len(seed1))

    # 5) Weave both seeds into the "combo" the malware transforms into the IP-part
    for name, seed in (("aD=0", seed0), ("aD=1", seed1)):
        aJ, aK, aL, combo = weave_seed(seed)
        print(f"\n=== WEAVE RESULT ({name}) ===")
        print("aJ:", repr(aJ))
        print("aK:", repr(aK))
        print("aL:", repr(aL))
        print("combo:", repr(combo), "len=", len(combo))

        # 6) Apply the same a4() transform the malware uses
        #    return a4(a2.slice(1)) + a4(combo) + a3 + '4'
        prefix_transformed = a4_transform(a2_prefix[1:], O, L)
        combo_transformed = a4_transform(combo, O, L)
        aE = prefix_transformed + combo_transformed + a3_port + "4"

        print("\n[a4() transformed parts]")
        print("a4(a2.slice(1)):", repr(prefix_transformed))
        print("a4(combo):      ", repr(combo_transformed))
        print("aE:", repr(aE))

        # 7) Add the path suffix pieces appended in aw():
        #    let aG = aE + b0(0x143); aG += b0(0x157);
        suf1 = t.H(0x143)
        suf2 = t.H(0x157)
        print("\n[aw() suffixes]")
        dump_decoding_hints("suffix1 (H(0x143))", suf1)
        dump_decoding_hints("suffix2 (H(0x157))", suf2)

        aG = aE + suf1 + suf2
        # 
        print("\033[1;93;40m")   
        print("==============================================")
        print("==  BOOTSTRAP REQUEST STRING (aG)           ==")
        print("==============================================")
        print(repr(aG))
        print("==============================================")
        print("\033[0m")

    # 8) Also dump the later C2 POST base building blocks (a5 + path pieces)
    #    In success handler:
    #      arr = a4(aL).split(',')
    #      a5 = a4(a2.slice(1)) + arr[0] + a3 + '4'
    #      a6 = arr[1]
    print("\n=== POST / C2 CONFIG SHAPE (from code) ===")
    print("a5 format:", "a4(a2.slice(1)) + arr[0] + ':124' + '4'")
    print("a6 format:", "arr[1] (C2 path/type)")

    # 9) Dump indices used for HTTP method and form keys in ay():
    #    const au = a4(aS(0x171)); // "post"
    #    aG = { [surl]: '' + a5 + a4(b3(0x142)), [sForm]: aF }
    h_171 = t.H(0x171)
    h_142 = t.H(0x142)
    dump_decoding_hints("H(0x171) (used for HTTP method via a4)", h_171)
    dump_decoding_hints("H(0x142) (appended to a5 via a4)", h_142)

    try:
        http_method = a4_transform(h_171, O, L)
    except Exception as e:
        http_method = f"[a4 failed: {e}]"

    try:
        post_path = a4_transform(h_142, O, L)
    except Exception as e:
        post_path = f"[a4 failed: {e}]"

    print("\n[Derived (via a4)]")
    print("HTTP method (au):", repr(http_method))
    print("a5 suffix (a4(H(0x142))):", repr(post_path))

    # 10) Decode the “http://” candidate from the table if present (your list has aaHR0cDovLw=)
    #     This string may or may not be the one referenced by 0x15d post-shuffle.
    for i, s in enumerate(t.arr):
        if "HR0cDovLw" in s:
            dump_decoding_hints(f"table[{i}] contains HR0cDovLw", s)


if __name__ == "__main__":
    main()
