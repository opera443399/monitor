package main

import (
	backends "github.com/opera443399/kvstore/backends"
	"github.com/opera443399/monitor/log"
)

//kvGetValue get key from kvstore
func kvGetValue(key string) (map[string]string, error) {
	log.Debug("[kvstore] %s: get [%s]", config.BackendNodes, key)
	storeClient, err := backends.New(config.BackendsConfig)
	if err != nil {
		log.Fatal(err.Error())
	}

	result, err := storeClient.GetValues(key)
	if err != nil {
		return nil, err
	}
	return result, nil
}

//checkToken validate post action
func checkToken(key string) bool {
	log.Debug("[kvstore] key set to: %s", key)
	kvData, err := kvGetValue(key)
	log.Debug("[kvstore] result: %v", kvData)
	if err != nil {
		log.Error("[kvstore] invalid token!")
		return false
	}
	if len(kvData) == 0 {
		log.Error("[kvstore] invalid token!")
		return false
	}
	if kvData[key] != "true" {
		log.Error("[kvstore] token expired!")
		return false
	}
	return true
}
