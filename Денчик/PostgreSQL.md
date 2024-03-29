
[[Денчик/DataBase]]

Настройки подключения для Maven

~~~Java
<dependency>  
  <groupId>org.postgresql</groupId>  
  <artifactId>postgresql</artifactId>  
  <scope>runtime</scope>  
</dependency>
~~~

~~~java
#Connection parameters  
spring.datasource.url=jdbc:postgresql://localhost:5432/diplom  
spring.datasource.username=work  
spring.datasource.password=work  
  
spring.jpa.hibernate.ddl-auto=validate
~~~

