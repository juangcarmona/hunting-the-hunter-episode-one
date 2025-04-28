# Hunting the Hunter — Episodio Uno 🕵️‍♂️

Este repositorio contiene el expediente forense completo y el desglose técnico de una campaña de malware detectada en abril de 2025, disfrazada como una oferta de trabajo falsa de alguien que se hacía pasar por un representante de Wov Labs.

🔗 [English Version](README.md)

---

## 🎯 Contexto

Como desarrolladores, somos objetivos cada vez más valiosos.
Manejamos secretos, tenemos acceso privilegiado a entornos de producción, código fuente, bases de datos críticas e infraestructura en la nube.
No solo somos constructores, también somos puertas de entrada.

Este ataque demuestra hasta dónde están dispuestos a llegar los actores maliciosos, creando perfiles falsos convincentes, ofreciendo "trabajos soñados" y utilizando cebos técnicos sofisticados para comprometer a ingenieros.

---

## 📢 Flujo del Ataque

1. **Contacto Inicial**: Un mensaje en LinkedIn de "Elian Pérez" ofreciendo un puesto de Technical Manager muy bien remunerado.
2. **Ingeniería Social**: Creación de urgencia mencionando presupuestos de \$3M, plazos de MVP y necesidad de contratar equipos sénior.
3. **Repositorio Malicioso**: Enlace a un repositorio de Bitbucket disfrazado como base de código de proyecto.
4. **Activación del Payload**: Código ofuscado dentro de `next.config.js` diseñado para generar un archivo `.npl` e iniciar comunicaciones con C2.

📄 **Detalles de la Conversación**:
- **Momentos clave** capturados en [`screenshots/`](screenshots/) (`conv_001.png` a `conv_004.png`).
- **Transcripción completa** disponible en [`conversation/linkedin_chat_with_elian.md`](conversation/linkedin_chat_with_elian.md).

---

## 📀 Estructura del Repositorio

- `boobytrapped_repo/`: Copia completa del repositorio malicioso de Bitbucket.
- `conversation/`: Transcripción completa de la conversación en LinkedIn.
- `manual_logs/`: Salida de comandos CLI durante la sesión forense (`find`, `tshark`, etc.).
- `pcap_logs/`: Tráfico de red capturado (`capture.pcap`).
- `screenshots/`: Capturas documentando conversación y actividad en la VM.
- `tools/forensic_scripts/`: Scripts en Python y entorno forense en Docker.

---

## 📈 Análisis Manual de Logs

**Localizar archivos sospechosos:**

```bash
find ~ -type f -printf '%T@ %p\n' | sort -n | tail -n 20
```

- Encontrado `/home/azureuser/.npl`.
- Encontrado `/home/azureuser/capture.pcap`.

**Buscar en directorios de sistema/configuración:**

```bash
find ~/.config ~/.vscode ~/.local /tmp -type f -printf '%T@ %p\n' | sort -n | tail -n 30
```

- No se encontraron mecanismos de persistencia inesperados.

**Analizar tráfico de red:**

```bash
tshark -r capture.pcap -Y 'frame.time_relative < 795.45' -T fields -e ip.dst | sort | uniq -c | sort -nr
```

- Tráfico predominante hacia `38.92.47.118`, confirmado como C2.

**Extraer flujos sospechosos:**

```bash
tshark -r capture.pcap -Y 'ip.addr == 38.92.47.118 || ip.addr == 165.140.86.173 || ip.addr == 103.70.115.38' \
  -T fields -e frame.time -e ip.src -e ip.dst -e tcp.port -e udp.port -e frame.len -e _ws.col.Info
```

- Capturadas solicitudes HTTP GET a `/s/bc7f301710f4`.
- Detectados intentos de conexión SSH desde `103.70.115.38`.

---

## 🧐 Direcciones IP Involucradas

| IP             | Rol                                         | Observaciones                                                |
| -------------- | ------------------------------------------- | ------------------------------------------------------------ |
| 38.92.47.118   | Servidor C2 Principal                       | Responde en el puerto 1244. Sirve payload en `GET /s/bc7f301710f4`. |
| 165.140.86.173 | Segundo C2 / Servidor de Beaconing (sospechoso) | Conexiones POST detectadas, posible servidor de respaldo.    |
| 103.70.115.38  | Intento de SSH / Exfiltración                | Intentó handshake SSH hacia la VM forense.                   |

---

## 🔎 Notas Técnicas

- El archivo `.npl` fue **generado localmente** por código JavaScript ofuscado.
- La infraestructura C2 proporcionó un **payload secundario** distinto pero relacionado al `.npl` local.
- Durante la infección se contactaron múltiples servidores C2.

Los scripts forenses (`tools/forensic_scripts/`) permiten **reproducir la decodificación** dentro de un contenedor Docker.

---

## 📢 Destinatarios para Escalado de Denuncia

Este material respalda la escalada a:

- INCIBE, Guardia Civil, Policía Nacional Española
- Policía Nacional de Colombia
- LinkedIn Trust & Safety
- Atlassian Bitbucket Abuse
- Proveedores de hosting de las IPs C2

---

> "En una era de IA e ingeniería social, cazar a los cazadores ya no es opcional: es cuestión de supervivencia."
