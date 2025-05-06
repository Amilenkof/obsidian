```yml
name: "pg-replication"  
version: '3.8'  
  
services:  
  pgmaster:  
    container_name: "pgmaster"  
    image: postgres:13.3  
    networks:  
      - pgnet  
    ports:  
      - "15432:5432"               # <порт_на_хосте>:<порт_в_контейнере>  
    environment:  
      POSTGRES_USER: postgres     # Логин  
      POSTGRES_PASSWORD: 1111     # Пароль  
    #      POSTGRES_DB: postgres      # Название БД    volumes:  
      - "./volumes/pgmaster13/:/var/lib/postgresql/data"  # Том для данных <папка_на_хосте>:<папка_в_контейнере>  
  #      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Скрипт инициализации (опционально)  #    restart: unless-stopped       # Автоперезапуск  
  pgslave:  
    container_name: "pgslave"  
    image: postgres:13.3  
    networks:  
      - pgnet  
    ports:  
      - "15433:5432"  
    environment:  
      POSTGRES_USER: postgres  
      POSTGRES_PASSWORD: 1111  
    volumes:  
      - "./volumes/pgslave13/:/var/lib/postgresql/data"  
  
  pgslaveasync:  
    container_name: "pgslaveasync"  
    image: postgres:13.3  
    networks:  
      - pgnet  
    ports:  
      - "15434:5432"  
    environment:  
      POSTGRES_USER: postgres  
      POSTGRES_PASSWORD: 1111  
    volumes:  
      - "./volumes/pgslaveasync13/:/var/lib/postgresql/data"  
  
networks:  
  pgnet:                          # отдельная сеть для контейнеров
```

Для реплицирования необходимо задать ряд настроек, буду рассматривать на примере созданных БД из docker-compose выше. Файл `postgresql.conf` у каждого образа свой путь, файлы лежат в настройках проекта (путь ./volumes/pgslaveasync13/)
```
wal_level = replica       # minimal, replica, or logical (- **Уровень детализации информации в WAL.**
    
    - `replica` — записывается достаточно данных для репликации и PITR.
        
    - Альтернативы:
        
        - `minimal` — только для аварийного восстановления (без репликации).
            
        - `logical` — добавляет данные для логической репликации.)
        
max_wal_senders = 4       # **Максимальное количество одновременных подключений для репликации.**, для поиграть хватит и 4 
```

WAL файлы это место куда postgres пишет данные после чего он их переносит в бд, в случае реплик 
еще настройки:
--- archive_mode = on - Включает архивирование WAL-логов.
--- archive_command = 'cp %p /oracle/pg_data/archive/%f'   - Команда для копирования WAL-файлов в архив.
%p — полный путь к WAL-файлу (например, /var/lib/postgresql/12/main/pg_wal/0000000100000001000000AB).
%f — только имя файла (например, 0000000100000001000000AB).
В данном случае WAL-файлы копируются в /oracle/pg_data/archive/.

---4. wal_keep_segments = 50 Сколько WAL-сегментов хранить в pg_wal для репликации.
PostgreSQL хранит WAL-файлы в каталоге pg_wal (ранее назывался pg_xlog).
Если реплика отстаёт, она может запросить старые WAL-файлы у мастера.
50 означает, что будут храниться последние 50 сегментов (каждый обычно по 16 МБ, итого ~800 МБ).
ℹ️ В новых версиях PostgreSQL (13+) вместо wal_keep_segments используется wal_keep_size (например, wal_keep_size = 1GB).


Поменять сетевые настройки, файл `pg_hba.conf` Эта настройка ставится только в MASTER 
```
host    replication     replicator      172.22.0.0/16             md5
```
для того чтобы указать  ipAdress нужно выполнить команды и посмотреть на каком IP развернулась master реплика его и указать в `pg_hba.conf`
Узнать адрес подсети
```
docker network ls                # список, в моем случае pg-replication_pgnet
docker network inspect pg-replication_pgnet         # нужен Subnet
```

Создание роли replicator
```
docker exec -it pgmaster bash      # переход в контейнер
psql -U postgres                   # подключение к PostgreSQL через CLI-утилиту
CREATE ROLE replicator WITH LOGIN PASSWORD '1111';      # создание роли
ALTER USER replicator WITH REPLICATION;            # выдать права для репликации
\du            # посмотреть все роли
\q             # выход
```

Обычно создавая новую реплику ей подкидывают backup, если слейв начинает репликацию "с нуля" (без предварительного бэкапа), он должен запросить все WAL-записи с самого начала истории базы данных. Это может занять много времени и ресурсов. Бэкап позволяет слейву начать репликацию с текущего состояния мастера, минимизируя задержки. + WAL лог конечный(циклический), соответственно чтобы были все данные без бэкапа не обойтись.
```
pg_basebackup -h pgmaster -D /pgslave -U replicator -v -P --wal-method=stream
```

Для того чтобы узел считал себя репликой, ему нужно подложить файлик `standby.signal` (пустой файл, служит маркером), так же нужно добавить строчку в `postgresql.conf`
```
primary_conninfo = 'host=pgmaster port=5432 user=replicator password=1111 application_name=pgslave'
```
port указывать порт в КОНТЕЙНЕРЕ, не хоста!!!

Перезагрузка конфига не роняя БД, видимо настройки кешируются, перезапуск контейнера не помогал, помогла команда
```sql
SELECT pg_reload_conf();
```

Намучился с синхронизацией, решение снести все в подмонтированной директории
```bash
rm -rf /var/lib/postgresql/data/*
```
и накатить все с мастера
```
pg_basebackup -h pgmaster -D /var/lib/postgresql/data -U replicator -v -P --wal-method=stream
```

Проверка кластера
```
подключение к мастер узлу
docker exec -it pgmaster su postgres -c psql

запрос в системную таблицу
select application_name, sync_state from pg_stat-replication

 application_name | sync_state 
------------------+------------
 pgslaveasync     | async
 pgslave          | async
```

По умолчанию репликация асинхронная, мастер не ждет подтверждения от слейвов, что данные были ими записаны. Для синхронного взаимодействия нужно добавить настройки в мастер:
```
synchronous_commit = on
synchronous_standby_names = 'FIRST 1 (pgslave, pgslaveasync)'

заставить переначитать конфиг мастера
SELECT pg_reload_conf();

 application_name | sync_state 
------------------+------------
 pgslaveasync     | potential
 pgslave          | sync
```
'FIRST 1 (pgslave, pgslaveasync)' - ждем подтверждения от первого узла из списка.

Ну и все. Создаем тестовою таблицу и смотрим как данные реплицируются.

UPD. 
Если шлепнется реплика с которой мастер взаимодействует синхронно, то при инсерте мастер повиснет. Есть таймауты, пока не искал как настроить.

Если мастер шлепнулся, нужно ручками назначить одну из реплик мастером используя хранимую процедуру 
```sql
SELECT pg_promote()
```
и соответственно переписать конфиги оставшихся слейвов чтоб слушали нового мастера. Если старый мастер ожил, можем сделать его слейвом через настройки и не забыть подкинуть маркер файл. Чет как то геморно все, мб можно автоматизировать? кубер?

[[PostgreSQL]], [[Docker]]


Предварительно настроить репликацию на уровне БД, см пример в [[Replication PgSQL]]

Настроить роутинг
```java
public class RoutingDataSource extends AbstractRoutingDataSource {  
  
    private static final ThreadLocal<Route> routeContext = new ThreadLocal<>();  
  
    public enum Route {  
        PRIMARY, REPLICA  
    }  
  
    public static void clearReplicaRoute() {  
        routeContext.remove();  
    }  
  
    public static void setReplicaRoute() {  
        routeContext.set(Route.REPLICA);  
    }  
  
    @Override  
    public Object determineCurrentLookupKey() {  
        return routeContext.get();  
    }  
}
```

Настроить DataSourse
```java
@Configuration  
public class DataSourceConfig {  
  
    private static final String PRIMARY_DATASOURCE_PREFIX = "spring.primary.datasource";  
    private static final String REPLICA_DATASOURCE_PREFIX = "spring.replica.datasource";  
  
    @Autowired  
    private Environment environment;  
  
    @Bean  
    @Primary    public DataSource dataSource() {  
        final RoutingDataSource routingDataSource = new RoutingDataSource();  
  
        final DataSource primaryDataSource = buildDataSource("PrimaryHikariPool", PRIMARY_DATASOURCE_PREFIX);  
        final DataSource replicaDataSource = buildDataSource("ReplicaHikariPool", REPLICA_DATASOURCE_PREFIX);  
  
        final Map<Object, Object> targetDataSources = new HashMap<>();  
        targetDataSources.put(RoutingDataSource.Route.PRIMARY, primaryDataSource);  
        targetDataSources.put(RoutingDataSource.Route.REPLICA, replicaDataSource);  
  
        routingDataSource.setTargetDataSources(targetDataSources);  
        routingDataSource.setDefaultTargetDataSource(primaryDataSource);  
  
        return routingDataSource;  
    }  
  
    private DataSource buildDataSource(String poolName, String dataSourcePrefix) {  
        final HikariConfig hikariConfig = new HikariConfig();  
  
        hikariConfig.setPoolName(poolName);  
        hikariConfig.setJdbcUrl(environment.getProperty(String.format("%s.url", dataSourcePrefix)));  
        hikariConfig.setUsername(environment.getProperty(String.format("%s.username", dataSourcePrefix)));  
        hikariConfig.setPassword(environment.getProperty(String.format("%s.password", dataSourcePrefix)));  
        hikariConfig.setDriverClassName(environment.getProperty(String.format("%s.driver", dataSourcePrefix)));  
  
        return new HikariDataSource(hikariConfig);  
    }  
}
```

Можно работать через 1 репозиторий используя AOP например, настроив так чтобы запросы имеющие @Transactional(readOnly = true) выполнялись в слейв
```java
@Aspect  
@Component  
@Order(0)  
public class ReadOnlyRouteInterceptor {  
  
    private static final Logger logger = LoggerFactory.getLogger(ReadOnlyRouteInterceptor.class);  
  
    @Around("@annotation(transactional)")  
    public Object proceed(ProceedingJoinPoint proceedingJoinPoint, Transactional transactional) throws Throwable {  
        try {  
            if (transactional.readOnly()) {  
                RoutingDataSource.setReplicaRoute();  
                logger.info("Routing database call to the read replica");  
            }  
            return proceedingJoinPoint.proceed();  
        } finally {  
            RoutingDataSource.clearReplicaRoute();  
        }  
    }  
}
```

yml файл
```yml
server:  
  port: 8081  
  
spring:  
  primary:  
    datasource:  
      password: 1111  
      username: postgres  
      driver: org.postgresql.Driver  
      url: jdbc:postgresql://localhost:15432/postgres  
  replica:  
    datasource:  
      password: 1111  
      username: postgres  
      driver: org.postgresql.Driver  
      url: jdbc:postgresql://localhost:15433/postgres  
  
  # Spring Boot 2 + Hibernate Issue: https://hibernate.atlassian.net/browse/HHH-12368  
  jpa:  
    properties:  
      hibernate:  
        temp:  
          use_jdbc_metadata_defaults: false  
        dialect: org.hibernate.dialect.PostgreSQLDialect  
  
  liquibase:  
    enabled: true  
    change-log: classpath:db/changelog/db.changelog-master.xml  
  
logging:  
  level:  
    org.springframework.transaction: DEBUG  
    org.springframework.orm.jpa: DEBUG  
    com.zaxxer.hikari.HikariConfig: DEBUG  
    com.zaxxer.hikari: TRACE  
    org.hibernate.SQL: DEBUG  
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE  
    org.springframework.jdbc.datasource.DataSourceUtils: TRACE
```

По логам можно убедиться что создается два коннекта:

PrimaryHikariPool - Starting...
PrimaryHikariPool - Added connection org.postgresql.jdbc.PgConnection@73e1ecd0
ReplicaHikariPool - Starting...
ReplicaHikariPool - Added connection org.postgresql.jdbc.PgConnection@71166348

В принципе по логу можно относительно понять, что при селекте использовался коннект к слейву по хешу коннекта

Setting JDBC Connection [HikariProxyConnection@117795501 wrapping org.postgresql.jdbc.PgConnection@71166348] read-only

Но захотелось знать наверняка... Идем в postgresql.conf и докидываем проперти:
```ini
# Включаем логирование всех запросов
log_statement = 'all'  # или 'mod' (только INSERT/UPDATE/DELETE)  

# Указываем путь к лог-файлу
log_directory = 'pg_log'  
log_filename = 'postgresql-%Y-%m-%d.log'  

# Логируем имя пользователя и БД
log_line_prefix = '%t [%p] [%d] [%a] [%u] '  

# Логируем время выполнения запросов
log_min_duration_statement = 0  # логируем все запросы, независимо от времени
```

Лезем в контейнер матсра
```bash
docker logs pgmaster --tail 100 -f
```
```log
2025-05-02 16:39:27 UTC [43] [postgres] [[unknown]] [postgres] LOG:  execute <unnamed>: SET application_name = 'PostgreSQL JDBC Driver'
2025-05-02 16:39:27 UTC [43] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.006 ms
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  duration: 0.047 ms  parse <unnamed>: SET extra_float_digits = 2
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  duration: 0.006 ms  bind <unnamed>: SET extra_float_digits = 2
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  execute <unnamed>: SET extra_float_digits = 2
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  duration: 0.008 ms
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  duration: 0.006 ms  parse <unnamed>: SET application_name = 'PostgreSQL JDBC Driver'
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  duration: 0.001 ms  bind <unnamed>: SET application_name = 'PostgreSQL JDBC Driver'
2025-05-02 16:39:27 UTC [44] [postgres] [[unknown]] [postgres] LOG:  execute <unnamed>: SET application_name = 'PostgreSQL JDBC Driver'
2025-05-02 16:39:27 UTC [44] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.004 ms
```

Лезем в слейв
```log
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  execute <unnamed>: BEGIN READ ONLY
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.009 ms
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 6.787 ms  parse <unnamed>: select ca1_0.client_account_id,ca1_0.account_balance,ca1_0.account_number,ca1_0.account_state,ca1_0.client_info_id from client_
account ca1_0 where ca1_0.client_account_id=$1
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 4.123 ms  bind <unnamed>: select ca1_0.client_account_id,ca1_0.account_balance,ca1_0.account_number,ca1_0.account_state,ca1_0.client_info_id from client_a
ccount ca1_0 where ca1_0.client_account_id=$1
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] DETAIL:  Parameters: $1 = '1901'
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  execute <unnamed>: select ca1_0.client_account_id,ca1_0.account_balance,ca1_0.account_number,ca1_0.account_state,ca1_0.client_info_id from client_account ca1_0 wher
e ca1_0.client_account_id=$1
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] DETAIL:  Parameters: $1 = '1901'
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.200 ms
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.020 ms  parse S_1: COMMIT
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.017 ms  bind S_1: COMMIT
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  execute S_1: COMMIT
2025-05-02 16:39:39 UTC [33] [postgres] [PostgreSQL JDBC Driver] [postgres] LOG:  duration: 0.014 ms
```

[[Java]], [[Replication]], [[Docker]], [[PostgreSQL]]