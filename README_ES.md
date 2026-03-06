# Hunting the Hunter — Episodio Uno 🕵️‍♂️


Presentado en **RootedCON Madrid** (track AI&SEC), el 5 de marzo de 2026.
Este repositorio reúne la parte práctica y educativa de esa charla: cómo una falsa oferta laboral llevó a un repositorio malicioso y cómo investigarlo de forma segura, paso a paso.

![Presentación RootedCON 2026](assets/rooted.png)

🔗 [English Version](README.md)

---

## 🎯 Por qué existe este repositorio

Como desarrolladores somos objetivos de alto valor: manejamos secretos, accesos a infraestructura, credenciales de producción y código fuente. Este proyecto documenta una investigación real para que otros profesionales puedan reproducir el proceso de threat hunting de forma controlada y segura.

---

## 📚 Qué vas a encontrar aquí

- `boobytrapped_repo/`: snapshot del proyecto sospechoso usado durante la investigación.
- `conversation/`: transcripción y contexto de ingeniería social en LinkedIn.
- `labs/`: investigación dividida en 7 laboratorios prácticos.
- `pcap_logs/`: capturas de red y artefactos de tráfico.
- `assets/screenshots/`: evidencias visuales de la conversación y la VM (`conv_001.png` a `conv_004.png`).

📄 Referencias clave:
- Capturas de conversación: [`assets/screenshots/`](assets/screenshots/)
- Transcripción completa: [`conversation/linkedin_chat_with_elian.md`](conversation/linkedin_chat_with_elian.md)

---

## 🧭 Historia en 7 pasos (guía para replicar la charla)

1. **Llega el señuelo**: contacto de falso recruiter con urgencia y presión por presupuesto.
2. **Inspección del repositorio recibido**: detección de comportamiento sospechoso en archivos de arranque/configuración.
3. **Reconstrucción de la lógica C2**: recuperación del flujo de construcción de URL y descarga de payload.
4. **Observación en ejecución de forma segura**: captura de trazas de ficheros, procesos y red en VM aislada.
5. **Decodificación por etapas**: eliminación de capas Base85/XOR/compresión.
6. **Automatización recursiva**: escalado del desempaquetado a múltiples capas.
7. **Análisis del payload final**: objetivo, impacto y evidencias listas para reporte.

---

## 🧪 Resumen de labs (qué contiene cada uno)

### Lab 01 — Triage inicial del script
Ruta: [`labs/lab-01-initial-script/`](labs/lab-01-initial-script/)

- Formatea y revisa JavaScript sospechoso.
- Foco: legibilidad e indicadores estáticos iniciales.
- Script principal: `scripts/01-beautify.sh`.

### Lab 02 — Reconstrucción de URL/C2
Ruta: [`labs/lab-02-url-reconstruction/`](labs/lab-02-url-reconstruction/)

- Reconstruye la lógica ofuscada de URLs y endpoints de payload.
- Extrae partes de la URL C2 y valida el ensamblado.
- Scripts principales: `reconstruct_payload_url_logic.py`, `extract_c2_url_parts.py`.

### Lab 03 — Observación en runtime
Ruta: [`labs/lab-03-runtime-observation/`](labs/lab-03-runtime-observation/)

- Monitoriza filesystem, procesos y tráfico durante ejecución controlada.
- Genera evidencia reproducible de comportamiento en vivo.
- Scripts principales: `capture-traffic.sh`, `fs-watch.sh`, `ps-watch.sh`.

### Lab 04 — Decodificación del payload `.npl`
Ruta: [`labs/lab-04/`](labs/lab-04/)

- Decodifica el artefacto `.npl` de primera etapa (pipeline Base85 + XOR).
- Produce la siguiente capa legible para continuar análisis.
- Script principal: `decode_payload_1.py`.

### Lab 05 — Desempaquetado recursivo manual
Ruta: [`labs/lab-05/`](labs/lab-05/)

- Disecciona manualmente capas de loader para entender la técnica.
- Separa análisis de extracción por etapa.
- Scripts principales: `analyze_layer1_payload.py`, `extract_layer1_payload.py`, `extract_layer2_payload.py`.

### Lab 06 — Decodificación recursiva automatizada
Ruta: [`labs/lab-06/`](labs/lab-06/)

- Automatiza la extracción recursiva de múltiples capas empaquetadas.
- Construye la cadena completa de artefactos decodificados para correlación temporal.
- Script principal: `recursive_decoder.py`.

### Lab 07 — Análisis del payload final
Ruta: [`labs/lab-07/`](labs/lab-07/)

- Revisa el comportamiento final del payload y su intención operativa.
- Foco: extracción de IOCs, narrativa de amenaza y evidencia para reporte.
- Ficheros principales: `final_payload_distilled.py`, `input/final_payload.py`.

---

## ✅ Notas de ejecución segura

- La mayoría de labs son seguros de ejecutar en un entorno estándar con Python 3 (Linux/macOS/Windows).
- Lab 01 requiere Node.js/npm (`npx js-beautify`).
- Lab 03 demuestra la utilización de herramientas de sistema como `tshark` e `inotifywait`, no es necesario hacerlo a no ser que quieras ejecutarlo por ti mismo y dejarte infectar. Si lo haces, aisla bien el entorno y ten cuidado.

El objetivo de este repositorio es aprendizaje defensivo, reproducibilidad y entrenamiento en respuesta a incidentes.

---

## 🌐 Comunidad, colaboración y continuidad

Si este trabajo te aporta valor:

- ⭐ Dale star al repositorio y compártelo con tus equipos de seguridad/desarrollo.
- 👍 Apoya próximas publicaciones y nuevos vídeos técnicos.
- 🤝 Escríbeme si quieres colaborar en talleres de threat hunting o simulación de incidentes.

También he intentado involucrar y notificar a instituciones y equipos relevantes, y agradezco colaboración/respuesta de:

- INCIBE
- Policía Nacional (unidades de cibercrimen)
- Guardia Civil (unidades de cibercrimen)
- LinkedIn Trust & Safety
- Equipos de abuso de plataforma e infraestructura

Canales del autor:

- Web: [jgcarmona.com](https://jgcarmona.com)
- YouTube: [@juangcarmona](https://www.youtube.com/@juangcarmona)

---

> "En una era de IA e ingeniería social, cazar a los cazadores ya no es opcional, es cuestión de supervivencia."
