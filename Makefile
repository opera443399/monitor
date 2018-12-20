.PHONY: build run debug clean dep release docker push
VERSION=`egrep -o '[0-9]+\.[0-9a-z.\-]+' version.go`
GIT_SHA=`git rev-parse --short HEAD || echo`

build:
	@echo "Building app..."
	@mkdir -p bin
	@go build -ldflags "-X main.GitSHA=${GIT_SHA}" -o bin/monitor .

run:
	@echo "Running monitor..."
	@./bin/monitor -port 80 -node "127.0.0.1:2379"

debug:
	@echo "Running monitor..."
	@./bin/monitor -port 80 -node "127.0.0.1:2379" -log-level debug

clean:
	@rm -f bin/*

dep:
	@dep ensure -v

release:
	@echo "Building app..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w -X main.GitSHA=${GIT_SHA}" -o bin/monitor-linux-arm64
	
docker:
	@echo "Building app..."
	@GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -ldflags="-s -w -X main.GitSHA=${GIT_SHA}" -o bin/monitor-linux-arm64
	@echo "Building docker image..."
	@docker build -q -t opera443399/monitor -f Dockerfile.alpine .
	@docker tag opera443399/monitor opera443399/monitor:${VERSION}-alpine
	@docker images |grep monitor

push:
	@docker push opera443399/monitor