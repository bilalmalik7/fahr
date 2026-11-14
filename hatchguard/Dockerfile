FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir uv==0.5.11
COPY pyproject.toml ./
RUN uv pip install --system --no-cache -r pyproject.toml
COPY hatchguard/ ./hatchguard/
COPY solutions/ ./solutions/
COPY docs/sop/ ./docs/sop/
RUN python -m hatchguard.data
USER 1000
EXPOSE 8000
CMD ["python", "-m", "hatchguard.cli", "serve"]
