1. **Postgres + pgadmin**
   version: "3.9"  
services:  
  postgres:  
    container_name: postgres_container  
    image: postgres:13.3  
    environment:  
      POSTGRES_DB: "edudb"  
      POSTGRES_USER: "admin"  
      POSTGRES_PASSWORD: "admin"  
      PGDATA: "/var/lib/postgresql/data/pgdata"  
    volumes:  
      - ./postgres-data:/var/lib/postgresql/data  
    ports:  
      - "5437:5432"  
    networks:  
      - postgres  
    healthcheck:  
      test: ["CMD-SHELL", "pg_isready -U admin -d edudb"]  
      interval: 5s  
      timeout: 5s  
      retries: 5  
  
  pgadmin:  
    container_name: pgadmin_container  
    image: dpage/pgadmin4:latest  
    environment:  
      PGADMIN_DEFAULT_EMAIL: "edudb@diasoft.com"  
      PGADMIN_DEFAULT_PASSWORD: "admin"  
      PGADMIN_CONFIG_SERVER_MODE: "False"  
    volumes:  
      - ./pgadmin-data:/var/lib/pgadmin  
    ports:  
      - "5050:80"  
    restart: unless-stopped  
    depends_on:  
      postgres:  
        condition: service_healthy  
    networks:  
      - postgres  
  
networks:  
  postgres:  
    driver: bridge
    
![[Pasted image 20250317160709.png]]
пароль admin

/****************************************************************************************************************************************************************************
2. **MSSQL** 
   version: "3.9"  
services:  
  mssql:  
    container_name: mssql_container  
    image: mcr.microsoft.com/mssql/server:2022-latest  
    environment:  
      SA_PASSWORD: "YourStrong!Passw0rd"  # Пароль для пользователя SA  
      ACCEPT_EULA: "Y"                    # Принятие лицензионного соглашения  
      MSSQL_PID: "Express"                 # Версия SQL Server (Express, Developer, Enterprise)  
    ports:  
      - "1433:1433"                        # Порт для подключения  
    volumes:  
      - mssql-data:/var/opt/mssql         # Том для хранения данных  
    networks:  
      - mssql-network  
  
volumes:  
  mssql-data:  
    driver: local  
  
networks:  
  mssql-network:  
    driver: bridge
    
    
![[Pasted image 20250317160951.png]]
- Хост: `localhost`
    
- Порт: `1433`
    
- Пользователь: `SA`
    
- Пароль: `YourStrong!Passw0rd`



2. **ORACLE** 
   version: "3.9"
services:
  oracle:
    container_name: oracle_container
    image: gvenzl/oracle-xe:latest  # Образ Oracle Express Edition
    environment:
      ORACLE_PASSWORD: "oracle"     # Пароль для пользователя SYS и SYSTEM
      APP_USER: "testuser"           # Дополнительный пользователь (опционально)
      APP_USER_PASSWORD: "testpass"  # Пароль для дополнительного пользователя (опционально)
    ports:
      - "1521:1521"                 # Порт для подключения
    volumes:
      - oracle-data:/opt/oracle/oradata  # Том для хранения данных
    networks:
      - oracle-network

volumes:
  oracle-data:
    driver: local

networks:
  oracle-network:
    driver: bridge
    ![[Pasted image 20250317161852.png]]
    - Хост: `localhost`
    
- Порт: `1521`
    
- Служба: `XE`
    
- Пользователь: SYSTEM
    
- Пароль: `oracle`

**4 KAFKA+ZOOKEEPER+KOWL**

version: '2'  
services:  
  zookeeper:  
    image: confluentinc/cp-zookeeper:latest  
    environment:  
      ZOOKEEPER_CLIENT_PORT: 2181  
      ZOOKEEPER_TICK_TIME: 2000  
    ports:  
      - "22181:2181"  
    networks:  
      - kafka-network  
  
  kafka:  
    image: confluentinc/cp-kafka:latest  
    depends_on:  
      - zookeeper  
    ports:  
      - "29092:29092"  
    environment:  
      KAFKA_BROKER_ID: 1  
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181  
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,PLAINTEXT_HOST://localhost:29092  
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT  
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT  
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1  
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"  
    networks:  
      - kafka-network  
  
  kowl:  
    image: quay.io/cloudhut/kowl:latest  # Используем официальный образ Kowl  
    restart: on-failure  
    hostname: kowl  
    volumes:  
      - ./config.yaml:/etc/kowl/config.yaml  
    ports:  
      - "8080:8080"  
    entrypoint: ["./kowl", "--config.filepath=/etc/kowl/config.yaml"]  
    depends_on:  
      - kafka  
    networks:  
      - kafka-network  
  
networks:  
  kafka-network:  
    driver: bridge


сделать файл ![[config 1.yaml]] там же где файл докер компоус
![[Pasted image 20250317173259.png]]
 
kafka:  
  brokers:  
    - kafka:9092  # Подключение к Kafka внутри сети Docker  
  schemaRegistry:  
    enabled: false  # Отключение интеграции с Schema Registry