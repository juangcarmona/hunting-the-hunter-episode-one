# Lab 07 - Final Payload

This lab analyzes the last decoded stage of the chain (Layer 65).

At this point, obfuscation stops.  
The payload transitions from *hiding* to *acting*.

Layer 65 is a platform-aware Python downloader that reconstructs a C2 endpoint, drops binaries into a stealthy location, and executes them silently in the background.

## What this layer does

- Ensures required dependencies (`requests`) are available at runtime
- Reconstructs a remote C2 address via runtime Base64 manipulation
- Uses the user’s home directory and a `.vscode/` path for camouflage
- Downloads two secondary payloads (`/payl/` and `/bro/`)
- Executes them without user interaction
- Explicitly avoids macOS after the first stage, indicating intentional platform targeting
- Propagates a campaign identifier (`sType`) originating from Layer 0

All previous layers exist solely to protect and delay access to this logic.

## Observed execution flow

The full sequence - from initial trigger to external infrastructure contact - is summarized in the accompanying sequence diagram:

- Node.js application retrieves the initial payload
- Hidden data is persisted locally as `.npl`
- Recursive loaders unpack until Layer 65
- External C2 infrastructure is contacted automatically
- Additional payloads are dropped under `~/.vscode/` and executed

This demonstrates the sequence noticed during the infection:

![Seq Runtime Observation](../../assets/diagrams/04_seq_runtime_observation.jpg)

## Post-mortem note

During [Lab 03](../lab-03-runtime-observation/), when the machine was intentionally allowed to be infected, only the `.npl` artifact was detected.

The secondary activity under `~/.vscode/` remained unnoticed at the time. [see it here?](../lab-03-runtime-observation/manual_logs/find_1_output.txt)

Notably, this system did not have VS Code installed. The only explicit action performed was running `npm run dev`, yet a populated `~/.vscode/node_modules/` tree appeared, containing legitimate-looking packages.

This reinforces the camouflage strategy: the operational payload blended into tooling-shaped filesystem noise, making the real activity indistinguishable from normal development artifacts.

What those secondary payloads do next, how long they persist, and what commands they receive remains unknown.

That is a different story.

