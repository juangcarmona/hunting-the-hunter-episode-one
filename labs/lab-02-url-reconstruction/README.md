# Lab 02: C2 URL Reconstruction

During the incident, I tried many times to reconstruct the C2 URL by reading the code alone. I could extract numeric-looking fragments and IP-shaped tokens, but never a full, trustworthy address. That uncertainty is what led me to build a threat-hunting machine and let it get infected to observe real traffic.

This lab preserves that moment. `reconstruct_payload_url_logic.py` reproduces the *early* analysis: obfuscated string tables, partial decoding, and multiple URL candidates that look right but don’t fully resolve. Run it to see how close you can get — and why it still wasn’t enough.

`extract_c2_url_parts.py` shows what we can do *today*. It fully emulates the malware’s runtime behavior and extracts complete C2 URLs, including one that was unknown during the incident. The easiest way to run both is from **VS Code** using the provided launch configurations: **“02 URL Reconstruction…”** and **“02 Extract C2 URLs”**. Run them back-to-back and compare the outputs — that contrast is the point of the lab.

```python
# Identified as actively used on 2025 (found infected machines)
http://38.92.47.118:1244/s/bc7f301710f4- 
# Additional endpoint discovered with ChatGPT 5.2 (7/Feb/2026)
http://95.179.135.133:1244/s/bc7f301710f4 
```
