# analyze_layer2_payload.py
import re

def analyze_payload(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("🔍 Analyzing decoded Layer 2 payload...\n")

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

    print("\n🧠 First 20 lines for context:\n")
    for i, line in enumerate(content.splitlines()[:20], 1):
        print(f"{i:02d}: {line}")

if __name__ == "__main__":
    analyze_payload("raw/decoded_layer2.py")
