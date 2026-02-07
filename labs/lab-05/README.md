# Lab 05 - Recursive Loader Unpacking (Layers 1 → 3)

This lab continues the staged deobfuscation chain.

**Input**: `layer1.py`, produced in Lab 04.  
It contains an embedded compressed payload and a runtime loader pattern.

We split the work into two steps:

1. **Analysis** (`analyze_layer1_payload.py`)  
   Static inspection to identify loader primitives (`exec`, `base64`, `zlib`) and confirm the presence of another packed stage without executing it.

2. **Extraction** (`extract_layer1_payload.py`)  
   Reimplementation of the loader logic: reverse → Base64 decode → zlib decompress.  
   This yields `output/layer2.txt`.

`layer2.txt` reveals the same structure again: an `exec((_)(b'...'))` construct.  
Applying the same extraction logic produces **Layer 3**, which is yet another packed stage and becomes the input for the next lab.

This demonstrates a pattern: **recursive, homogeneous loaders**, where each stage unwraps the next using identical primitives. It is time to solve it programatically.
