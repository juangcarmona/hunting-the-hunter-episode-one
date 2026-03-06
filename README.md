# Hunting the Hunter Episode One 🕵️‍♂️

Presented at **RootedCON Madrid** (AI&SEC track), March 5, 2026.
This repository is the practical and educational breakdown behind that talk: how a fake hiring flow led to a malicious repo, and how to investigate it safely, step by step.

![RootedCON 2026 Presentation](assets/rooted.png)

🔗 [Versión en Español](README_ES.md)

---

## 🎯 Why this repository exists

As developers, we are high-value targets: we handle secrets, infrastructure access, production credentials, and source code. This project documents a real threat-hunting journey so other engineers can reproduce the investigation process in a controlled and safe way.

---

## 📚 What you will find here

- `boobytrapped_repo/`: snapshot of the suspicious project used during the investigation.
- `conversation/`: LinkedIn transcript and social-engineering context.
- `labs/`: the investigation split into 7 practical labs.
- `pcap_logs/`: network captures and traffic artifacts.
- `assets/screenshots/`: timeline screenshots (`conv_001.png` to `conv_004.png`, VM captures).

📄 Key references:
- Conversation screenshots: [`assets/screenshots/`](assets/screenshots/)
- Full transcript: [`conversation/linkedin_chat_with_elian.md`](conversation/linkedin_chat_with_elian.md)

---

## 🧭 Story in 7 steps (talk replication guide)

1. **Receive the lure**: fake recruiter message with urgency and budget pressure.
2. **Inspect the supplied repo**: identify suspicious behavior in configuration/bootstrapping files.
3. **Reconstruct C2 logic**: recover URL-building and payload retrieval flow.
4. **Observe runtime safely**: capture file/process/network traces in an isolated VM.
5. **Decode staged payloads**: peel back Base85/XOR/compression layers.
6. **Automate recursive decoding**: scale the unpacking process across many layers.
7. **Analyze final behavior**: understand objective, impact, and reporting evidence.

---

## 🧪 Labs overview (what each lab contains)

### Lab 01 — Initial script triage
Path: [`labs/lab-01-initial-script/`](labs/lab-01-initial-script/)

- Beautifies and reviews suspicious JavaScript.
- Focus: readability and first static indicators.
- Main helper: `scripts/01-beautify.sh`.

### Lab 02 — URL/C2 reconstruction
Path: [`labs/lab-02-url-reconstruction/`](labs/lab-02-url-reconstruction/)

- Reconstructs obfuscated URL logic and payload endpoint generation.
- Extracts C2 URL parts and validates assembly.
- Main scripts: `reconstruct_payload_url_logic.py`, `extract_c2_url_parts.py`.

### Lab 03 — Runtime observation
Path: [`labs/lab-03-runtime-observation/`](labs/lab-03-runtime-observation/)

- Watches filesystem, process list, and network activity during controlled execution.
- Produces reproducible runtime evidence.
- Main scripts: `capture-traffic.sh`, `fs-watch.sh`, `ps-watch.sh`.

### Lab 04 — `.npl` payload decoding
Path: [`labs/lab-04/`](labs/lab-04/)

- Decodes first-stage `.npl` artifact (Base85 + XOR pipeline).
- Outputs the next readable layer for further analysis.
- Main script: `decode_payload_1.py`.

### Lab 05 — Manual recursive unpacking
Path: [`labs/lab-05/`](labs/lab-05/)

- Dissects loader layers manually to understand the technique.
- Separates analysis from extraction per layer.
- Main scripts: `analyze_layer1_payload.py`, `extract_layer1_payload.py`, `extract_layer2_payload.py`.

### Lab 06 — Automated recursive decoding
Path: [`labs/lab-06/`](labs/lab-06/)

- Automates recursive extraction over many packed layers.
- Builds a full chain of decoded artifacts for timeline correlation.
- Main script: `recursive_decoder.py`.

### Lab 07 — Final payload analysis
Path: [`labs/lab-07/`](labs/lab-07/)

- Reviews distilled final payload behavior and operational intent.
- Focus: IOC extraction, threat narrative, and reporting-ready evidence.
- Main files: `final_payload_distilled.py`, `input/final_payload.py`.

---

## ✅ Safe execution notes

- Most labs are safe to run in a standard Python 3 environment (Linux/macOS/Windows).
- Lab 01 requires Node.js/npm (`npx js-beautify`).
- Lab 03 demonstrates how I used host tooling like `tshark` and `inotifywait` but those are not required unless you want to run it by your own, and at your own risk.

The objective of this repository is defensive learning, reproducibility, and incident response training.

---

## 🌐 Community, collaboration, and reporting momentum

If this work helps you:

- ⭐ Star the repository and share it with your security/developer teams.
- 👍 Like and support the project updates and upcoming writeups/videos.
- 🤝 Reach out if you want to collaborate on threat-hunting workshops or incident simulation.

I have also tried to involve and notify relevant institutions and teams, and I welcome collaboration/feedback from:

- INCIBE
- Policía Nacional (cybercrime divisions)
- Guardia Civil (cybercrime divisions)
- LinkedIn Trust & Safety
- Platform abuse and infrastructure response teams

Author channels:

- Website: [jgcarmona.com](https://jgcarmona.com)
- YouTube: [@juangcarmona](https://www.youtube.com/@juangcarmona)

---

> "In an age of AI and social engineering, hunting the hunters is no longer optional, it's survival."
