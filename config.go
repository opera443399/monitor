package main

import (
	"flag"
	"os"

	backends "github.com/opera443399/kvstore/backends"
	"github.com/opera443399/monitor/log"
)

//BackendsConfig kvstore config
type BackendsConfig = backends.Config

//Config is used to configure app.
type Config struct {
	Port             string
	PrintVersion     bool
	DockerAPIVersion string
	LogLevel         string
	DeployEnv        string
	KVPrefix         string
	BackendsConfig
}

var config Config

func processEnv() {
	//override default args
	dockerAPIVersion := os.Getenv("DOCKER_API_VERSION")
	if len(dockerAPIVersion) > 0 {
		config.DockerAPIVersion = dockerAPIVersion
	}

	deployEnv := os.Getenv("DEPLOY_ENV")
	if len(deployEnv) > 0 {
		config.DeployEnv = deployEnv
	}

	kvPrefix := os.Getenv("KV_PREFIX")
	if len(kvPrefix) > 0 {
		config.KVPrefix = kvPrefix
	}

	logLevel := os.Getenv("LOG_LEVEL")
	if len(logLevel) > 0 {
		config.LogLevel = logLevel
	}

	nodes := os.Getenv("ETCD_BACKEND_NODES")
	if len(nodes) > 0 {
		config.BackendNodes = []string{nodes}
	}

	cakeys := os.Getenv("ETCD_CLIENT_CAKEYS")
	if len(cakeys) > 0 {
		config.ClientCaKeys = cakeys
	}

	cert := os.Getenv("ETCD_CLIENT_CERT")
	if len(cert) > 0 {
		config.ClientCert = cert
	}

	key := os.Getenv("ETCD_CLIENT_KEY")
	if len(key) > 0 {
		config.ClientKey = key
	}
}

// initConfig initializes the configuration
func initConfig() error {
	// Update config from environment variables.
	processEnv()

	if len(config.BackendNodes) == 0 {
		switch config.Backend {
		case "etcdv3":
			config.BackendNodes = []string{"127.0.0.1:2379"}

		}
	}

	os.Setenv("DOCKER_API_VERSION", config.DockerAPIVersion)
	if config.LogLevel != "" {
		log.SetLevel(config.LogLevel)
	}

	log.Info("KVStore backend set to: " + config.Backend)
	log.Info("DeployEnv set to: " + config.DeployEnv)

	return nil
}

func init() {
	flag.StringVar(&config.Port, "port", "12000", "listen to the given port.")
	flag.BoolVar(&config.PrintVersion, "version", false, "print version and exit")
	flag.StringVar(&config.DockerAPIVersion, "docker-api-ver", "1.37", "set docker API version")
	flag.StringVar(&config.LogLevel, "log-level", "", "set log level")
	flag.StringVar(&config.DeployEnv, "env", "local", "set app env")
	flag.StringVar(&config.KVPrefix, "prefix", "/monitor", "set kv prefix")
	flag.StringVar(&config.Backend, "backend", "etcdv3", "backend to use")
	flag.BoolVar(&config.BasicAuth, "basic-auth", false, "Use Basic Auth to authenticate (only used with etcd backends)")
	flag.StringVar(&config.ClientCaKeys, "client-ca-keys", "", "client ca keys")
	flag.StringVar(&config.ClientCert, "client-cert", "", "the client cert")
	flag.StringVar(&config.ClientKey, "client-key", "", "the client key")
	flag.Var(&config.BackendNodes, "node", "list of backend nodes")
	flag.StringVar(&config.Username, "username", "", "the username to authenticate as (only used with etcd backends)")
	flag.StringVar(&config.Password, "password", "", "the password to authenticate with (only used with etcd backends)")

}
