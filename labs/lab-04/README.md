# Lab 04 — Decoding the `.npl` Payload

This lab starts from a single suspicious `.npl` file containing an inline Python `exec` loader. The loader hides a second-stage payload using **Base85 encoding** plus a **cyclic XOR** operation derived from the same string.

We reproduced the loader logic in `decode_npl_l1.py`, extracting the encoded segment (`pq[10:]`), recovering the XOR key (`pq[1:9]`), and decoding the payload deterministically, without executing it.

The result is a fully deobfuscated Python script written to [`output/decoded_xor.txt`](output/decoded_xor.txt), which becomes the input for the next analysis stage.
