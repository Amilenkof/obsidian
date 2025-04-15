Настройка подключения:

kubectl config set-cluster dashboard.qrunoper.diasoft.ru --server=https://dashboard.qrunoper.diasoft.ru:6443 --insecure-skip-tls-verify

kubectl config set-credentials sbpautotest-admin-user --token=<Сюда пишем токен>

kubectl config set-context qrunoper-sbpautotest-admin --cluster=dashboard.qrunoper.diasoft.ru --user=sbpautotest-admin-user --namespace=sbpautotest

kubectl config use-context qrunoper-sbpautotest-admin

kubectl cluster-info    в итоге это ввел другую команду ->>>> тоже самое делает но разрешает доступ ко всем ресурсам к которым есть доступ у указанного пользователя         kubectl cluster-info --namespace=sbpautotest


если все ок - будет текст ->>>  Kubernetes control plane is running at https://qrun.diasoft.ru:6443 (кластер другой будет указан)

### **1. Просмотр ресурсов**

|Команда|Описание|
|---|---|
|`kubectl get pods`|Список всех Pod в текущем namespace|
|`kubectl get pods -n <namespace>`|Список Pod в указанном namespace|
|`kubectl get pods -A`|Список Pod во всех namespaces|
|`kubectl get deployments`|Список Deployment|
|`kubectl get services`|Список Services|
|`kubectl get nodes`|Список нод кластера|
|`kubectl get ingress`|Список Ingress-правил|

---

### **2. Детализация ресурсов**

|Команда|Описание|
|---|---|
|`kubectl describe pod <pod-name>`|Подробная информация о Pod (события, контейнеры)|
|`kubectl describe deployment <deploy-name>`|Информация о Deployment|
|`kubectl describe node <node-name>`|Характеристики ноды (CPU, Memory, Pod)|

---

### **3. Логи и отладка**

|Команда|Описание|
|---|---|
|`kubectl logs <pod-name>`|Логи контейнера в Pod|
|`kubectl logs -f <pod-name>`|Логи в реальном времени (как `tail -f`)|
|`kubectl logs <pod-name> -c <container-name>`|Логи конкретного контейнера (если в Pod несколько контейнеров)|
|`kubectl exec -it <pod-name> -- /bin/sh`|Зайти в контейнер (интерактивный терминал)|
|`kubectl exec <pod-name> -- <command>`|Выполнить команду в контейнере (например, `kubectl exec my-pod -- ls /app`)|

---

### **4. Управление ресурсами**

|Команда|Описание|
|---|---|
|`kubectl apply -f <file.yaml>`|Создать/обновить ресурс из манифеста|
|`kubectl delete -f <file.yaml>`|Удалить ресурс из манифеста|
|`kubectl delete pod <pod-name>`|Удалить Pod|
|`kubectl scale deployment <deploy-name> --replicas=3`|Масштабировать Deployment до 3 реплик|
|`kubectl rollout restart deployment <deploy-name>`|Перезапустить Pod в Deployment|

---

### **5. Проброс портов (порт-форвардинг)**

|Команда|Описание|
|---|---|
|`kubectl port-forward <pod-name> 8080:80`|Пробросить локальный 8080 на порт 80 Pod|
|`kubectl port-forward svc/<service-name> 8080:80`|Пробросить порт через Service|

---

### **6. Работа с Namespace**

|Команда|Описание|
|---|---|
|`kubectl create ns <namespace>`|Создать namespace|
|`kubectl config set-context --current --ns=<namespace>`|Переключиться на namespace|
|`kubectl get ns`|Список всех namespaces|

---

### **7. Полезные команды для диагностики**

|Команда|Описание|
|---|---|
|`kubectl top pod`|Потребление CPU/Memory Pod|
|`kubectl top node`|Потребление ресурсов нодами|
|`kubectl get events --sort-by=.metadata.creationTimestamp`|Просмотр событий кластера|
|`kubectl api-resources`|Список всех типов ресурсов в кластере|

---

### **8. Экспорт конфигурации**

|Команда|Описание|
|---|---|
|`kubectl get pod <pod-name> -o yaml > pod.yaml`|Экспорт конфигурации Pod в YAML|
|`kubectl get deploy <deploy-name> -o yaml > deploy.yaml`|Экспорт Deployment в YAML|

---

### **Пример рабочего процесса**

1. **Найти проблемный Pod**:
    
    bash
    
    Copy
    
    kubectl get pods -n my-namespace
    
2. **Проверить логи**:
    
    bash
    
    Copy
    
    kubectl logs -f my-pod
    
3. **Запустить отладку**:
    
    bash
    
    Copy
    
    kubectl exec -it my-pod -- /bin/sh
    
4. **Удалить и пересоздать**:
    
    bash
    
    Copy
    
    kubectl delete pod my-pod && kubectl apply -f deploy.yaml
    

---

### **Советы**

- Для автодополнения команд установите `bash-completion`:
    
    bash
    
    Copy
    
    echo "source <(kubectl completion bash)" >> ~/.bashrc
    
- Короткие алиасы (добавьте в `~/.bashrc`):
    
    bash
    
    Copy
    
    alias k="kubectl"
    alias kgp="kubectl get pods"
    alias klog="kubectl logs -f"
    

Эти команды покрывают 90% повседневных задач в Kubernetes. Для сложных сценариев (`kubectl diff`, `kubectl patch`) см. [официальную документацию](https://kubernetes.io/docs/reference/kubectl/).