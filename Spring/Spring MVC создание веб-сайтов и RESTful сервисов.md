# Spring MVC: создание веб-сайтов и RESTful сервисов

34 мин

129K

[Java*](https://habr.com/ru/hubs/java/)

Перевод

[Автор оригинала: Marco Behler](http://undefined/)

Вы можете использовать эту статью, чтобы понять, как использовать Spring MVC для создания веб-сайтов или RESTful сервисов. А также получить обзор часто задаваемых вопросов, охватывающих наиболее распространенные задачи Spring MVC.

  

Примечание: Статья ~ 7500 слов, вероятно, не стоит читать ее на мобильном устройстве. Добавьте ее в закладки и вернитесь позже.

  

## Содержание

  

- [Введение](https://habr.com/ru/articles/500572/#t1)
- [HttpServlets 101](https://habr.com/ru/articles/500572/#t2)
- [DispatcherServlet](https://habr.com/ru/articles/500572/#t3)
- [Контроллеры — создание HTML](https://habr.com/ru/articles/500572/#t4)
- [REST контроллеры — создание XML / JSON](https://habr.com/ru/articles/500572/#t5)
- [Часто задаваемые вопросы](https://habr.com/ru/articles/500572/#t6)
- [Заключение](https://habr.com/ru/articles/500572/#t7)
- [Благодарности](https://habr.com/ru/articles/500572/#t8)

  

## Введение

  

### Что такое Spring MVC?

  

Spring MVC — это веб-фреймворк Spring. Он позволяет создавать веб-сайты или RESTful сервисы (например, JSON/XML) и хорошо интегрируется в экосистему Spring, например, он поддерживает контроллеры и REST контроллеры в ваших Spring Boot приложениях.

  

Это не очень помогло, не так ли?

  

**К счастью, есть и более длинный ответ**: остальная часть этого документа.

  

(Если вы не уверены, что знаете что такое Spring или Spring Boot, вы можете сначала прочитать, [Что такое Spring Framework?](https://habr.com/ru/post/490586/))

  

## HttpServlets 101

  

При написании веб-приложений на Java с использованием Spring или без него (MVC/Boot) вы в основном имеете в виду написание приложений, которые возвращают два разных формата данных:

  

1. **HTML** → Ваше веб-приложение создает HTML-страницы, которые можно просматривать в браузере.
2. **JSON/XML** → Ваше веб-приложение предоставляет сервисы RESTful, которые генерируют JSON или XML. Сайты с большим количеством Javascript или даже другие веб-сервисы могут затем использовать данные, которые предоставляют эти сервисы.
3. Да, есть и другие форматы данных и варианты использования, но пока мы их игнорируем.

  

Как бы вы написали такие приложения **без** каких-либо фреймворков? Только на простой Java?

  

На самом низком уровне каждое веб-приложение Java состоит из одного или нескольких **HttpServlets**. Они генерируют ваш HTML, JSON или XML. Фактически, каждый отдельный фреймворк из 1 миллиона доступных веб-фреймворков на Java (Spring MVC, Wicket, Struts) построена на основе HttpServlets.

  

(Примечание для придир: это может быть сделано без HttpServlets, но мы пока проигнорируем это.)

  

### Создание HTML-страниц с помощью HttpServlets

  

Давайте посмотрим на супер простой HttpServlet, который возвращает очень простую статическую HTML-страницу.

  

```
package com.marcobehler.springmvcarticle;import javax.servlet.http.HttpServlet;import javax.servlet.http.HttpServletRequest;import javax.servlet.http.HttpServletResponse;import java.io.IOException;public class MyServletV1 extends HttpServlet {    @Override    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {        if (req.getRequestURI().equals("/")) {            resp.setContentType("text/html");            resp.getWriter().print("<html><head></head><body><h1>Welcome!</h1><p>This is a very cool page!</p></body></html>");        }        else {            throw new IllegalStateException("Help, I don't know what to do with this url");        }    }}
```

  

Давайте разберемся с этим кодом.

  

```
public class MyServletV1 extends HttpServlet {
```

  

Ваш сервлет расширяет класс Java HttpServlet.

  

```
@Overrideprotected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
```

  

Чтобы обработать (любой) запрос GET, вам необходимо переопределить метод doGet () из суперкласса. Для запросов POST вы должны переопределить doPost (). Аналогично для всех других HTTP методов.

  

```
if (req.getRequestURI().equals("/")) {
```

  

Ваш сервлет должен убедиться, что входящий URL-адрес является запросом, который он знает как обрабатывать. Пока сервлет обрабатывает только «/», то есть он обрабатывает www.marcobehler.com, но НЕ www.marcobehler.com/hello.

  

```
resp.setContentType("text/html");
```

  

Вам нужно установить правильный тип контента в ServletResponse, чтобы браузер знал, какой контент вы отправляете. В данном случае это HTML.

  

```
resp.getWriter().print("<html><head></head><body><h1>Welcome!</h1><p>This is a very cool page!</p></body></html>");
```

  

Помните: веб-сайты — это просто строки HTML! Поэтому вам нужно сгенерировать HTML-строку любым удобным вам способом и отправить ее обратно с помощью ServletResponse. Один из способов сделать это с помощью response writer.

  

После написания вашего сервлета вы должны зарегистрировать его в контейнере сервлетов, таком как Tomcat или Jetty. Если вы используете встроенную версию любого контейнера сервлета, весь код, необходимый для запуска вашего сервлета, будет выглядеть следующим образом:

  

```
package com.marcobehler.springmvcarticle;import org.apache.catalina.Context;import org.apache.catalina.LifecycleException;import org.apache.catalina.Wrapper;import org.apache.catalina.startup.Tomcat;public class TomcatApplicationLauncher {    public static void main(String[] args) throws LifecycleException {        Tomcat tomcat = new Tomcat();        tomcat.setPort(8080);        tomcat.getConnector();        Context ctx = tomcat.addContext("", null);        Wrapper servlet = Tomcat.addServlet(ctx, "myServlet", new MyServletV2());        servlet.setLoadOnStartup(1);        servlet.addMapping("/*");        tomcat.start();    }}
```

  

Давайте разберемся с этим кодом.

  

```
Tomcat tomcat = new Tomcat();tomcat.setPort(8080);tomcat.getConnector();
```

  

Вы настраиваете новый сервер Tomcat, который будет слушать порт 8080.

  

```
        Context ctx = tomcat.addContext("", null);        Wrapper servlet = Tomcat.addServlet(ctx, "myServlet", new MyServletV2());
```

  

Так вы регистрируете свой сервлет в Tomcat. Это первая часть, где вы просто сообщаете Tomcat о своем сервлете.

  

```
        servlet.addMapping("/*");
```

  

Вторая часть сообщает Tomcat, за какие запросы отвечает сервлет, то есть за отображение. Отображение /* означает, что оно отвечает за любой входящий запрос (/users, /register, /checkout).

  

```
        tomcat.start();
```

  

Вот и все. Теперь вы запускаете метод main(), переходите на порт 8080 в своем любимом веб-браузере ([http://localhost:8080](http://localhost:8080/) /), и вы увидите красивую страницу HTML.

  

Таким образом, по сути, пока вы продолжаете расширять методы doGet () и doPost (), все ваше веб-приложение может состоять только из одного сервлета. Давайте попробуем это.

  

### Создание JSON с помощью HttpServlets

  

Представьте себе, что помимо вашей (довольно пустой) HTML-страницы индекса вы теперь также хотите предложить REST API для вашего готовящегося к разработке внешнего интерфейса. Так что ваш интерфейс React или AngularJS будет вызывать URL-адрес примерно так:

  

```
/api/users/{userId}
```

  

Эта конечная точка должна возвращать данные в формате JSON для пользователя с заданным userId. Как мы могли бы доработать наш MyServlet для этого, опять же, без каких-либо фреймворков?

  

```
package com.marcobehler.springmvcarticle;import javax.servlet.http.HttpServlet;import javax.servlet.http.HttpServletRequest;import javax.servlet.http.HttpServletResponse;import java.io.IOException;public class MyServletV2 extends HttpServlet {    @Override    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {        if (req.getRequestURI().equals("/")) {            resp.setContentType("text/html");            resp.getWriter().print("<html><head></head><body><h1>Welcome!</h1><p>This is a very cool page!</p></body></html>");        } else if (req.getRequestURI().startsWith("/api/users/")) {            Integer prettyFragileUserId = Integer.valueOf(req.getRequestURI().lastIndexOf("/") + 1);            resp.setContentType("application/json");            // User user = dao.findUser(prettyFragileUserId)            // actually: jsonLibrary.toString(user)            resp.getWriter().print("{\n" +                    "  \"id\":" + prettyFragileUserId + ",\n" +                    "  \"age\": 55,\n" +                    "  \"name\" : \"John Doe\"\n" +                    "}");        } else {            throw new IllegalStateException("Help, I don't know what to do with this url");        }    }}
```

  

Давайте разберемся с этим кодом.

  

```
        } else if (req.getRequestURI().startsWith("/api/users/")) {
```

  

Мы добавляем еще один if в наш метод doGet для обработки вызовов /api/users/.

  

```
  Integer prettyFragileUserId = Integer.valueOf(req.getRequestURI().lastIndexOf("/") + 1);
```

  

Мы делаем **_очень_** слабый разбор URL. Последняя часть URL — это идентификатор пользователя userID, например, 5 для /api/users/5. Здесь мы просто предполагаем, что пользователь всегда передает действительный int, что нам в действительности нужно проверить!

  

```
resp.setContentType("application/json");
```

  

Запись JSON в браузер означает установку правильного типа контента.

  

```
// User user = dao.findUser(prettyFragileUserId)// actually: jsonLibrary.toString(user)resp.getWriter().print("{\n" +        "  \"id\":" + prettyFragileUserId + ",\n" +        "  \"age\": 55,\n" +        "  \"name\" : \"John Doe\"\n" +        "}");
```

  

Опять же, JSON — это просто текст, поэтому мы можем записать его непосредственно в HTTPServletResponse. Возможно, мы бы использовали библиотеку JSON для преобразования нашего пользовательского Java-объекта в эту строку, но для простоты я не буду показывать это здесь.

  

### Проблема с нашим подходом «один сервлет для всего»

  

Хотя наш сервлет выше работает, на горизонте вас ожидает немало проблем:

  

1. Ваш сервлет должен выполнить множество ручных HTTP-специфических операций, проверять URI запроса, перебирать строки и т.д. Другими словами: ему нужно знать **ЧТО** хотят пользователи.
2. Затем он также должен найти данные для всего, что вы хотите отобразить. Другими словами: это должно знать, **КАК**. В нашем примере выше это будет поиск пользователя в базе данных, которую мы для простоты закомментировали.
3. Затем необходимо также преобразовать эти данные в JSON или HTML и установить соответствующие типы ответов.

  

Довольно много разных обязанностей, не так ли? Разве не было бы лучше, если бы вам не приходилось заботиться обо всем этом стандартом коде? Больше нет парсинга URI запроса и параметров, нет больше преобразований JSON, больше нет ответов сервлета?

  

**Именно** здесь на помощь приходит [Spring MVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html).

  

## DispatcherServlet

  

Мы расскажем о Spring MVC немного нетрадиционно и не будем подробно останавливаться на том, что означает Model-View-Controller. Вместо этого немного раздразним вас.

  

Что если я скажу вам, что Spring MVC — это всего лишь один сервлет, как наш выше супер-сервлет?

  

Встречайте **DispatcherServlet**.

  

(О да, в этом, конечно, немного обмана)

  

### Что делает Spring MVC DispatcherServlet?

  

Как уже упоминалось выше, почти все веб-фреймворки Java основаны на сервлетах, поэтому Spring MVC также нужен сервлет, который обрабатывает каждый входящий HTTP-запрос (поэтому DispatcherServlet также называется _фронт-контроллером_).

  

Что же в точности означает **_обрабатывать_** HTTP-запрос, точно? Представьте себе «рабочий процесс регистрации пользователя», при котором пользователь заполняет форму и отправляет ее на сервер и в ответ получает небольшую HTML страницу об успешной регистрации.

  

В этом случае ваш DispatcherServlet должен выполнить следующие действия:

  

1. Необходимо просмотреть URI входящего запроса HTTP и любые параметры запроса. Например: POST /register?name=john&age33.
2. Он должен потенциально преобразовывать входящие данные (параметры/тело запроса) в симпатичные маленькие объекты Java и перенаправить их в класс контроллер или REST контроллер,, который **вы** написали.
3. Ваш контроллер сохраняет нового пользователя в базе данных, возможно отправляет электронное письмо и т.д. Он, скорее всего, делегирует это другому сервисному классу, но давайте предположим, что пока это происходит внутри контроллера.
4. Он должен взять любой вывод из вашего контроллера и преобразовать его обратно в HTML/JSON/XML.

  

Весь процесс выглядит следующим образом, пренебрежем для простоты большим количеством промежуточных классов, потому что DispatcherServlet не выполняет всю работу сам.

  

![](https://habrastorage.org/r/w1560/webt/cd/3n/fk/cd3nfkgh_84hwdxm56uoy9bpgbq.png)

  

До сих пор изложение было немного расплывчато в отношении некоторых частей этого процесса. Что такое ModelAndView на рисунке выше? Как именно DispatcherServlet преобразует данные?

  

Как выглядит реальный процесс Let's-write-HTML? Об этом узнаем в следующем разделе.

  

## Контроллеры — создание HTML

  

Всякий раз, когда вы хотите написать HTML на клиенте, таком как браузер с Spring MVC (включая Spring Boot), вы захотите написать класс контроллера. Давайте сделаем это сейчас.

  

### Как написать контроллер в Spring

  

Для нашего рабочего процесса регистрации пользователей выше (POST/register?name=john&age33) мы бы написали следующий класс.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.stereotype.Controller;import org.springframework.ui.Model;import org.springframework.web.bind.annotation.PostMapping;import org.springframework.web.bind.annotation.RequestParam;@Controllerpublic class RegistrationController {    @PostMapping("/register")    public String registerUser(@RequestParam(required = false) Integer age, @RequestParam String name, Model model) {        User user = new User(name, age);        // TODO save user to database        // userDao.save(user);        // TODO send out registration email        // mailService.sendRegistrationEmail(user);        model.addAttribute("user", user);        return "registration-success";    }}
```

  

Давайте разберемся с этим кодом.

  

```
@Controllerpublic class RegistrationController {
```

  

Класс контроллера в Spring просто аннотируется аннотацией **[Controller](https://habr.com/ru/users/controller/)**, ему не нужно реализовывать определенный интерфейс или расширяться из другого класса.

  

```
@PostMapping("/register")
```

  

Эта строка сообщает нашему DispatcherServlet, что всякий раз, когда приходит запрос POST для пути **_/register_**, включая любые параметры запроса (например, ?Username=), он должен отправлять запрос именно этому методу контроллера.

  

```
    public String registerUser(@RequestParam(required = false) Integer age, @RequestParam String name, Model model) {
```

  

_Примечание_ Наименование нашего метода на самом деле не имеет значения, его можно назвать как угодно.  
Однако мы указываем, что каждый запрос должен включать два параметра запроса, которые могут быть либо частью URL (?age=10&name=Joe), либо находиться в теле запроса POST. Кроме того, требуется только параметр **name** (параметр **age** является необязательным)

  

И параметр **age**, если пользователь предоставил его, автоматически преобразуется в Integer (исключение выдается, если предоставленное значение не является допустимым Integer)

  

Наконец, что не менее важно, Spring MVC автоматически внедряет параметр **model** в наш метод контроллера. Эта модель представляет собой простую карту, на которой вам нужно поместить все данные, которые вы хотите отобразить на вашей окончательной HTML-странице, но об этом чуть позже.

  

```
User user = new User(name, age);// TODO save user to database// userDao.save(user);// TODO send out registration email// mailService.sendRegistrationEmail(user);
```

  

Вы делаете все, что вам нужно сделать с данными входящего запроса. Создать пользователя, сохранить его в базе данных, отправить по электронной почте. Это ваша бизнес-логика.

  

```
model.addAttribute("user", user);
```

  

Вы добавляете своего пользователя в модель с ключом «user». Это означает, что вы сможете ссылаться на него в своем HTML-шаблоне позже, например, «${user.name}». Подробнее об этом через секунду.

  

```
return "registration-success";
```

  

Ваш метод возвращает простую строку со значением **registration-success**. Это не просто строка, это ссылка на ваше представление, т.е. шаблон HTML, который вы хотите, чтобы Spring отображал.

  

### Views (представления)

  

Давайте пока проигнорируем, как (или, скорее, где) Spring MVC попытается найти это представление, т.е. ваш шаблон, вместо этого давайте посмотрим, как должен выглядеть ваш шаблон **registration-success.html**.

  

```
<!DOCTYPE html><html lang="en"><head>    <meta charset="UTF-8">    <title>Title</title></head><body><p th:text="'Hello ' + ${user.name} + '!'"></p></body></html>
```

  

Это простая HTML-страница, которая содержит одну строку _шаблона_. Он печатает имя пользователя, который только что зарегистрировался.

  

```
<p th:text="'Hello ' + ${user.name} + '!'"></p>
```

  

Вопрос в том, что означает синтаксис th:text=? Он специфический для Spring? Или это что-то еще?

  

И ответ таков: Spring MVC ничего не знает о шаблонах HTML. Для работы с HTML-шаблонами требуется сторонняя библиотека шаблонов, и не нужно заботиться о том, какую библиотеку вы выберете.

  

В приведенном выше примере вы видите шаблон [Thymeleaf](https://www.thymeleaf.org/), который очень популярен при работе над проектами Spring MVC.

  

### Spring MVC и библиотеки шаблонов

  

Существует несколько различных библиотек шаблонов, которые хорошо интегрируются с Spring MVC, из которых вы можете выбрать: [Thymeleaf](https://www.thymeleaf.org/), [Velocity](https://velocity.apache.org/), [Freemarker](https://freemarker.apache.org/), [Mustache](https://mustache.github.io/) и даже [JSP](https://en.wikipedia.org/wiki/JavaServer_Pages) (хотя это не библиотека шаблонов).

  

Фактически, вы **должны** явно выбрать библиотеку шаблонов, потому что если у вас нет такой библиотеки шаблонов, добавленной в ваш проект и настроенной правильно, то ваш метод контроллера не будет отображать вашу HTML-страницу — потому что он не знает, как это сделать.

  

Это также означает, что вы должны изучить и понять синтаксис конкретной библиотеки шаблонов в зависимости от проекта, в котором вы работаете, потому что все они **_немного_** отличаются друг от друга. Весело, правда?

  

### Что такое ViewResolver?

  

На секунду давайте подумаем, где Spring на самом деле попытается найти ваши HTML-шаблоны, которые возвращает ваш контроллер.

  

Класс, который пытается _найти_ ваш шаблон, называется **ViewResolver**. Поэтому всякий раз, когда запрос поступает в ваш контроллер, Spring проверяет настроенные ViewResolvers и запрашивает их, чтобы найти шаблон с заданным именем. Если у вас нет настроенных ViewResolvers, это не сработает.

  

Представьте, что вы хотите интегрироваться с Thymeleaf. Следовательно, вам нужен ThymeleafViewResolver.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.context.annotation.Bean;import org.thymeleaf.spring5.SpringTemplateEngine;import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver;import org.thymeleaf.spring5.view.ThymeleafViewResolver;public class ThymeleafConfig {    @Bean    public ThymeleafViewResolver viewResolver() {        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();        templateResolver.setPrefix("classpath:/templates");        templateResolver.setSuffix(".html");        // some other lines neglected...        SpringTemplateEngine templateEngine = new SpringTemplateEngine();        templateEngine.setTemplateResolver(templateResolver);        // some other lines neglected...        viewResolver.setTemplateEngine(templateEngine);        return viewResolver;    }}
```

  

Давайте разберемся с этим кодом.

  

```
    @Bean    public ThymeleafViewResolver viewResolver() {        ThymeleafViewResolver viewResolver = new ThymeleafViewResolver();
```

  

В конце концов, ThymeleafViewResolver просто реализует интерфейс Spring **ViewResolver**. Учитывая имя шаблона (помните: **registration-success**), ViewResolvers может найти фактический шаблон.

  

```
        SpringResourceTemplateResolver templateResolver = new SpringResourceTemplateResolver();
```

  

Для правильной работы ThymeleafViewResolver требуется несколько других специфичных для Thymeleaf классов. Одним из этих классов является **SpringResourceTemplateResolver**. Это делает фактическую работу по поиску вашего шаблона.

  

_Примечание_ SpringResourceTemplateResolver является классом Thymeleaf

  

```
templateResolver.setPrefix("classpath:/templates");templateResolver.setSuffix(".html");
```

  

По существу, вы говорите (с помощью синтаксиса Spring Resources): «Все мои шаблоны находятся по пути classpath, в папке **/templates**». И по умолчанию все они заканчиваются на .html. Это означает:

  

Всякий раз, когда наш контроллер возвращает String, подобный registration-success, ThymeleafViewResolver будет искать шаблон: **classpath:/templates/registration-success.html**.

  

### Заметка на полях: Spring Boot

  

Вы можете подумать: Марко, **мне никогда** не приходилось настраивать такой ViewResolver, работая над проектами Spring Boot. И это правильно. Потому что Spring Boot автоматически настраивает его для вас каждый раз, когда вы добавляете в свой проект зависимость, такую как **spring-boot-starter-thymeleaf**.

  

Он также настраивает ViewResolver так, чтобы он по умолчанию просматривал ваш каталог src/main/resources/template.

  

Итак, Spring Boot действительно предварительно настраивает Spring MVC для вас. Запомните.

  

### Резюме: Model-View-Controller

  

Посмотрев полный пример [Controller](https://habr.com/ru/users/controller/) & ViewResolver, становится намного проще говорить о концепции Spring **M**odel-**V**iew-**C**ontroller.

  

- С помощью нескольких аннотаций ([Controller](https://habr.com/ru/users/controller/), @PostMapping, @RequestParam) вы можете написать **контроллер**, который будет заботиться о получении данных запроса и обрабатывать их соответствующим образом.
- Ваша **модель** содержит все данные (и _только_ данные), которые вы хотите отобразить в своем представлении. Это ваша работа, чтобы заполнить эту карту модели.
- Ваше **представление** — это просто шаблон HTML. Неважно, откуда вы взяли данные (модели). Или каков текущий HTTP-запрос. Или даже если у вас есть активный HTTP-сеанс или нет.

  

Это все о разделении ответственностей.

  

На первый взгляд, немного перегруженный аннотациями, наш класс Spring контроллера читается намного лучше, с гораздо меньшим количеством подключений HTTP, чем наш супер-сервлет с самого начала.

  

### Подробнее о контроллерах

  

Мы уже видели небольшое удобство, которое предоставляет нам Spring MVC при обработке входов HTTP.

  

- Вам не нужно возиться с requestURI, вместо этого вы можете использовать аннотацию.
- Вам не нужно возиться с преобразованиями типов параметров запроса или, разбираться является ли параметр необязательным или обязательным, вы можете использовать аннотацию вместо этого.

  

Давайте рассмотрим наиболее распространенные аннотации, которые помогут вам обрабатывать _входящие_ HTTP-запросы.

  

### @GetMapping и @RequestMappping

  

Вы уже видели аннотацию **@GetMapping** выше. Она эквивалентна аннотации `*@RequestMapping*`. Давайте рассмотрим пример:

  

```
@GetMapping("/books")public void book() {        //}/* these two mappings are identical */@RequestMapping(value = "/books", method = RequestMethod.GET)public void book2() {}
```

  

@GetMapping, @[Post|Put|Delete|Patch]Mapping эквивалентно @RequestMapping(method=XXX). Это просто более новый способ (Spring 4.3+) для определения мапинга (связывания) с URL, поэтому вы найдете, что аннотация @RequestMapping часто используется в более старых, унаследованных проектах Spring.

  

### @RequestParam

  

Для параметров HTTP-запроса, будь то в вашем URL (?Key=value) или в отправленном теле запроса формы, можно прочитать с помощью аннотации _@RequestParam_.

  

Вы уже видели, что он выполняет базовое преобразование типов (например, из параметра HTTP String в int), а также проверяет обязательные или дополнительные параметры.

  

```
@PostMapping("/users")   /* First Param is optional */public User createUser(@RequestParam(required = false) Integer age, @RequestParam String name) {   // does not matter}
```

  

Если вы забудете указать в запросе обязательный параметр, вы получите код ответа **400 Bad Request** и, при использовании Spring Boot, объект ошибки по умолчанию, который выглядит следующим образом:

  

```
{"timestamp":"2020-04-26T08:34:34.441+0000","status":400,"error":"Bad Request","message":"Required Integer parameter 'age' is not present","path":"/users"}
```

  

Если вы хотите еще большего удобства, вы можете позволить Spring напрямую преобразовывать все @RequestParams в объект без каких-либо необходимых аннотаций. Просто укажите ваш **объект** как "_параметр метода_".

  

Вам просто нужно убедиться, что у вашего класса есть соответствующие методы getter/setter.

  

```
@PostMapping("/users")   /* Spring преобразует это автоматически, если у вас есть getters and setters */public User createUser(UserDto userDto) {    //}
```

  

### @PathVariable

  

Помимо параметров запроса, другим популярным способом указания переменных является непосредственное задание их в URI запроса, как _@PathVariable_. Поэтому, чтобы получить профиль пользователя с _userId=123_, вы должны вызвать следующий URL: **GET / users/123**

  

1. Вам просто нужно убедиться, что значение вашего параметра соответствует значению между {} в аннотации сопоставления вашего запроса.

  

Кроме того, **PathVariables** также может быть обязательным или необязательным.

  

```
@GetMapping("/users/{userId}")   public User getUser(@PathVariable(required = false) String userId) {       // ...       return user;   }
```

  

И PathVariables, конечно, может быть напрямую преобразованы в Java-объект (при условии, что у объекта есть соответствующие методы getter/setter).

  

```
@GetMapping("/users/{userId}")public User getUser(UserDto userDto) {    // ...    return user;}
```

  

### Резюме: Контроллеры

  

Короче говоря, при написании HTML-страниц с помощью Spring MVC вам придется сделать всего несколько вещей:

  

1. Напишите свои контроллеры, "присыпанные" несколькими аннотациями. Spring позаботится о том, чтобы представить вам запрос ввода (параметры запроса, переменные пути) удобным способом.
2. Выполните любую логику, необходимую для заполнения вашей модели. Вы можете удобно ввести модель в любой метод контроллера.
3. Сообщите вашему контроллеру, какой шаблон HTML вы хотите отобразить, и верните имя шаблона в виде строки.
4. Всякий раз, когда поступает запрос, Spring обязательно вызовет ваш метод контроллера и примет полученную модель и представление, отобразит его в HTML-строку и вернет его обратно в браузер.
5. При условии, конечно, вы настроили соответствующую библиотеку шаблонов, что Spring Boot автоматически сделает для вас, если вы добавите необходимые зависимости в ваш проект.

  

Вот и все.

  

## REST контроллеры — создание XML/JSON

  

Когда вы разрабатываете RESTFul сервисы, все немного по-другому. Ваш клиент, будь то браузер или другой веб-сервис, будет (обычно) создавать запросы JSON или XML. Клиент отправляет, скажем, запрос JSON, вы обрабатываете его, а затем отправитель ожидает возврата JSON.

  

Таким образом, отправитель может отправить вам этот фрагмент JSON как часть тела HTTP-запроса.

  

```
POST http://localhost:8080/users###{"email": "angela@merkel.de"}
```

  

Но на стороне Java (в вашей программе Spring MVC) вы не хотите иметь дело с JSON строками. Ни при получении запросов, как указано выше, ни при отправке ответов обратно клиенту. Вместо этого вы хотели бы просто иметь объекты Java, в которые Spring автоматически конвертирует JSON.

  

```
public class UserDto {    private String email;    //...}
```

  

Это также означает, что вам _не нужна_ вся эта обработка модели и представления, которые вам приходилось делать при рендеринге HTML в ваших контроллерах. Для RESTful сервисов у вас нет библиотеки шаблонов, читающей шаблон HTML и заполняющей его данными модели, чтобы сгенерировать для вас ответ JSON.

  

Вместо этого вы хотите перейти непосредственно из **HTTP запрос** → **Java объект** и из **Java объект** → **HTTP ответ**.

  

Как вы уже догадались, это именно то, что Spring MVC обеспечивает при написании **REST контроллера**.

  

### Как написать REST контроллер

  

Первое, что вам нужно сделать для вывода XML/JSON, это написать аннотацию @RestController вместо [Controller](https://habr.com/ru/users/controller/). (Хотя @RestController является [Controller](https://habr.com/ru/users/controller/), см. FAQ для точной разницы).

  

Если бы мы написали REST-контроллер для банка, который возвращает список транзакций пользователя, он мог бы выглядеть примерно так:

  

```
package com.marcobehler.springmvcarticle;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RestController;import java.util.Collections;import java.util.List;@RestControllerpublic class BankController {    @GetMapping("/transactions/{userId}")    public List<Transaction> transactions(String userId) {        // find transaction by user        // List<Transaction> = dao.findByUserId(userId);        List<Transaction> transactions = Collections.emptyList();        return transactions;    }}
```

  

Давайте разберемся с этим кодом.

  

```
@RestControllerpublic class BankController {
```

  

Вы снабдили класс BankController аннотацией @RestController, которая сообщает Spring, что вы не хотите писать HTML-страницы через обычный процесс ModelAndView. Вместо этого вы хотите записать XML/JSON (или какой-либо другой формат) непосредственно в тело ответа HTTP.

  

```
public List<Transaction> transactions(String userId) {
```

  

Ваш контроллер больше не возвращает String (представление). Вместо этого он возвращает _List, который Spring необходимо преобразовать в соответствующую структуру JSON или XML. По сути, вы хотите, чтобы ваши Java объекты Transaction стали такими (кто-то жаждал фаст-фуд очень рано утром):_  

```
[  {    "occurred": "28.04.2020 03:18",    "description": "McDonalds - Binging",    "id": 1,    "amount": 10  },  {    "occurred": "28.04.2020 06:18",    "description": "Burger King - Never enough",    "id": 2,    "amount": 15  }]
```

  

Но как Spring MVC узнает, что ваш список транзакций должен быть преобразован в JSON? Почему не XML? Или YAML? Как ваш метод REST контроллер знает, каким должен быть предполагаемый формат ответа?

  

Для этого у Spring есть концепция **согласования контента**.

  

### Согласование контента ответа — Accept Header

  

Короче говоря, согласование контента означает, что клиент должен сообщить вашему серверу, какой формат ответа он хочет получить от вашего REST контроллера.

  

Как? Указав заголовок Accept в HTTP-запросе.

  

```
GET http://localhost:8080/transactions/{userid}Accept: application/json
```

  

Spring MVC разберет этот заголовок Accept и узнает: клиент хочет вернуть JSON (application/json), поэтому мне нужно преобразовать мой _List в JSON. (Краткое примечание. Существуют и другие способы согласования содержимого, но заголовок Accept используется по умолчанию.)_  

Давайте назовем это согласование содержимого ответа, поскольку речь идет о формате данных ответа HTTP, который вы отправляете обратно своему клиенту.

  

Но согласование контента также работает для входящих запросов. Посмотрим как.

  

### Согласование контента запроса — Content-Type Header (заголовок типа контента)

  

При создании RESTful API очень высока вероятность того, что ваши клиенты также смогут отправлять запросы в формате JSON или XML. Давайте снова возьмем пример из начала главы, где вы предлагаете конечную точку REST для регистрации новых пользователей:

  

```
POST http://localhost:8080/users###{"email": "angela@merkel.de"}
```

  

Как Spring узнает, что тело запроса выше содержит JSON, а не XML или YAML? Возможно, вы догадались, вам нужно добавить еще один заголовок, на этот раз это заголовок **Content-Type**.

  

```
POST ...Content-Type: application/json; charset=UTF-8###...
```

  

Как будет выглядеть соответствующий REST контроллер для этого запроса?

  

```
package com.marcobehler.springmvcarticle;import org.springframework.web.bind.annotation.PostMapping;import org.springframework.web.bind.annotation.RequestBody;import org.springframework.web.bind.annotation.RestController;@RestControllerpublic class BookingController {    @PostMapping("/transactions")    public Transaction transaction(@RequestBody TransactionDto dto) {        // do something with the dto..create the booking..convert it to a transaction        Transaction transaction = null;        return transaction;    }}
```

  

Давайте разберемся с этим кодом.

  

```
    public Transaction transaction(@RequestBody TransactionDto dto) {
```

  

Подобно @RequestParam или @Pathvariable, вам понадобится другая аннотация, называемая _@RequestBody_.

  

@RequestBody в сочетании с правильным **Content-Type** будет сигнализировать Spring о том, что ему необходимо просмотреть тело HTTP-запроса и преобразовать его в любой Content-Type, указанный пользователем: JSON в нашем случае.

  

```
    // do something with the dto..create the booking..convert it to a transaction    Transaction transaction = null;    return transaction;}
```

  

Тогда вашему методу больше не нужно заботиться об необработанной строке JSON, он может просто работать с TransactionDTO, сохранять его в базе данных, преобразовывать в объект Transaction, что угодно. В этом сила Spring MVC.

  

### Сам Spring не может конвертировать форматы данных

  

Есть только одна небольшая проблема: Spring знает о заголовках Accept и Content-Type, но не знает, как конвертировать между объектами Java и JSON. Или XML. Или ЯМЛ.

  

Для этой грязной работы требуется соответствующая сторонняя библиотека (также называемая _маршалинг / демаршаллинг_ или _сериализация / десериализация_.)

  

А классы, которые интегрируются между Spring MVC и этими сторонними библиотеками, называются **HttpMessageConverters**.

  

### Что такое HttpMessageConverter?

  

HttpMessageConverter — это интерфейс с четырьмя методами (обратите внимание, я немного упростил интерфейс для более простого объяснения, так как он выглядит немного более продвинутым в реальной жизни).

  

1. **canRead (MediaType)** → Может ли этот конвертер читать (JSON | XML | YAML | и т. д.)? Переданный здесь MediaType обычно является значением из заголовка запроса Content-Type.
2. **canWrite (MediaType)** → Может ли этот преобразователь писать (JSON | XML | YAML | и т. д.)? Тип MediaType, переданный здесь, обычно является значением из заголовка запроса Accept.
3. **read(Object, InputStream, MediaType)** → Читать мой Java-объект из (JSON | XML | YAML | и т. д.) InputStream
4. **write(Object, OutputStream, MediaType)** → Записать мой Java-объект в OutputStream как (JSON | XML | YAML | и т. д.)

  

Короче говоря, MessageConverter должен знать, какие MediaTypes он поддерживает (например, application/json), а затем должен реализовать два метода для фактического чтения / записи в этом формате данных.

  

### Какие есть HttpMessageConverters?

  

К счастью, вам не нужно писать эти конвертеры сообщений самостоятельно. Spring MVC поставляется с классом, который автоматически регистрирует пару стандартных HTTPMessageConverters для вас — если у вас есть соответствующие сторонние библиотеки в пути к классам.

  

Если вы не знаете об этом, это будет выглядеть как магия. В любом случае, взгляните на Spring **AllEncompassingFormHttpMessageConverter** (мне нравится это имя).

  

```
static {        ClassLoader classLoader = AllEncompassingFormHttpMessageConverter.class.getClassLoader();        jaxb2Present = ClassUtils.isPresent("javax.xml.bind.Binder", classLoader);        jackson2Present = ClassUtils.isPresent("com.fasterxml.jackson.databind.ObjectMapper", classLoader) &&                                        ClassUtils.isPresent("com.fasterxml.jackson.core.JsonGenerator", classLoader);        jackson2XmlPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.xml.XmlMapper", classLoader);        jackson2SmilePresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.smile.SmileFactory", classLoader);        gsonPresent = ClassUtils.isPresent("com.google.gson.Gson", classLoader);        jsonbPresent = ClassUtils.isPresent("javax.json.bind.Jsonb", classLoader);}
```

  

Давайте разберемся с этим кодом.

  

```
jaxb2Present = ClassUtils.isPresent("javax.xml.bind.Binder", classLoader);
```

  

Spring MVC проверяет наличие класса javax.xml.bind.Binder и, если он есть, предполагает, что вы добавили в свой проект необходимую библиотеку для выполнения преобразований [JAXB](https://javaee.github.io/jaxb-v2/).

  

```
jackson2Present = ClassUtils.isPresent("com.fasterxml.jackson.databind.ObjectMapper", classLoader) &&ClassUtils.isPresent("com.fasterxml.jackson.core.JsonGenerator", classLoader);
```

  

Spring MVC проверяет наличие двух классов _..jackson..ObjectMapper_ и _..jackson..JsonGenerator_ и, если это так, предполагает, что вы добавили библиотеку [Jackson](https://github.com/FasterXML/jackson) в свой проект для выполнения преобразований JSON.

  

```
jackson2XmlPresent = ClassUtils.isPresent("com.fasterxml.jackson.dataformat.xml.XmlMapper", classLoader);
```

  

Spring MVC проверяет наличие класса _..jackson..XmlMapper_ и, если это так, предполагает, что вы добавили поддержку XML библиотеки [Jackson](https://github.com/FasterXML/jackson) s в свой проект для выполнения преобразований XML.

  

И так далее. И через пару строк Spring просто добавляет HttpMessageConverter для каждой библиотеки, которую он «обнаружил».

  

```
if (jaxb2Present && !jackson2XmlPresent) {        addPartConverter(new Jaxb2RootElementHttpMessageConverter());}if (jackson2Present) {        addPartConverter(new MappingJackson2HttpMessageConverter());}else if (gsonPresent) {        addPartConverter(new GsonHttpMessageConverter());}
```

  

### Заметка на полях: Spring Boot

  

При создании проектов Spring Boot вы автоматически будете использовать Spring MVC под капотом. Но Spring Boot также вызывает Jackson по умолчанию.

  

**Вот** почему вы можете сразу написать конечные точки JSON с помощью Spring Boot, потому что необходимые HttpMessageConverts будут добавлены автоматически для вас.

  

### Резюме: REST контроллеры

  

По сравнению с HTML использование JSON / XML немного проще, так как вам не нужен рендеринг Model и View.

  

Вместо этого ваши контроллеры напрямую возвращают объекты Java, которые Spring MVC будет удобно сериализовать в JSON / XML или любой другой формат, который пользователь запросил с помощью HttpMessageConverters.

  

Однако вы должны убедиться в двух вещах, однако:

  

1. Имеются соответствующие сторонние библиотеки на пути к классам.
2. Отправлены правильные заголовки Accept или Content-Type с каждым запросом.

  

## Часто задаваемые вопросы

  

### Вы где-нибудь публиковали исходный код этой статьи?

  

Вы можете найти рабочий исходный код для большей части этой статьи в следующем репозитории GitHub:  
[https://github.com/marcobehler/spring-mvc-article](https://github.com/marcobehler/spring-mvc-article)

  

Просто клонируйте проект и запустите класс **SpringMvcArticleApplication**, чтобы запустить веб-приложение.

  

### В чем разница между Spring MVC и Spring Boot?

  

Вкратце: _нет никакой разницы_, Spring Boot использует и строит приложение **поверх** Spring MVC.

  

Для более подробного объяснения вам нужно сначала прочитать статью [Что такое Spring Framework?](https://habr.com/ru/post/490586/).

  

### Какой самый быстрый способ создать новое приложение Spring MVC?

  

Если вы хотите упростить использование Spring MVC, самым быстрым способом будет создание нового Spring Boot проекта.

  

1. Перейдите на сайт: [https://start.spring.io/](https://start.spring.io/).
2. Обязательно выберите **Spring Web** в качестве зависимости для вашего нового проекта.

  

Это позволит вам создавать веб / RESTful-приложения с помощью Spring MVC.

  

### Какой тип ввода HTTP-запроса понимает Spring MVC?

  

Spring MVC понимает практически все, что предлагает HTTP — с помощью сторонних библиотек.

  

Это означает, что вы можете добавить в него тела запросов JSON, XML или HTTP (Multipart) Fileuploads, и Spring будет удобно конвертировать этот ввод в объекты Java.

  

### Какие HTTP-ответы может создавать Spring MVC?

  

Spring MVC может записывать все что угодно в HttpServletResponse — с помощью сторонних библиотек.

  

Будь то HTML, JSON, XML или даже тела ответов WebSocket. Более того, он берет ваши объекты Java и генерирует эти тела ответов для вас.

  

### В чем разница между контроллером и REST контроллером

  

1. **Контроллер** по умолчанию возвращают HTML пользователям с помощью библиотеки шаблонов, если вы не добавите аннотацию @ResponseBody к определенным методам, которые также позволяют возвращать XML / JSON.
2. Исходный код **REST контроллера** показывает, что на самом деле это **контроллер** с добавленной аннотацией @ResponseBody. Что эквивалентно написанию контроллера с аннотацией @ResponseBody для каждого метода.

  

```
@Controller@ResponseBodypublic @interface RestController {
```

  

1. Поэтому REST контроллеры по умолчанию возвращает XML / JSON вместо HTML.

  

**Примечание.** XML и JSON — это просто самые популярные форматы данных, которые вы будете использовать в приложении Spring MVC. Однако ваши контроллеры / REST контроллеры могут возвращать что-либо еще, например, YAML. Вам нужно только убедиться, что правильный HttpMessageConverter зарегистрирован в вашем ApplicationContext.

  

### Какую библиотеку шаблонов мне выбрать?

  

На протяжении многих лет я лично работал почти со всеми библиотеками шаблонов, и, хотя есть определенное стимулирование к использованию Thymeleaf в проектах Spring, у меня нет сильных предпочтений. Итак, либо воспользуйтесь Thymeleaf (если у вас нет опыта работы с другими системами), либо выберите тот, который вам наиболее удобен.

  

### Почему мой контроллер выводит 404? Все мапинги верны.

  

Относительно распространенной ошибкой является то, что контроллер возвращает объекты, которые вы хотите преобразовать в JSON или XML, но вам не хватает аннотации @ResponseBody.

  

Spring возвратит довольно бессмысленное исключение 404 Not Found в этом случае.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.stereotype.Controller;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.PathVariable;import org.springframework.web.bind.annotation.ResponseBody;@Controllerpublic class _404WithMissingResponseBodyController {    @GetMapping("/users/{id}")   /* This won't work and lead to a 404 */    public User getUser_404(@PathVariable String id) {        return new User("Everyone's name is John", id);    }    @GetMapping("/users2/{id}")    @ResponseBody  /* This will work */    public User getUser_200(@PathVariable String id) {        return new User("Everyone's name is John", id);    }}
```

  

**Исправление**: добавьте @ResponseBody или превратите ваш _контроллер_ в _REST контроллер_.

  

### Что произойдет, если вы определите один и тот же мапинг запросов для двух разных методов?

  

Если эти два метода имеют разные HTTP методы, это не будет проблемой.

  

```
/* это сработает */@PostMapping("/users")public void method1() {}@GetMapping("/users")publi void method(2) {}
```

  

Однако если вы сопоставите однотипные HTTP методы с одним и тем же путем, у вас возникнет проблема.

  

```
/* это не сработает */@PostMapping("/users")public void method1() {}@PostMapping("/users")publi void method(2) {}
```

  

При запуске приложения это приведет к исключению _IllegalStateException_, что намекает на ваше неоднозначное отображение.

  

```
Caused by: java.lang.IllegalStateException: Ambiguous mapping. Cannot map 'howToPassAndRetrieveRequestParametersController' methodcom.marcobehler.springmvcarticle.HowToPassAndRetrieveRequestParametersController#createUser(User)to {POST /users3}: There is already 'howToPassAndRetrieveRequestParametersController' bean method
```

  

### Нужно ли в URL кодировать @RequestParams?

  

Да, потому что Spring **автоматически** декодирует их из URL. Распространенная ошибка:

  

Представьте, что ваше приложение отправляет электронные письма с подтверждением всякий раз, когда новый пользователь регистрируется, и пользователь указывает знак «+» на своем адресе электронной почты, например, [marco+wantsnospam@marcobehler.com](http://marco+wantsnospam@marcobehler.com/).

  

```
@GetMapping("/confirm")public void confirm(@RequestParam String email, @RequestParam String token){    // confirm user...}
```

  

Если вы забыли правильно закодировать знак ‘+’ в URL в своем письме-подтверждении и отправляете строку как есть на свой контроллер, какое значение будет содержать электронная почта @RequestParam?

  

Это будет «marco[space]wantnospam@marcobehler.com», так как Spring заменит + пробелом, что является правильной обработкой RFC3986.

  

**Исправление:** Убедитесь, что URL-адреса, которые вы вводите в свое приложение, правильно закодированы: [marco%2Bwantsnospam@marcobehler.com](http://marco+wantsnospam@marcobehler.com/), так как Spring будет автоматически их декодировать.

  

### Как получить доступ к текущей HttpSession пользователя?

  

В Spring MVC контроллере или REST контроллере вы можете просто указать HttpSession в качестве аргумента метода, и Spring **автоматически** вставит его (создав его, если он еще не существует).

  

```
@RestControllerpublic class HttpSessionController {    @GetMapping("/session")    public String getSession(HttpSession httpSession) {        System.out.println("httpSession = " + httpSession);        return httpSession.getId();    }}
```

  

Вы не можете сделать это со произвольными компонентами или сервисами, но вы все равно можете внедрить HttpSession в них.

  

```
@Serviceclass SomeOtherService {    @Autowired    private HttpSession httpSession;    public HttpSession getHttpSession() {        return httpSession;    }}
```

  

### Как получить доступ к HttpServletRequest?

  

В вашем Spring MVC контроллере или REST контроллере вы можете просто указать HttpServletRequest в качестве аргумента метода, и Spring **автоматически** вставит его (создавая, если он еще не существует)

  

```
@RestControllerpublic class HttpServletRequestController {    @Autowired    private SomeRequestService someRequestService;    @GetMapping("/request")    public String getRequest(HttpServletRequest request) {        System.out.println("request = " + request);        return request.toString();    }}
```

  

Вы не можете сделать это с произвольными компонентами или сервисами, но вы все еще можете внедрить HttpServletRequest в них.

  

```
@Serviceclass SomeRequestService {    @Autowired    private HttpServletRequest httpServletRequest;    public HttpServletRequest getRequest() {        return httpServletRequest;    }}
```

  

### Как читать HTTP заголовки?

  

Существует множество способов получить доступ к заголовкам запросов, в зависимости от того, хотите ли вы только один или карту со всеми из них. В любом случае вам нужно аннотировать их с помощью @RequestHeader.

  

Какую бы версию вы ни выбрали, постарайтесь быть последовательным с вашим выбором.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.http.HttpHeaders;import org.springframework.stereotype.Controller;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RequestHeader;import java.util.Map;@Controllerpublic class HttpHeaderController {    @GetMapping("/headers1")    public void singleHeader(@RequestHeader("x-forwarded-for") String xForwardedFor) {       // ...    }    @GetMapping("/headers2")    public void headersAsMap(@RequestHeader Map<String,String> headers) {  // or MultiValueMap<String,String>        // ...    }    @GetMapping("/headers3")    public void headersAsObject(HttpHeaders headers) {        // ...    }}
```

  

### Как читать и писать cookie?

  

Для чтения файлов cookie вы можете использовать аннотацию _@CookieValue_ в своих контроллерах. Вы должны будете писать cookie прямо в HttpServletResponse.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.stereotype.Controller;import org.springframework.web.bind.annotation.CookieValue;import org.springframework.web.bind.annotation.GetMapping;import javax.servlet.http.Cookie;import javax.servlet.http.HttpServletResponse;@Controllerpublic class CookieController {    @GetMapping("/cookie")    public void handle(@CookieValue("JSESSIONID") String cookie, HttpServletResponse response) {        response.addCookie(new Cookie("SOME_COOKIE_NAME", "This is a crazy new cookie!"));        //...    }}
```

  

### Как получить IP-адрес пользователя?

  

Это вопрос с подвохом. Существует метод с именем _httpServletRequest.getRemoteAddr()_, который, однако, возвращает только IP-адрес пользователя или последнего прокси-сервера, отправившего запрос, в 99,99% случаев это ваш Nginx или Apache.

  

Следовательно, вам нужно проанализировать заголовок _X-Forwarded-For_ для получения правильного IP-адреса. Но что произойдет, если ваше приложение, кроме того, будет работать за CDN, например CloudFront? Тогда ваш X-Forwarded-For будет выглядеть так:

  

```
X-Forwarded-For: MaybeSomeSpoofedIp, realIp, cloudFrontIp
```

  

Проблема в том, что вы не можете прочитать заголовок слева направо, поскольку пользователи могут предоставить и, следовательно, подделать свой собственный заголовок X-Forwarded-For. Вам всегда нужно идти _справа_ налево и _исключать_ все известные IP-адреса. В случае CloudFront это означает, что вам необходимо знать диапазоны IP-адресов CloudFront и удалить их из заголовка. Ага!

  

Это приводит к довольно сложному коду, разрешающему IP. Угадайте, сколько проектов сделали это неправильно!

  

```
package com.marcobehler.springmvcarticle;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.bind.annotation.RestController;import javax.servlet.http.HttpServletRequest;@RestControllerpublic class IpController {    private static final String[] HEADERS_TO_TRY = {            "X-Forwarded-For",            "Proxy-Client-IP",            "WL-Proxy-Client-IP",            "HTTP_X_FORWARDED_FOR",            "HTTP_X_FORWARDED",            "HTTP_X_CLUSTER_CLIENT_IP",            "HTTP_CLIENT_IP",            "HTTP_FORWARDED_FOR",            "HTTP_FORWARDED",            "HTTP_VIA",            "REMOTE_ADDR"};    @GetMapping("/ip")    public String getClientIpAddress(HttpServletRequest request) {        for (String header : HEADERS_TO_TRY) {            String ip = request.getHeader(header);            if (ip != null && ip.length() != 0 && !"unknown".equalsIgnoreCase(ip)) {                return getRealClientIpAddress(ip);            }        }        return request.getRemoteAddr();    }    /**     * Goes through the supplied ip string (could be one or multiple). Traverses it through the right side...     * and removes any known ip address ranges     *     * @param ipString     * @return     */    public String getRealClientIpAddress(String ipString) {        String[] manyPossibleIps = ipString.split(",");        for (int i = manyPossibleIps.length - 1; i >= 0; i--) {            String rightMostIp = manyPossibleIps[i].trim();            if (isKnownAddress(rightMostIp)) {                continue; // skip this ip as it is trusted            } else {                return rightMostIp;            }        }        return ipString;    }    private boolean isKnownAddress(String rightMostIp) {        // do your check here..for cloudfront you'd need to download their ip address ranges        // from e.g. http://d7uri8nf7uskq.cloudfront.net/tools/list-cloudfront-ips        // and compare the current ip against them        return false;    }}
```

  

### Как вы можете управлять загрузкой файлов в приложении Spring MVC?

  

Предположим, что у вас есть правильная форма загрузки HTML-файла, которая выглядит примерно так:

  

```
<form method="POST" enctype="multipart/form-data" action="/upload">    File to upload:<input type="file" name="file" />    <input type="submit" value="Upload" /></form>
```

  

Вам просто нужен контроллер с аннотацией @PostMapping и соответствующим параметром MultiPartFile, который содержит ваши данные для загрузки и удобные методы для сохранения файла на вашем диске.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.stereotype.Controller;import org.springframework.web.bind.annotation.PostMapping;import org.springframework.web.bind.annotation.RequestParam;import org.springframework.web.multipart.MultipartFile;import java.io.IOException;import java.nio.file.Path;import java.nio.file.Paths;@Controllerpublic class FileUploadController {    @PostMapping("/upload")    public String handleFileUpload(@RequestParam MultipartFile file) throws IOException {        // don't generate upload files like this in a real project.        // give them random names and save their uploaded name as metadata in a database or similar        final Path uploadDestination = Paths.get("C:\\uploads").resolve(file.getName());        file.transferTo(uploadDestination);        return "redirect:/";    }}
```

  

### Как обрабатывать загрузку бинарных файлов (xls, pdf, csv, jpg, zip) с помощью Spring контроллеров?

  

Есть множество способов заставить это работать, от записи непосредственно в HttpServletResponse или возвращения массива byte[] в результате.

  

Тем не менее, самая Spring-и и гибкая версия заключается в возврате '_ResponseEntity '. В зависимости от того, где вы сохранили файл, вы будете использовать различные ресурсы._  

- На диске → FileSystemResource
- На пути к классам вашего проекта → ClassPathResource
- Потоковая передача из «где-то» → InputStreamResource
- Сделали его доступным как массив byte[] в памяти → ByteArrayResource

  

Все, что осталось сделать, это установить соответствующие HTTP-заголовки ответа (имя файла, тип контента и т.д.).

  

```
package com.marcobehler.springmvcarticle;import org.springframework.core.io.ClassPathResource;import org.springframework.core.io.Resource;import org.springframework.http.HttpHeaders;import org.springframework.http.HttpStatus;import org.springframework.http.MediaType;import org.springframework.http.ResponseEntity;import org.springframework.stereotype.Controller;import org.springframework.web.bind.annotation.PathVariable;import org.springframework.web.bind.annotation.RequestMapping;import org.springframework.web.bind.annotation.RequestMethod;import org.springframework.web.server.ResponseStatusException;import java.io.IOException;@Controllerpublic class FileDownloadController {    @RequestMapping(value = "/download/{jpgName}", method = RequestMethod.GET)    public ResponseEntity<Resource> downloadJpg(            @PathVariable String jpgName) throws IOException {        //  Resource downloadResource = new InputStreamResource(soimeinputStream)        //  Resource downloadResource = new ByteArrayResource(someByteArray)        //  Resource downloadResource = new FileSystemResource(someFile)        final ClassPathResource downloadResource = new ClassPathResource(jpgName);        if (!downloadResource.exists()) {            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);        }        HttpHeaders headers = new HttpHeaders();        // 1. set the correct content type        headers.setContentType(MediaType.IMAGE_JPEG);        // 2. set the correct content length, maybe stored in a db table        headers.setContentLength(downloadResource.contentLength());        // 3. if you want to force downloads, otherwise attachments might be displayed directly in the brwoser        headers.setContentDispositionFormData("attachment", jpgName);        return new ResponseEntity<>(downloadResource, headers, HttpStatus.OK);    }}
```

  

### Как я могу глобально обрабатывать исключения в моих контроллерах?

  

В Spring MVC есть несколько способов обработки исключений, если вы не хотите обрабатывать их непосредственно в своих контроллерах, а в одном центральном месте.

  

Создайте класс _ControllerAdvice_ или _RestControllerAdvice_ в сочетании с аннотациями @ResponseStatus и @ExceptionHandler. Несолько замечаний:

  

1. Вы можете догадаться о разнице между этими двумя классами, понимая разницу между контроллером и REST контроллером.
2. @ResponseStatus позволяет вам определить код статуса HTTP, который должен быть возвращен клиенту после обработки вашего исключения.
3. @ExceptionHandler указывает исключение, которое должно вызывать ваш метод-обработчик.
4. Кроме этого, это все похоже на написание обычного контроллера или REST контроллера.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.http.HttpStatus;import org.springframework.ui.Model;import org.springframework.web.bind.annotation.ControllerAdvice;import org.springframework.web.bind.annotation.ExceptionHandler;import org.springframework.web.bind.annotation.ResponseStatus;@ControllerAdvicepublic class GlobalControllerExceptionHandler {    @ResponseStatus(HttpStatus.CONFLICT)  // 409    @ExceptionHandler(SomeConflictException.class)    public String handleConflict(SomeConflictException e, Model model) {        // do something        model.addAttribute("message", e.getMessage());        return "new-template";    }    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)  // 409    @ExceptionHandler(NotYetImplementedExceptoin.class)    public void handleBandwithLimitExceeded(NotYetImplementedExceptoin e) {        // do nothing;    }}
```

  

### Как вернуть любой код состояния (400, 404 и т.д.) из ваших контроллеров?

  

Создайте исключение _ResponseStatusException_ с соответствующим кодом состояния и, возможно, причиной.

  

Альтернативой будет возвращение объекта ResponseEntity, но в большинстве случаев исключение лучше.

  

```
package com.marcobehler.springmvcarticle;import org.springframework.http.HttpStatus;import org.springframework.stereotype.Controller;import org.springframework.web.bind.annotation.GetMapping;import org.springframework.web.server.ResponseStatusException;@Controllerpublic class HttpStatusCodeController {    @GetMapping("/somePath")    public void alwaysThrowsException() {         //throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeepp, not found.");        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Well, that just wasn't right!");    }}
```

  

### Как насчет концепции XYZ в Spring MVC?

  

Официальная [документация Spring MVC](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web) буквально содержит сотни страниц, описывающих, как работает веб-фреймворк.

  

Поэтому, если вы хотите узнать больше о моделях, представлениях, ViewHandlers, InitBinders, RootContexts, фильтрах, кэшировании и т.д., я предлагаю вам прочитать документацию Spring MVC. Это просто выходит за рамки данного руководства, невозможно охватить это все.

  

## Заключение

  

Это была хорошая прогулка. Наконец я надеюсь, что вы узнали множество вещей из этой статьи:

  

- Spring MVC — это старый добрый MVC-фреймворк, который позволяет довольно легко писать веб-сайты HTML или JSON/XML веб-службы.
- Он прекрасно интегрируется со множеством шаблонных библиотек и библиотек преобразования данных, а также с остальной частью экосистемы Spring, такой как Spring Boot.
- Главным образом он позволяет вам сосредоточиться на написании своей бизнес-логики, не беспокоясь о стандартом коде сервлета, разборе HTTP-запросов / ответов и преобразовании данных.

  

Вот и все на сегодня. Спасибо за чтение.

  

## Благодарности

  

Большое спасибо [Patricio "Pato" Moschcovich](https://www.linkedin.com/in/patomos/), который не только выполнил корректуру этой статьи, но и дал бесценный отзыв!

Теги: 

- [spring mvc](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Bspring%20mvc%5D)
- [restful api](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Brestful%20api%5D)
- [веб-сайты](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5B%D0%B2%D0%B5%D0%B1-%D1%81%D0%B0%D0%B9%D1%82%D1%8B%5D)

Хабы: 

- [Java](https://habr.com/ru/hubs/java/)