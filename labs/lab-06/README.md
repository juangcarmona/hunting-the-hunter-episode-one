# Lab 06 - Recursive Unpacking

This lab fully automates the loader chain identified in previous labs.

Starting from the original `.npl` file, the script decodes the initial **Base85 + XOR** stage and then repeatedly unwraps identical `exec((_)(b'...'))` loaders using **reverse → Base64 → zlib**.

The process stops when no further loader is found.

**Result**: 65 consecutive layers decoded and saved to `output/decoded_layer<N>.py`.

This confirms the payload relies on depth and repetition, not complexity, to evade analysis.
