# @Transactional в Spring под капотом

16 мин

186K

[Java*](https://habr.com/ru/hubs/java/)

В этой статье рассматривается как работает аннотация `@Transactional` в Spring под капотом. При этом в основном рассматривается _НЕ_ реактивный стек. Статья рассматривает код Spring 5.3 и Spring Boot 2.4

## Оглавление

- [Где лежит](https://habr.com/ru/articles/532000/#locate) `@Transactional` [и как его добавить в проект?](https://habr.com/ru/articles/532000/#locate)
    
- [Кто создает инфраструктуру для обработки](https://habr.com/ru/articles/532000/#infra) `@Transactional`[?](https://habr.com/ru/articles/532000/#infra)
    
- [Кто обрабатывает](https://habr.com/ru/articles/532000/#worker) `@Transactional`[?](https://habr.com/ru/articles/532000/#worker)
    
- [Кратко о том как работает proxy или самый популярный вопрос на собеседовании](https://habr.com/ru/articles/532000/#sobes)
    
- [Как обрабатывается](https://habr.com/ru/articles/532000/#run) `@Transactional`[?](https://habr.com/ru/articles/532000/#run)
    
- `TransactionalManager` [- что это такое?](https://habr.com/ru/articles/532000/#manager)
    
- [Как выводить логи транзакций?](https://habr.com/ru/articles/532000/#logs)
    
- [Императивная работа с транзакциями (через TransactionTemplate)](https://habr.com/ru/articles/532000/#template)
    
- [Обработка ошибок в HibernateTransactionManager](https://habr.com/ru/articles/532000/#hiber)
    
- [Список источников](https://habr.com/ru/articles/532000/#reference)
    

## Где лежит @Transactional и как его добавить в проект?

Аннотация `@Transactional` находится в пакете `org.springframework.transaction.annotation`, т.е. ее полное имя `org.springframework.transaction.annotation.Transactional` и является частью Spring Framework с версии 1.2. Не путайте с `javax.transaction.Transactional`_._ Собственная аннотация Spring предоставляет более расширенные возможности настройки, которые рассматриваются дальше. Аннотацию `javax.transaction.Transactional` Spring также поддерживает, но лучше их не смешивать и, если создаете приложение на Spring, использовать родные аннотации.

Для того, чтобы добавить в проект пакет, требуется прописать зависимость:

- для maven
    

```
<dependency> <groupId>org.springframework</groupId> <artifactId>spring-tx</artifactId></dependency>
```

- для gradle
    

```
compile group: 'org.springframework', name: 'spring-tx', version: '5.3.2'
```

Но с приходом Spring Boot так делать уже не требуется - этот пакет добавлен во все требуемые starter-ы как транзитивная зависимость и, когда вы добавляете, например, _spring-boot-starter-data-jpa_, то _spring-tx_ подтягивается автоматически через _spring-data-jpa_

## Кто создает инфраструктуру для обработки @Transactional?

В те темные времена, когда еще не было Spring Boot, чтобы включить поддержку `@Transactional` мы добавляли над конфигурацией аннотацию `@EnableTransactionManager`, которая является также частью пакета `org.springframework.transaction.annotation`.

Эта аннотация имеет следующие настройки:

- `proxyTargetClass`(по умолчанию, false) - будет ли прокси создаваться через CGLIB (true) или через interface-based proxies (false). Обратите внимание, что, если поставить true, _ВСЕ_ объекты Spring (beans) будут создаваться через CGLIB, не только те, что помечены `@Transactional`
    
- `mode` (по умолчанию `AdviceMode.PROXY`) - как будут применены Advise. Возможные варианты - `AdviceMode.PROXY` или `AdviceMode.ASPECTJ`. Если выбрать AspectJ и корректно его настроить, то при компиляции будет сгенерирован код так, что тело метода будет уже обернуто кодом, управляющим транзакцией. Если выбран `AdviceMode.PROXY` , то будет использован стандартный механизм создания proxy объектов. (пример с [AspectJ](http://sevenlist.github.io/2014/08/24/spring-at-transactional-with-aspectj/))
    
- `order` - указывает, когда будет применен advice. По умолчанию, LOWEST_PRECEDENCE - т.е. он будет вызван последним в цепочке advice. Это может быть важно, когда вы добавляете собственные advice, в которых есть работа с базой данных
    

Что же эта аннотация делает? Посмотрим на нее:

```
@Target(ElementType.TYPE)@Retention(RetentionPolicy.RUNTIME)@Documented@Import(TransactionManagementConfigurationSelector.class)public @interface EnableTransactionManagement {...}
```

Она содержит селектор `TransactionManagementConfigurationSelector`, работа которого будет рассмотрена дальше.

С приходом Spring Boot необходимость в аннотации`@EnableTransactionManager` отпала. Теперь это перешло в ответственность Spring Boot. Как же он это делает?

Когда вы добавляете в проект зависимость _spring-boot-starter-что-то,_ то подтягивается транзитивная зависимость - _spring-boot-autoconfigure_, который содержит в файле _spring.factories_ список авто-конфигураций. Как это работает - можно посмотреть [SpingBoot-потрошитель от Борисова](https://www.youtube.com/watch?v=yy43NOreJG4). В этом файле есть упоминание конфигурации

```
org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration
```

которая будет загружена при подъеме контекста. Полный текст для удобства приведен ниже.

TransactionAutoConfiguration

```

```

Как работают авто-конфигурации хорошо объяснено в "SpringBoot-потрошитель", здесь упомяну только наиболее интересные моменты.

Данная авто-конфигурация будет работать только, если в _classpath_ есть класс `PlatformTransactionManager`, о работе которого будет написано дальше. Здесь же создается TransactionalOperator, используемый в реактивном стеке.

Наиболее важной частью является статический класс `EnableTransactionManagementConfiguration`

Он содержит два подкласса, отличаются они только настройкой

```
spring.aop.proxy-target-class
```

Если `spring.aop.proxy-target-class = true`, то применяется аннотация `@EnableTransactionManagement(proxyTargetClass = true)`

Если `spring.aop.proxy-target-class = false`, то применяется аннотация `EnableTransactionManagement(proxyTargetClass = false)`

Обратите внимание, что по умолчанию для всех современных spring-boot проектов

```
spring.aop.proxy-target-class=true
```

Поэтому будет использован механизм CGLIB для создания proxy. (Советую посмотреть [интервью](https://www.youtube.com/watch?v=wpEPvAqnhZI&t=2156s), где Борисов рассказывает про это изменение поведения Spring Boot).

## Кто обрабатывает @Transactional?

В этой части рассмотрим, какая инфраструктура создается для обработки .

В прошлой части мы закончили на

```
@Import(TransactionManagementConfigurationSelector.class)
```

Посмотрим, что происходит дальше.

Здесь используется аннотация `@Import.` Она обычно используется для обработки следующих трех типов компонентов (component): `@Configuration`, `ImportSelector`, `ImportBeanDefinitionRegistrar`.

`TransactionManagementConfigurationSelector` , который здесь загружается, принадлежит к `ImportSelector`. При загрузке контекста он, основываясь на настройках `EnableTransactionManagement`, определяет какие классы будут подгружаться дальше. Ниже приведен часть кода `TransactionManagementConfigurationSelector`TransactionManagementConfigurationSelector.

```
public class TransactionManagementConfigurationSelector    extends AdviceModeImportSelector<EnableTransactionManagement> {  @Override  protected String[] selectImports(AdviceMode adviceMode) {    switch (adviceMode) {      case PROXY:        return new String[]{AutoProxyRegistrar.class.getName(),            ProxyTransactionManagementConfiguration.class.getName()};      case ASPECTJ:        return new String[]{determineTransactionAspectClass()};      default:        return null;    }  }.....
```

Здесь используются следующие классы для конфигураций:

`AutoProxyRegistrar` - класс для регистрации средств создания бинов, `ProxyTransactionManagementConfiguration` - класс для настройки `ProxyTransactionManagement`.

Посмотрим, что внутри `ProxyTransactionManagementConfiguration`. (Для удобство код приведен ниже. Хотя форматирование его сильно побило)

ProxyTransactionManagementConfiguration

```

```

Первым создается _bean_ _transactionAttributeSource_ из класса `AnnotationTransactionAttributeSource`. Он реализует интерфейс `TransactionAttributeSource.`

```
public interface TransactionAttributeSource {  default boolean isCandidateClass(Class<?> targetClass) {    return true;  }  @Nullable  TransactionAttribute getTransactionAttribute(Method method,                                               @Nullable Class<?> targetClass);}
```

Этот _bean_ применяется для проверки: используется ли где-то `@Transactional` и для получения метаданных (например, _propagation_) для аннотированных методов или классов.

Дальше создается `TransactionInterceptor`, внутри которого и будет происходить магия транзакции, которая рассматривается дальше.

И наконец `BeanFactoryTransactionAttributeSourceAdvisor`, внутри которого помещается `TransactionInterceptor`.

`BeanFactoryTransactionAttributeSourceAdvisor` - это обычный _PointcutAdvisor_ (который объединил в одну сущность _advisor_ and _pointcut_. Пример использования можно посмотреть [здесь](https://programmersought.com/article/5633162993/) или [здесь](https://mkyong.com/spring/spring-aop-example-pointcut-advisor/), или в видео ["Spring patterns для взрослых"](https://www.youtube.com/watch?v=GL1txFxswHA).

Если вкратце описать принцип их действия, то _pointcut_ определяет, какие классы и методы в них будут проксированы, а _advice_ - какой код будет выполняться.

В нашем случае в конце концов в качестве _pointcut_ будет использован `TransactionAttributeSource`, а в качестве _advice_ - `TransactionInterceptor`.

Возникает вопрос - а где всеми любимый `BeanPostProcessor`, про которые нам так часто все говорили?

Здесь на себя всю работу берет `InfrastructureAdvisorAutoProxyCreator`, который как раз и является `BeanPostProcessor`.

![Иерархия наследования для класса InfrastructureAdvisorAutoProxyCreator](https://habrastorage.org/getpro/habr/upload_files/15c/4d3/2a1/15c4d32a1834c01207d3922aaef45059 "Иерархия наследования для класса InfrastructureAdvisorAutoProxyCreator")

Иерархия наследования для класса InfrastructureAdvisorAutoProxyCreator

Обработка `@Transactional` выполняется по обычным правилам Spring и никакой особой магии здесь нет. Примерная схема работы ([взята из официальной документации](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.htm))

![Примерная схема работы @Transactional](https://habrastorage.org/r/w1560/getpro/habr/upload_files/425/9d6/2fd/4259d62fd795448e9df21f525f52b4e6.png "Примерная схема работы @Transactional")

Примерная схема работы @Transactional

## Кратко о том как работает proxy или самый популярный вопрос на собеседовании

Во многих фирмах, где проходил собеседование задавали следующий вопрос:

Дан сервис

```
@Servicepublic class ServiceTest{  @Transactional  public void test1{      test2();  }  @Transactional(propagation = Propagation.REQUIRES_NEW)  public void test2(){  }}
```

Будет ли при вызове test2 из метода test1 создана новая транзакция?

Самый грамотный и полный ответ, который я встречал, был уже приведен в [этой статье на habr](https://habr.com/ru/post/347752/). В этой же статье рассмотрим только классический и самый простой случай для лучшего понимания, что происходит дальше.

Под капотом наш bean будет иметь _примерно_ следующий вид

```
public class Proxy{	private ServiceTest targetService;    public void test1{    //код начала транзакции    // ...      targetService.test1();    //код конца транзакции    // ...  }  public void test2(){    //код начала транзакции    // ...      targetService.test2();    //код конца транзакции    // ...  }}
```

Это прекрасно иллюстрирует этот рисунок

![взято с https://www.javainuse.com/spring/spring-boot-aop](https://habrastorage.org/r/w1560/getpro/habr/upload_files/efd/b60/ff7/efdb60ff7dadeefd51d9293e42bbc7d4.jpg "взято с https://www.javainuse.com/spring/spring-boot-aop")

взято с https://www.javainuse.com/spring/spring-boot-aop

И отсюда следует, что при вызове метода test1 код, управляющий транзакциями, вызван не будет и новая транзакция не откроется. Аналогичное поведение - когда вызывается метод родительского класса (реальный случай в одном из проектов).

## Как обрабатываются @Transactional

Прежде чем перейти к рассмотрению порядка обработки, давайте посмотрим, какие настройки предоставляет нам эта аннотация. Здесь рассмотрена только часть из них. Остальные можно посмотреть в [этой статье на habr](https://habr.com/ru/company/otus/blog/431508/) или в [документации](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)

Наиболее интересные настройка @Transactional

Перед тем как перейти к `TransactionInterceptor`, давайте вспомним, как мы работали с транзакциями до Spring.

Код взят из [статьи](https://www.baeldung.com/java-transactions)

```
Connection connection = DriverManager.getConnection(...);try {  connection.setAutoCommit(false);  PreparedStatement firstStatement = connection.prepareStatement(...);  firstStatement.executeUpdate();  PreparedStatement secondStatement = connection.prepareStatement(...);  secondStatement.executeUpdate();  connection.commit();} catch (Exception e) {  connection.rollback();}
```

Порядок работы такой:

- создаем соединение - DriverManager.getConnection(...)
    
- выполняем необходимые запросы
    
- если не было ошибок - выполняем commit (connection.commit())
    
- Если все-таки была ошибка - откатываем изменения
    

Вернемся к `TransactionInterceptor`. Основным методом является - `invoke`, который делегирует работу родительскому методу `invokeWithinTransaction` класса `TransactionalAspectSupport`

Сокращенный код приведен ниже

```
protected Object invokeWithinTransaction(Method method,                                         Class<?> targetClass,                                         final InvocationCallback invocation)  // получаем TransactionManager tm и TransactionAttribute txAttr  // ...  if (this.reactiveAdapterRegistry != null &&      tm instanceof ReactiveTransactionManager) {    //код для работы с реактивным стэком    // ...  }PlatformTransactionManager ptm = asPlatformTransactionManager(tm);final String joinpointIdentification =  methodIdentification(method, targetClass, txAttr);if (txAttr == null ||    !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {  // начинаем транзакцию, если нужно  TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr,                                                        joinpointIdentification);  Object retVal;  try {    // выполняем работу внутри транзакции    retVal = invocation.proceedWithInvocation();  } catch (Throwable ex) {    // откатываемся, если нужно    completeTransactionAfterThrowing(txInfo, ex);    throw ex;  } finally {    // чистим ThreadLocal переменные    cleanupTransactionInfo(txInfo);  }  if (retVal != null && vavrPresent && VavrDelegate.isVavrTry(retVal)) {    //код для библиотеки vavr    // ...  }  // выполняем commit, если не было ошибок  commitTransactionAfterReturning(txInfo);  return retVal;} else {  // код для WebSphere  // ...}}
```

Если посмотреть внимательно, то этот код повторяет предыдущую логику. Ничего нового:

- получаем соединение/транзакцию - createTransactionIfNecessary
    
- выполняем необходимые запросы - invocation.proceedWithInvocation
    
- если не было ошибок - выполняем commitTransactionAfterReturning
    
- Если все-таки была ошибка - откатываем изменения - completeTransactionAfterThrowing
    

Рассмотрим внимательно каждую часть.

_Получение транзакции_

```
protected TransactionInfo createTransactionIfNecessary  (PlatformTransactionManager tm, TransactionAttribute txAttr,   final String joinpointIdentification) {  if (txAttr != null && txAttr.getName() == null) {    txAttr = new DelegatingTransactionAttribute(txAttr) {      @Override      public String getName() {        return joinpointIdentification;      }    };  }  TransactionStatus status = null;  if (txAttr != null) {    if (tm != null) {      status = tm.getTransaction(txAttr);    }  }  return prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);}
```

Из важных частей здесь можно отметить только вызов `transactionalManager.getTransaction(...)`(работа с `TransactionalManager` будет описана позже) и вызов `prepareTransactionInfo` , в котором выполняется `txInfo.bindToThread()`; этот метод устанавливает `TransactionInfo` в `ThreadLocal` переменную `transactionInfoHolder`_,_ из которой теперь всегда можно получить статус транзакции через статический метод `currentTransactionStatus`

_Управление откатом изменений_

```
protected void completeTransactionAfterThrowing(@Nullable TransactionInfo txInfo, Throwable ex) {  if (txInfo != null && txInfo.getTransactionStatus() != null) {    if (txInfo.transactionAttribute != null &&         txInfo.transactionAttribute.rollbackOn(ex)) {      try {        txInfo.getTransactionManager()          .rollback(txInfo.getTransactionStatus());      } catch (Exception ex) {        // ...      }    } else {      try {        txInfo.getTransactionManager()          .commit(txInfo.getTransactionStatus());      } catch (Exception ex) {        // ...      }    }  }}
```

Если транзакция активна, то проверяем, надо ли ее откатывать при этой ошибке, если не надо, то выполняем фиксацию транзакции `commit(txInfo.getTransactionStatus())` Проверка исключений выполняется в `txInfo.transactionAttribute.rollbackOn(ex)` . Выигрывает наиболее близкое по иерархии исключений требование.

_Фиксация транзакции_

```
protected void commitTransactionAfterReturning(TransactionInfo txInfo) {  if (txInfo != null &&       txInfo.getTransactionStatus() != null) {    txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());  }}
```

Просто выполняется фиксация, если транзакция активна.

## TransactionManager - что это такое?

На данный момент `TransactionManager`, маркировочный интерфейс, не содержащий никаких методов. Его наследуют `ReactiveTransactionManager` и `PlatformTransactionManager`

Рассмотрим внимательней последний.

```
public interface PlatformTransactionManager extends TransactionManager {  TransactionStatus getTransaction(TransactionDefinition definition)    throws TransactionException;  void commit(TransactionStatus status) throws TransactionException;  void rollback(TransactionStatus status) throws TransactionException;}
```

Интерфейс содержит всего 3 метода - создание транзакции, commit и rollback.

Spring предоставляет абстрактный класс `AbstractPlatformTransactionManager`, который реализовывает требования по `propagation`. Наследники этого класса по разному реализуют его абстрактные методы, так как это довольно сильно зависит от используемой технологии.

Стоит отметить, что в своей работе `AbstractPlatformTransactionManager` и его подклассы активно используют org.`springframework.transaction.support.TransactionSynchronizationManage` для синхронизации и хранения метаинформации, включая _connection_. Хранение информации осуществляется в наборе статических _ThreadLocal_ переменных.

```
private static final ThreadLocal<Map<Object, Object>> resources =  new NamedThreadLocal<>("Transactional resources");private static final ThreadLocal<Set<TransactionSynchronization>> synchronizations =  new NamedThreadLocal<>("Transaction synchronizations");private static final ThreadLocal<String> currentTransactionName =  new NamedThreadLocal<>("Current transaction name");private static final ThreadLocal<Boolean> currentTransactionReadOnly =  new NamedThreadLocal<>("Current transaction read-only status");private static final ThreadLocal<Integer> currentTransactionIsolationLevel =  new NamedThreadLocal<>("Current transaction isolation level");private static final ThreadLocal<Boolean> actualTransactionActive =  new NamedThreadLocal<>("Actual transaction active");
```

## Как выводить логи транзакций?

Spring выполняет логирование практически всех действий с транзакциями: для этого надо включить уровень логирования DEBUG для пакета `org.springframework.transaction` , и если используете hibernate, - `org.hibernate.transaction`

```
logging:
   level:
      org.springframework.orm.jpa: DEBUG
      org.springframework.transaction: DEBUG
```

Также можно узнать, что происходит с транзакциями программно, обращаясь к ThreadLocal переменным, которые мы рассмотрели, например,

```
TransactionSynchronizationManager.isActualTransactionActive();TransactionAspectSupport.currentTransactionStatus();
```

## Императивная работа с транзакциями (через TransactionTemplate)

Кроме управления транзакциями через аннотации, Spring предоставляет возможность императивного управления транзакциями. Для этого Spring, как и во многих других случаях, использует шаблон "Template" (JdbcTemplate, RestTemplate). Используется класс `TransactionTemplate`. Bean продекларирован в `TransactionAutoConfiguration`. Основным методом является метод execute

```
public <T> T execute(TransactionCallback<T> action) throws TransactionException {  if (this.transactionManager instanceof CallbackPreferringPlatformTransactionManager) {    return ((CallbackPreferringPlatformTransactionManager) this.transactionManager).execute(this, action);  } else {    TransactionStatus status = this.transactionManager.getTransaction(this);    T result;    try {      result = action.doInTransaction(status);    } catch (RuntimeException | Error ex) {      rollbackOnException(status, ex);      throw ex;    } catch (Throwable ex) {      rollbackOnException(status, ex);      throw new UndeclaredThrowableException(ex, "TransactionCallback threw undeclared checked exception");    }    this.transactionManager.commit(status);    return result;  }}
```

который повторяет стандартный механизм rollback/commit:

- получаем транзакцию (getTransaction)
    
- выполняем действие (doInTransaction)
    
- если была ошибка, откатываемся (rollbackOnException)
    
- если все хорошо, то фиксируем транзакцию (commit)
    

Интересна строчка начала транзакции

```
this.transactionManager.getTransaction(this);
```

Так как `transactionManager` является одновременно и `TransactionDefinition` (который мы настраиваем перед вызовом execute), то он передает самого себя в `transactionManager`, поэтому для транзакции используются те параметры, которые были переданы в `transactionManager`.

Так же можно заметить, что в метод выполнения передается `TrsansactionStatus`, поэтому во время выполнения вы можете вручную указать, когда нужно откатывать, не пробрасывая исключение

```
transactionTemplate.execute(new TransactionCallbackWithoutResult() {  protected void doInTransactionWithoutResult(TransactionStatus status) {    try {      updateOperation1();      updateOperation2();    } catch (SomeBusinessExeption ex) {      status.setRollbackOnly();    }  }});
```

## Обработка ошибок в HibernateTransactionManager

При работе с hibernate, даже если вы поймали ошибку и обработали ее, вы не сможете уже зафиксировать транзакцию, так как она будет помечаться как rollbackOnly (в отличие от работы с JdbcTemplate, например). Как это работает и почему?

Начнем с почему? - При работе с JPA вы не управляете последовательностью выполнения запросов и поэтому, если у вас произошла ошибка, hibernate не может восстановить правильный контекст и единственное, что ему остается, - пометить транзакцию как rollbackOnly

Как это работает? Если hibernate ловит ошибку, внутри себя он вызывает

```
TransactionDriverControl().markRollbackOnly()
```

который ставит флаг - `rollbackOnly = true`, даже если вы поймали эту ошибку и обработали. По логике Spring, если нет исключения, то вызывается `PlatformTransactionManager.commit`

При вызове `PlatformTransactionManager.commit` получаем статус транзакции, который внутри хранит флаг:

```
unexpectedRollback = status.isGlobalRollbackOnly(); //truedoCommit(status); //вызывается все равноif (unexpectedRollback) { //кидаем исключение  throw new UnexpectedRollbackException(    "Transaction silently rolled back because it has been marked as rollback-only");}
```

doCommit все равно вызывается и мы могли бы ожидать, что хоть что-то зафиксируется, но hibernate не имеет теперь консистентных данных, поэтому внутри hibernate есть такой код

```
@Overridepublic void commit() {  try {    //хоть метод и называется commit, но включает в себя логику отката    if ( rollbackOnly ) {       try {        rollback();        //...        return;      }      catch (RollbackException e) {        throw e;      }      catch (RuntimeException e) {        throw e;      }    }    JdbcResourceLocalTransactionCoordinatorImpl.this.beforeCompletionCallback();    jdbcResourceTransaction.commit();    // ...
```

То есть ответственность за откат здесь переходит на сторону Hibernate, а не Spring, хотя Spring и не вызывает PlatformTransactionManager.rollback

## Использованные материалы

[Раскрытие секретов о Spring Boot от Борисова](https://www.youtube.com/watch?v=wpEPvAqnhZI&t=2156s)

[Пример работы c AspectJ](http://sevenlist.github.io/2014/08/24/spring-at-transactional-with-aspectj/)

[SpringBoot-потрошитель](https://www.youtube.com/watch?v=yy43NOreJG4)

[Spring reference](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#spring-data-tier)

[Пример использования Pointcut](https://programmersought.com/article/5633162993/)

[Еще один пример использования Pointcut](https://mkyong.com/spring/spring-aop-example-pointcut-advisor/)

[Spring patterns для взрослых](https://www.youtube.com/watch?v=GL1txFxswHA)

[Spring AOP. Маленький вопросик с собеседования](https://habr.com/ru/post/347752/)

[Эффективное управление транзакциями в Spring](https://habr.com/ru/company/otus/blog/431508/)

[Справка по @Transactional](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)

[Introducation to Transactional in Java and Spring](https://www.baeldung.com/java-transactions)

Теги: 

- [Java](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5BJava%5D)
- [spring](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Bspring%5D)
- [transactions](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Btransactions%5D)

Хабы: 

- [Java](https://habr.com/ru/hubs/java/)