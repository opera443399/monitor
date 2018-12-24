# monitor

2018/12/24

## POC

### Backend init

* create docker-swarm-service

```bash
docker pull opera443399/whoami
docker tag opera443399/whoami ns-demo/demo:v1
docker tag opera443399/whoami hub.demo.com/ns-demo/demo:v1


docker service create --name local-demoproject-svc1 --detach=true --with-registry-auth --publish "5001:80" --replicas=1 ns-demo/demo:v1
docker service create --name local-demoproject-svc2 --detach=true --with-registry-auth --publish "5002:80" --replicas=2 hub.demo.com/ns-demo/demo:v1

```

* setup etcd

```bash
##### init project info
ETCDCTL_API=3 /usr/local/bin/etcdctl put /monitor/local/projects '{"env":"local","data":[{"icon":"👼","name":"demo1","status":"1"},{"icon":"😇","name":"demoproject","status":"1"}]}'
##### init accessToken
ETCDCTL_API=3 /usr/local/bin/etcdctl put /monitor/local/accessToken/xxx true
ETCDCTL_API=3 /usr/local/bin/etcdctl put /monitor/local/accessToken/yyy false
##### init userinfo
ETCDCTL_API=3 /usr/local/bin/etcdctl put /monitor/userinfo/admin/secrets/xxx true
ETCDCTL_API=3 /usr/local/bin/etcdctl put /monitor/userinfo/admin/env '
{
  "data":[
    {
      "env":"local",
      "uriPrefix":"http://127.0.0.1",
      "accessToken":"xxx"
    },
    {
      "env":"dev",
      "uriPrefix":"http://127.0.0.1",
      "accessToken":"xxx"
    },
    {
      "env":"test",
      "uriPrefix":"http://127.0.0.1",
      "accessToken":"xxx"
    },
    {
      "env":"prod",
      "uriPrefix":"http://127.0.0.1",
      "accessToken":"xxx"
    }
  ]
}'

```

* run monitor
  * run local

  ```bash
  make
  ./bin/monitor -port 80 -node "127.0.0.1:2379" -log-level debug

  ```

  * run on Linux

  ```bash
  test $(docker ps -a -f name=monitor -q |wc -l) -eq 0 || \
  docker rm -f monitor

  docker run -d --restart always \
      --name monitor \
      -p "80:12000" \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v /etc/localtime:/etc/localtime \
      -e ETCD_BACKEND_NODES="127.0.0.1:2379" \
      -e LOG_LEVEL="debug" \
      opera443399/monitor

  docker logs --tail 100 --since 5m -f monitor

  ```

  * run on Mac

  ```bash
  test $(docker ps -a -f name=monitor -q |wc -l) -eq 0 || \
  docker rm -f monitor

  docker run -d --restart always \
      --name monitor \
      -p "80:12000" \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -e ETCD_BACKEND_NODES="127.0.0.1:2379" \
      -e LOG_LEVEL="debug" \
      opera443399/monitor

  docker logs --tail 100 --since 5m -f monitor

  ```

### App init

* init rn

```bash
# react-native init yourProjectName
# cd yourProjectName
# yarn add react-navigation
# yarn add react-native-gesture-handler
# react-native link react-native-gesture-handler

```

* run

copy `App.js` and `css.js` to your project, then run the demo on your simulator or device

## Snapshots

![HomeScreen](./rn/snapshots/HomeScreen.png)
![ProjectListScreen](./rn/snapshots/ProjectListScreen.png)
![ProjectDetailsScreen](./rn/snapshots/ProjectDetailsScreen.png)
![ProfileScreen](./rn/snapshots/ProfileScreen.png)
