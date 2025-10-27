# Hunting the Hunter Episode One 🕵️‍♂️

This repository contains the full forensic dossier and technical breakdown of a malware campaign detected in April 2025, disguised as a fake job offer from someone impersonating a Wov Labs representative.

🔗 [Versión en Español](README_ES.md)

---

## 🎯 Context

As developers, we are increasingly valuable targets.
We handle secrets, we have privileged access to production environments, source code, critical databases, and cloud infrastructure.
We are not only builders, but potential gateways.

This attack proves how far malicious actors are willing to go, building convincing fake profiles, offering "dream jobs," and using sophisticated technical bait to compromise engineers.

---

## 📢 The Attack Flow

1. **Initial Contact**: A LinkedIn message from "Elian Pérez" offering a lucrative technical manager role.
2. **Social Engineering**: Creation of urgency with \$3M budget claims, MVP timelines, and senior hiring needs.
3. **Malicious Repository**: A Bitbucket repo link disguised as a project codebase.
4. **Payload Trigger**: Obfuscated code inside `next.config.js` designed to generate a `.npl` file and initiate C2 communications.

📄 **Conversation Details**:
- **Key moments** are captured as screenshots in [`screenshots/`](screenshots/) (`conv_001.png` to `conv_004.png`).
- **The full conversation transcript** is available in [`conversation/linkedin_chat_with_elian.md`](conversation/linkedin_chat_with_elian.md).

---

## 📀 Repository Structure

- `boobytrapped_repo/`: Full snapshot of the malicious Bitbucket repository.
- `conversation/`: Full transcript of the LinkedIn conversation.
- `manual_logs/`: CLI command outputs during forensic session (`find`, `tshark`, etc.).
- `pcap_logs/`: Captured network traffic (`capture.pcap`).
- `screenshots/`: Screenshots documenting conversation and VM behavior.
- `tools/forensic_scripts/`: Python scripts and a Docker forensic environment.

---

## 📈 Manual Logs Analysis

**Locate suspicious files:**

```bash
find ~ -type f -printf '%T@ %p\n' | sort -n | tail -n 20
```

- Found `/home/azureuser/.npl`.
- Found `/home/azureuser/capture.pcap`.

**Search config/system directories:**

```bash
find ~/.config ~/.vscode ~/.local /tmp -type f -printf '%T@ %p\n' | sort -n | tail -n 30
```

- No unexpected persistence mechanisms found.

**Analyze network traffic:**

```bash
tshark -r capture.pcap -Y 'frame.time_relative < 795.45' -T fields -e ip.dst | sort | uniq -c | sort -nr
```

- Major traffic with destination `38.92.47.118`, confirmed C2.

**Extract suspicious flows:**

```bash
tshark -r capture.pcap -Y 'ip.addr == 38.92.47.118 || ip.addr == 165.140.86.173 || ip.addr == 103.70.115.38' \
  -T fields -e frame.time -e ip.src -e ip.dst -e tcp.port -e udp.port -e frame.len -e _ws.col.Info
```

- Captured HTTP GET requests to `/s/bc7f301710f4`.
- Detected SSH connection attempts from `103.70.115.38`.

---

## 🧐 Involved IP Addresses

| IP Address     | Role                                        | Observations                                                    |
| -------------- | ------------------------------------------- | --------------------------------------------------------------- |
| 38.92.47.118   | Main C2 Server                              | Responds on port 1244. Serves payload on `GET /s/bc7f301710f4`. |
| 165.140.86.173 | Secondary C2 / Beaconing Server (suspected) | POST connections, possible fallback server.                     |
| 103.70.115.38  | SSH Attempt / Exfiltration Attempt          | Attempted SSH handshake to the forensic VM.                     |

---

## 🔎 Technical Notes

- `.npl` file was **generated locally** by obfuscated JavaScript code.
- C2 infrastructure provided a **secondary payload** different but related to the local `.npl`.
- Multiple C2 servers were contacted during the infection timeline.

Forensic scripts (`tools/forensic_scripts/`) allow anyone to **reproduce decoding** inside a Docker sandbox.

---

## 📢 Reporting and Escalation Targets

This material supports escalation to:

- INCIBE, Guardia Civil, Policía Nacional Española
- Policía Nacional de Colombia
- LinkedIn Trust & Safety
- Atlassian Bitbucket Abuse
- Hosting providers of C2 IPs

---

> "In an age of AI and social engineering, hunting the hunters is no longer optional — it's survival."
