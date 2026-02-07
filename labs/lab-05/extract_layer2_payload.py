# extract_layer2_payload.py
import os
import re
import base64
import zlib

def extract_layer2():
    script_dir = os.path.dirname(os.path.abspath(__file__))

    input_file = os.path.join(script_dir, 'output', 'layer2.txt')
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract the embedded bytes literal: b'...'
    match = re.search(r"b'([^']+)'", content)
    if not match:
        raise ValueError("No embedded payload found")

    blob = match.group(1).encode()

    # Layer logic: reverse → base64 → zlib
    reversed_blob = blob[::-1]
    decoded = base64.b64decode(reversed_blob)

    try:
        decompressed = zlib.decompress(decoded)
    except Exception as e:
        raise RuntimeError(f"Decompression failed: {e}")

    output_dir = os.path.join(script_dir, 'output')
    os.makedirs(output_dir, exist_ok=True)

    output_file = os.path.join(output_dir, 'layer3.txt')
    with open(output_file, 'wb') as f:
        f.write(decompressed)

    print("✅ output/layer3.txt")

if __name__ == "__main__":
    extract_layer2()
