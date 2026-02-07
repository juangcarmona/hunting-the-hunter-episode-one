#!/usr/bin/env bash
# capture-traffic.sh
set -euo pipefail
sudo tshark -i any -w capture.pcap