.PHONY: help
help:
	@echo "Available targets:"
	@echo "  make dev           - Run in Dev mode"
	@echo "  make start         - Run in Production mode"
	@echo "  make lint          - Lint the code"
	@echo "  make format        - Format the code"
	@echo "  make docker-dev    - Run in Dev mode with Docker"
	@echo "  make docker-clean  - Remove Docker containers"
	@echo "  make help          - Display this help message"

.PHONY: dev
dev:
	deno task dev

.PHONY: start
start:
	deno task start

.PHONY: lint
lint:
	deno lint

.PHONY: format
format:
	deno fmt

.PHONY: docker-dev
docker-dev:
	docker compose -f compose-dev.yaml up -w

.PHONY: docker-clean
docker-clean:
	docker compose -f compose-dev.yaml down && docker compose down
