# www.mongols.app — local build, Docker image, Kubernetes
#
#   make docker-build REGISTRY=ghcr.io/myorg IMAGE=www-mongols-app TAG=v1
#   make k8s-apply   REGISTRY=ghcr.io/myorg IMAGE=www-mongols-app TAG=v1
#
# Secrets (Turnstile server key, TLS):
#   kubectl -n mongols-app create secret generic mongols-app-secrets \
#     --from-literal=CLOUDFLARE_TURNSTILE_SECRET_KEY='...'
#   # optional: NEXT_PUBLIC_* can be patched into ConfigMap instead of Secret

SHELL := /bin/bash

REGISTRY ?= ghcr.io/CHANGE_ME
IMAGE ?= www-mongols-app
TAG ?= dev
CONTAINER_IMAGE := $(REGISTRY)/$(IMAGE):$(TAG)

.PHONY: help install lint build docker-build docker-run k8s-apply k8s-dry-run k8s-delete clean

help:
	@echo "Targets:"
	@echo "  make install        npm ci"
	@echo "  make lint           next lint"
	@echo "  make build          next build (local)"
	@echo "  make docker-build   docker build -> $(CONTAINER_IMAGE)"
	@echo "  make docker-run     run container on :3000"
	@echo "  make k8s-dry-run     client-side dry-run apply"
	@echo "  make k8s-apply      kubectl apply (namespace, config, svc, ingress, deploy)"
	@echo "  make k8s-delete     kubectl delete namespace mongols-app"
	@echo "Vars: REGISTRY IMAGE TAG"

install:
	npm ci

lint:
	npm run lint

build:
	npm run build

docker-build:
	@test -n "$(REGISTRY)" && echo "$(REGISTRY)" | grep -qv 'CHANGE_ME' || { echo 'Set REGISTRY to your registry (not ghcr.io/CHANGE_ME).'; exit 1; }
	docker build -t "$(CONTAINER_IMAGE)" .

docker-run: docker-build
	docker run --rm -p 3000:3000 -e NODE_ENV=production "$(CONTAINER_IMAGE)"

.k8s-build:
	@mkdir -p .k8s-build

k8s-dry-run: .k8s-build
	@test -n "$(REGISTRY)" && echo "$(REGISTRY)" | grep -qv 'CHANGE_ME' || { echo 'Set REGISTRY=...'; exit 1; }
	sed 's|MONGOLS_IMAGE_PLACEHOLDER|$(CONTAINER_IMAGE)|g' k8s/deployment.yaml > .k8s-build/deployment.rendered.yaml
	kubectl apply --dry-run=client -f k8s/namespace.yaml
	kubectl apply --dry-run=client -f k8s/configmap.yaml
	kubectl apply --dry-run=client -f k8s/service.yaml
	kubectl apply --dry-run=client -f k8s/ingress.yaml
	kubectl apply --dry-run=client -f .k8s-build/deployment.rendered.yaml

k8s-apply: .k8s-build
	@test -n "$(REGISTRY)" && echo "$(REGISTRY)" | grep -qv 'CHANGE_ME' || { echo 'Set REGISTRY to your registry (not ghcr.io/CHANGE_ME).'; exit 1; }
	sed 's|MONGOLS_IMAGE_PLACEHOLDER|$(CONTAINER_IMAGE)|g' k8s/deployment.yaml > .k8s-build/deployment.rendered.yaml
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/service.yaml
	kubectl apply -f k8s/ingress.yaml
	kubectl apply -f .k8s-build/deployment.rendered.yaml

k8s-delete:
	kubectl delete namespace mongols-app --ignore-not-found

clean:
	rm -rf .k8s-build
