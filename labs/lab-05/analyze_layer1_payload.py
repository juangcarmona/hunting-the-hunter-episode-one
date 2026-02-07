# analyze_layer2_payload.py
import os
import re

def analyze_payload():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Manual load of the .npl file using relative path
    input_file = os.path.join(script_dir, 'input/layer1.py')
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    print("🔍 Analyzing Layer 1 payload...\n")

    # Define suspicious patterns to look for
    patterns = {
        'exec': r'\bexec\s*\(',
        'eval': r'\beval\s*\(',
        'compile': r'\bcompile\s*\(',
        '__import__': r'__import__\s*\(',
        'socket': r'\bsocket\b',
        'subprocess': r'\bsubprocess\b',
        'requests': r'\brequests\b',
        'base64': r'\bbase64\b',
        'zlib': r'\bzlib\b',
        'open': r'\bopen\s*\(',
        'write': r'\.write\s*\(',
        'read': r'\.read\s*\(',
    }

    results = {}

    for label, pattern in patterns.items():
        matches = re.findall(pattern, content)
        if matches:
            results[label] = len(matches)

    if results:
        print("⚠️  Suspicious elements found:")
        for k, v in results.items():
            print(f"  - {k}: {v} occurrence(s)")
    else:
        print("✅ No obviously suspicious functions detected.")

if __name__ == "__main__":
    analyze_payload()
