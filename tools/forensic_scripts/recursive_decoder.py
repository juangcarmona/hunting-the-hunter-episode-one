import base64
import zlib
import os
import re

def decode_base85_xor(pq_string):
    b85_data = pq_string[10:]
    xor_key = pq_string[1:9]
    decoded = base64.b85decode(b85_data)
    plaintext = ''.join(chr(decoded[i] ^ ord(xor_key[i % len(xor_key)])) for i in range(len(decoded)))
    return plaintext

def decode_exec_layer(blob):
    try:
        # Extraer el contenido b'...'
        match = re.search(r"exec\(\(_\)\(b'(.*?)'\)\)", blob, re.DOTALL)
        if not match:
            return None
        content = match.group(1)

        # Desescapar bytes y revertir
        raw_bytes = bytes(content, 'utf-8').decode('unicode_escape').encode('latin1')
        reversed_b64 = raw_bytes[::-1]

        # Decode and decompress
        decompressed = zlib.decompress(base64.b64decode(reversed_b64))
        return decompressed.decode('utf-8')
    except Exception as e:
        print(f"⚠️ Exec layer error: {e}")
        return None

def load_initial_pq():
    with open("raw/.npl", "r", encoding="utf-8") as f:
        for line in f:
            if line.strip().startswith("pq="):
                local_vars = {}
                exec(line.strip(), {}, local_vars)
                return local_vars.get("pq")
    raise ValueError("No pq=... encontrado en raw/.npl")

def save_layer(index, data):
    path = f"decoded/decoded_layer{index}.py"
    with open(path, "w", encoding="utf-8") as f:
        f.write(data)
    print(f"✅ Layer {index} saved in {path}")

def main():
    os.makedirs("decoded", exist_ok=True)

    layer = 1
    pq = load_initial_pq()
    decoded = decode_base85_xor(pq)
    save_layer(layer, decoded)

    current_data = decoded

    while True:
        next_data = decode_exec_layer(current_data)
        if not next_data:
            print("✅ Decoding complete.")
            break
        layer += 1
        save_layer(layer, next_data)
        current_data = next_data

if __name__ == "__main__":
    main()
