import base64
import os
import sys

def decode_payload(pq):
    # Step 1: Extract data and XOR key
    b85_data = pq[10:]       # Base85-encoded payload
    xor_key = pq[1:9]        # XOR key
    decoded = base64.b85decode(b85_data)

    # Step 2: XOR decryption with cyclic key
    plaintext = ''
    for i in range(len(decoded)):
        key_char = xor_key[i % len(xor_key)]
        xor_byte = decoded[i] ^ ord(key_char)
        plaintext += chr(xor_byte)

    return plaintext

if __name__ == '__main__':
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Manual load of the .npl file using relative path
    input_file = os.path.join(script_dir, 'input/.npl')
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Extract the line that defines `pq`
    pq_line = next((l for l in lines if l.strip().startswith("pq=")), None)
    if not pq_line:
        raise ValueError("No pq=... line found in .npl file")

    # Evaluate the `pq` variable assignment
    local_vars = {}
    exec(pq_line.strip(), {}, local_vars)
    pq = local_vars['pq']

    # Decode payload
    result = decode_payload(pq)

    # Ensure output directory exists
    output_dir = os.path.join(script_dir, 'output')
    os.makedirs(output_dir, exist_ok=True)

    # Save the result
    output_file = os.path.join(output_dir, 'decoded_xor.txt')
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write(result)

    print("✅ Decoding completed. Check output/decoded_xor.txt")
