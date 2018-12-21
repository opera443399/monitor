package main

//Project desc a project
type Project struct {
	Icon   string `json:"icon"`
	Name   string `json:"name"`
	Status string `json:"status"`
}

//Projects desc a list of projects
type Projects struct {
	Env  string    `json:"env"`
	Data []Project `json:"data"`
}

//ParseToken save payload from http.Request
type ParseToken struct {
	AccessToken string `json:"accessToken"`
	RunEnv      string `json:"runEnv"`
}

//ParseProject save payload from http.Request
type ParseProject struct {
	AccessToken string `json:"accessToken"`
	RunEnv      string `json:"runEnv"`
	ProjectName string `json:"projectName"`
}

//Service A docker swarm service
type Service struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Replicas string `json:"replicas"`
	Image    string `json:"image"`
}

//Services A list of docker swarm services
type Services struct {
	Env         string    `json:"env"`
	ProjectName string    `json:"projectName"`
	Data        []Service `json:"data"`
}

var port string
