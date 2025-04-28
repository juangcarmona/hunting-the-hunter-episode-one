FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 🔹 Install useful tools
RUN apt update && apt install -y curl wget

# 🔹 Install Python dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# 🔹 Optional: install debugpy if you still want it available
RUN pip install debugpy

# 🔹 Copy source code
WORKDIR /app
COPY . /app

# 🔹 Expose debug port (optional)
EXPOSE 5678

# 🔹 Launch shell (user-controlled environment)
CMD ["/bin/bash"]
