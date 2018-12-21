/*
 * about: docker swarm api
 * api ref: https://docs.docker.com/engine/api/v1.37/
 * sdk go: https://godoc.org/github.com/docker/docker/client
 *
 * Server:
 *  Engine:
 *   Version:      18.03.1-ce
 *   API version:  1.37 (minimum version 1.12)
 *
 * [howto]
 * # curl -s --unix-socket /var/run/docker.sock http:/v1.37/services |jq . |more
 *
 */

package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
	"runtime"
	"strconv"
	"strings"

	"net/http"

	"context"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	backends "github.com/opera443399/kvstore/backends"
	"github.com/opera443399/monitor/log"
)

//KVRead get key from kvstore
func KVRead(key string) (map[string]string, error) {
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

func checkToken(token string, env string) bool {
	key := config.KVPrefix + "/" + env + "/accessToken/" + token
	log.Info("runEnv set to: " + env)
	kvData, err := KVRead(key)
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

// curl 127.0.0.1
func index(w http.ResponseWriter, r *http.Request) {
	msg := `{"status": '200'}`
	fmt.Fprintf(w, "%s\n", msg)
}

// curl -s -X POST -H "Content-Type:application/json" -d '{"accessToken":"xxx","runEnv":"local"}' 127.0.0.1/project
func projectHandler(w http.ResponseWriter, r *http.Request) {
	data := ParseToken{}

	payload, _ := ioutil.ReadAll(r.Body)
	r.Body.Close()
	if err := json.Unmarshal(payload, &data); err != nil {
		log.Error("[json] failed to Unmarshal the payload!")
		return
	}
	if ok := checkToken(data.AccessToken, data.RunEnv); !ok {
		return
	}

	key := config.KVPrefix + "/" + data.RunEnv + "/projects"
	kvData, err := KVRead(key)
	if err != nil {
		log.Error("[kvstore] failed to fetch data!")
		return
	}
	log.Debug("[query-projects] response: %s", kvData[key])
	fmt.Fprintf(w, "%s\n", kvData[key])
}

// curl -s -X POST -H "Content-Type:application/json" -d '{"accessToken":"xxx","runEnv":"local","projectName":"demoproject"}' 127.0.0.1/service
func serviceHandler(w http.ResponseWriter, r *http.Request) {
	svcs := Services{}
	data := ParseProject{}

	payload, _ := ioutil.ReadAll(r.Body)
	r.Body.Close()
	if err := json.Unmarshal(payload, &data); err != nil {
		log.Error("[json] failed to Unmarshal the payload!")
		return
	}
	if ok := checkToken(data.AccessToken, data.RunEnv); !ok {
		return
	}

	servicePrefix := data.RunEnv + "-" + data.ProjectName

	svcs.Env = data.RunEnv
	svcs.ProjectName = data.ProjectName

	cli, err := client.NewEnvClient()
	if err != nil {
		panic(err)
	}

	//------ list service with filter
	fSvc := filters.NewArgs()
	fSvc.Add("name", servicePrefix)
	services, err := cli.ServiceList(context.Background(), types.ServiceListOptions{Filters: fSvc})
	if err != nil {
		panic(err)
	}

	for _, s := range services {
		svc := Service{}

		//------ list task with filter
		fTask := filters.NewArgs()
		fTask.Add("service", s.ID)
		fTask.Add("desired-state", "running")
		tasks, err := cli.TaskList(context.Background(), types.TaskListOptions{Filters: fTask})
		if err != nil {
			panic(err)
		}

		svc.ID = s.ID[:10]
		svc.Name = s.Spec.Name
		svc.Replicas = fmt.Sprintf("%d/%s", len(tasks), strconv.FormatUint(*s.Spec.Mode.Replicated.Replicas, 10))
		image := strings.Split(strings.Split(s.Spec.TaskTemplate.ContainerSpec.Image, "@")[0], "/")
		svc.Image = image[len(image)-1]
		svcs.Data = append(svcs.Data, svc)
	}

	if r, err := json.Marshal(svcs); err == nil {
		log.Debug("[query-services] response:%s", string(r))
	}
	json.NewEncoder(w).Encode(svcs)
}

func main() {
	flag.Parse()
	if config.PrintVersion {
		fmt.Printf("oMonitor %s (Git SHA: %s, Go Version: %s)\n", Version, GitSHA, runtime.Version())
		os.Exit(0)
	}
	if err := initConfig(); err != nil {
		log.Fatal(err.Error())
	}

	http.HandleFunc("/", index)
	http.HandleFunc("/project", projectHandler)
	http.HandleFunc("/service", serviceHandler)

	log.Info("Listening on port *:" + config.Port)
	if err := http.ListenAndServe(":"+config.Port, nil); err != nil {
		log.Fatal(err.Error())
	}
}
