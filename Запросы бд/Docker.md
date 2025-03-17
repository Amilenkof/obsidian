1. Postgres + pgadmin
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

/*****************************************************************************************************************