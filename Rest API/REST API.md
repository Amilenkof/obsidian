# REST, что же ты такое? Понятное введение в технологию для ИТ-аналитиков

https://youtu.be/DB2SER51mcU - ссылка на видео

252K

[Анализ и проектирование систем*](https://habr.com/ru/hubs/analysis_design/)[API*](https://habr.com/ru/hubs/api/)[Терминология IT](https://habr.com/ru/hubs/terminator/)[Тестирование веб-сервисов*](https://habr.com/ru/hubs/web_testing/)[Микросервисы*](https://habr.com/ru/hubs/microservices/)

**Мы подготовили статью Андрея Буракова на основе его** [**вебинара**](https://www.youtube.com/watch?v=DB2SER51mcU) **на нашем YouTube-канале:**

Проектирование и работа с REST-сервисами стали повседневными задачами для многих аналитиков. Однако мы часто встречаемся на работе с различными или даже противоречащими друг другу трактовками таких понятий, как REST, RESTful-сервис, RESTAPI.

Сегодня мы разберём, какие принципы вложил в парадигму REST её автор и как они могут помочь нам при проектировании систем.

Выясним, почему существует терминологическая путаница вокруг REST и как нам научиться лучше понимать коллег.

Поговорим о том, как связаны [[HTTP]]  и REST. А также почему REST противопоставляют SOAP.  

---

## Терминология

**Формат представления данных**

Давайте представим, что я живу в девятнадцатом веке и хочу **отправить письмо** своему клиенту, который заинтересован в покраске своего автомобиля. Разумеется, я должен написать в письме про то, какие цвета для покраски автомобиля имеются в автосалоне.

Перед тем, как отправить письмо, я беру лист бумаги и пишу клиенту, что в автосалоне сейчас доступны цвета: синий, зелёный, красный, белый, чёрный.

Но я мог бы написать это и на английском: blue, green, red, white, black.

Выходит, что одна и та же информация может быть представлена разными способами. И такой способ представления одной и той же информации разными способами будем называть **форматом представления данных**.

Приведу аналогию:

- Plain text — это обычный текст, который я использовал при написании письма;
    
- XML — язык разметки информации;
    
- JSON — текстовый формат обмена данными;
    
- Binary — бинарный формат.
    

Давайте запомним из этой части статьи что XML и JSON — это форматы представления данных.

**Протокол передачи данных**

Я написал письмо и теперь хочу его отправить. Что мне нужно для этого сделать? Как правило, я кладу письмо в конверт. В нашем случае таким конвертом будет такое понятие, как протокол передачи данных.

**Протокол передачи данных** — это набор соглашений, которые определяют обмен данными между различными программами. Эти соглашения задают единообразный способ передачи сообщений и обработки ошибок.

![Аналогия протокола передачи данных с письмом в конверте](https://habrastorage.org/r/w1560/getpro/habr/upload_files/634/d42/0ec/634d420ec4635c28e4054c8719007589.png "Аналогия протокола передачи данных с письмом в конверте")

Аналогия протокола передачи данных с письмом в конверте

  
Если продолжать рассматривать аналогию с письмом, то стоит обратить, что:  
  
1. конверт имеет структуру;  
  
2. я наклеиваю на конверт марки, указываю определённую информацию: от кого письмо, куда я его отправляю, адрес и т.д.

**Транспорт**

Получил письмо в конверте, всё здорово! Но нужно его как-то отправить. Как мне его отправить? Я воспользуюсь услугами почты. Что для этого нужно сделать? Прийти на почту, отдать письмо. Затем его кто-то должен доставить, используя некоторый транспорт.

**Транспорт** — это подмножество сетевых протоколов, с помощью которых мы можем передавать данные по сети.

Такими протоколами могут быть, например: HTTP, AMQP, FTP.

Если продолжать аналогию с письмом, то почтовая служба может отправить это письмо с помощью голубя или, например, с помощью совы. Вроде бы, письмо одно и то же. Конверт (протокол) один и тот же, формат данных один и тот же, но, обратите внимание — транспорт разный.

Чтобы указать, что данные в определенном формате передаются с помощью некоторого транспорта, часто используют запись вида <Формат данных> over <Транспорт>.

Например:

- JSON over HTTP
    
- XML over HTTP
    
- XML over MQ
    

**Протокол HTTP**

**HyperText Transfer Protocol (HTTP)** — это протокол передачи данных. Изначально для передачи данных в виде гипертекстовых документов в формате HTML, сегодня — для передачи произвольных данных.

Этот протокол имеет две особенности, которые должны учитывать все, кто работает с этим протоколом: ресурсы и HTTP-глаголы.

**Ресурсы**

Чтобы разобраться с понятием ресурса, давайте представим, что у нас имеется некоторая ссылка: [http://webinar.ru/schedule/speech](http://webinar.ru/schedule/speech).

Это как раз и есть тот самый URL, который мы используем поверх HTTP. Рассмотрим, из чего состоит эта ссылка:

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/bae/a4b/d0b/baea4bd0ba89685034c459e63f6afc65.png)

А вот как нам работать с этими объектами, нам говорят HTTP-глаголы (методы).

**HTTP-глаголы**

HTTP-глаголы — это элемент протокола HTTP, который используется в каждом запросе, чтобы указать, какое действие нужно выполнить над данным ресурсом.

Например:

- GET/schedule/speech/id413 — получить информацию об объекте
    

Здесь мы видим некоторый объект (ресурс) с конкретным идентификатором с номером 413. Я могу использовать HTTP-глагол GET для, того чтобы получить информацию о выступлении 413.

Я могу воспользоваться каким-либо другим HTTP-глаголом, если мне необходимо выполнить какие-либо другие действия.

Например:

- PUT/schedule/speech/id413 — создать или перезаписать объект
    

Или удалить объект:

- DELETE/schedule/speech/id413
    

Главное здесь то, что мы рассматриваем некоторые объекты (ресурсы) и совершаем над ними некоторые действия, которые определены в протоколе списком HTTP-методов: GET, PUT, POST, DELETE и т.д.

## Что такое REST?

Какое же определение в понятие REST заложил его основатель Рой Филдинг?

**Representational State Transfer** — это архитектурный стиль взаимодействия компонентов распределённого приложения в сети. Архитектурный стиль – это набор согласованных ограничений и принципов проектирования, позволяющий добиться определённых свойств системы.

Но зачем нам REST? Зачем нам этот стиль? Что нам даст применение принципов REST?

Если мы обратимся опять же к первоисточнику — к работе Филдинга, то мы выясним, что назначение REST в том, чтобы придать проектируемой системе такие свойства как:

- Производительность,
    
- Масштабируемость,
    
- Гибкость к изменениям,
    
- Отказоустойчивость,
    
- Простота поддержки.
    

Это наиболее ценные свойства, с которыми встречается, например, аналитик при проектировании систем. В действительности их намного больше. Если внимательно посмотреть на эти свойства, то мы увидим ни что иное, как нефункциональные требования к системе, которых мы на своих проектах стремимся достичь.

## Принципы REST

Каким образом REST может помочь нам достичь этих свойств и реализовать эти нефункциональные требования?

Чтобы это понять, давайте рассмотри **6 принципов** REST — ограничений, которые и помогают нам добиться этих нефункциональных требований.

**6 принципов REST:**

1. Клиент-серверная архитектура
    
2. Stateless
    
3. Кэширование
    
4. Единообразие интерфейса
    
5. Layered system
    
6. Code on demand
    

Далее мы рассмотрим эти шесть принципов поподробнее.

## Принцип 1. Клиент-серверная архитектура

Сама концепция клиент-серверной архитектуры заключается в разделении некоторых зон ответственности: в разделении функций клиента и сервера. Что это означает?

Например, мы разделяем нашу систему так, что клиент (допустим, это мобильное приложение) реализует только функциональное взаимодействие с сервером. При этом сервер реализует в себе логику хранения данных, сложные взаимодействия со смежными системами и т.д.

Что мы этим добиваемся и как могло бы быть иначе? Давайте представим, что клиент и сервер у нас объединены. Тогда, если мы говорим о мобильном приложении, каждое мобильное приложение каждого клиента должно было бы быть абсолютно самодостаточной единицей. И тогда, поскольку у нас единого сервера нет для получения/отправки информации, у нас получилась бы какая-то сеть единообразных компонентов – например, мобильные приложения общались бы друг с другом – такая распределённая сеть равноценных узлов.

Такие системы в реальной жизни есть и можно найти их примеры. Например, в [блокчейне](https://ru.wikipedia.org/wiki/%D0%91%D0%BB%D0%BE%D0%BA%D1%87%D0%B5%D0%B9%D0%BD). Тем не менее, в случае с REST мы говорим о том, что разделяем ответственность. Например, отображение информации, её обработку и хранение.

![Клиент-серверная архитектура](https://habrastorage.org/r/w1560/getpro/habr/upload_files/10d/73e/21d/10d73e21df451a0b9f951958c9e29bde.png "Клиент-серверная архитектура")

Клиент-серверная архитектура

Также сервер может иметь базу данных (см. рисунок ниже). В данном случае надо понимать, что пара «сервер и БД» тоже будет парой «клиент-сервер». Только в данном случае сервером будет БД, а сам сервер — клиентом.

![Трёхзвенная архитектура](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d9f/d57/305/d9fd573051df0ba2347498a595618296.png "Трёхзвенная архитектура")

Трёхзвенная архитектура

**_Что дает клиент-серверная архитектура и зачем она нужна?_**

Во-первых, клиент-серверная архитектура дает нам определённую масштабируемость: есть сервер, есть единая точка обработки запросов. При необходимости выдерживать большую нагрузку мы можем поставить несколько серверов. Также к нему можно подключать достаточно большое количество клиентов (сколько сможет выдержать). Таким образом, **клиент-серверная архитектура позволяет добиться масштабируемости.**

Во-вторых, REST даёт определённую простоту поддержки. Если мы хотим изменить логику обработки информации на сервере, то выполним эти изменения на сервере. В данном случае мы можем и не менять каждого клиента, как если бы они были абсолютно равноценной сетью.

Конечно, есть и минусы. В случае с клиент-серверной архитектурой мы понимаем, что у нас есть единая точка отказа в виде сервера. Если отказал сервер и у нас нет дополнительных инстансов, то для нас это будет означать неработоспособность системы.

Также потенциально может увеличиться нагрузка, поскольку часть логики мы вынесли с клиента на сервер. Клиент будет совершать меньше каких-либо действий самостоятельно, соответственно, у нас возрастёт количество запросов между клиентом и сервером.

## Принцип 2. Stateless

Принцип заключается в том, что сервер не должен хранить у себя информацию о сессии с клиентом. Он должен в каждом запросе получать всю информацию для обработки.

Что это значит?

![Пример реализации принципа Stateless. Запрос погоды на 20.06 в Москве](https://habrastorage.org/r/w1560/getpro/habr/upload_files/fe7/303/c6b/fe7303c6b9919e620e53ac7990790bec.png "Пример реализации принципа Stateless. Запрос погоды на 20.06 в Москве")

Пример реализации принципа Stateless. Запрос погоды на 20.06 в Москве

Представим, что у нас есть некоторый сервис прогноза погоды, в котором уже реализована клиент-серверная архитектура, и мы хотим получить сообщение о прогнозе погоды на завтра.

Что мы делаем в случае, если мы работаем с Stateless? Мы отправляем запрос «Какая погода?», отправляем место, где хотим погоду узнать, и дату. Соответственно, прогноз погоды отвечает нам — «Будет жарко».

Если я захочу узнать, какая будет погода через день, то опять укажу место, где хочу узнать погоду, укажу другую дату. Сервер получит этот запрос, обработает и сообщит мне, что там уже будет очень жарко.

![Пример реализации принципа Stateless. Запрос погоды на 21.06 в Москве](https://habrastorage.org/r/w1560/getpro/habr/upload_files/a3a/1ff/592/a3a1ff5928dc60283492d365bd6821e7.png "Пример реализации принципа Stateless. Запрос погоды на 21.06 в Москве")

Пример реализации принципа Stateless. Запрос погоды на 21.06 в Москве

Рассмотрим ситуацию: что было бы, если бы у нас не было Stateless? В таком случае у нас бы был Stateful. В этом случае сервер хранит информацию о предыдущих обращениях клиента, хранит информацию о сессии, какую-то часть контекста взаимодействия с клиентом. А затем может использовать эту информацию при обработке следующих запросов.

Приведём пример на рисунке:

![Пример реализации принципа Stateful](https://habrastorage.org/r/w1560/getpro/habr/upload_files/327/cc4/405/327cc440587ee77a5a81d091fe8faf90.png "Пример реализации принципа Stateful")

Пример реализации принципа Stateful

Я всё так же хочу узнать, какая погода будет завтра: отправляю запрос, сервер его обрабатывает, формирует ответ и, помимо того, что он возвращает ответ клиентам, он еще сохраняет какую-то информацию (часть или всю) о том, какой запрос он получил. В случае, если я захочу узнать, какая погода будет через день, я могу сделать такой вызов: «А завтра?». Не сообщая ничего о месте и о дате.

В этом случае у сервера хранится некоторый контекст. Он понимает, что я у него спрашиваю про 21-е число и могу дать ответ на основе информации, хранимой у него в БД или в кэше. Один из примеров, где можно встретить подход Stateful в жизни — это работа с FTP-сервером.

Вернёмся к Statless-подходу. Почему в REST-архитектуре мы должны использовать именно Statless-подход?

Какие он даёт плюсы?

- Масштабируемость сервера,
    
- Уменьшение времени обработки запроса,
    
- Простота поддержки,
    
- Возможность использовать кэширование.
    

В первую очередь, это масштабирование сервера. Если каждый запрос содержит в себе абсолютно весь контекст, необходимый для обработки, то можно, например, клонировать сервер-обработчик: вместо одного поставить десять таких. Мне будет абсолютно неважно, в какой из этих клонов придёт запрос. Если бы они хранили состояние, то либо должны были синхронизироваться, либо мне нужно было бы умело направлять запрос в нужное место.

Помимо этого, появляется простота поддержки. Каждый раз я вижу в логах, какое сообщение приходило от клиента, какой ответ он получал. Мне не нужно дополнительно узнавать о том, какое состояние хранил сервер.

Также подход Stateless позволяет использовать кэширование.

Какие проблемы может создать Stateless-подход?

- Усложнение логики клиента (именно на стороне клиента нам нужно хранить всю информацию о состоянии, о допустимых действиях, о недопустимых действиях и подобных вещах).
    
- Увеличение нагрузки на сеть (каждый раз мы передаём всю информацию, весь контекст. Таким образом, больше информации гоняем по сети).
    

## Принцип 3. Кэширование

В оригинале этот принцип говорит нам о том, что каждый ответ сервера должен иметь пометку, можно ли его кэшировать.

Что такое кэширование?

Представим, что у нас всё так же есть сервис по прогнозу погоды, есть клиент, с которым взаимодействуют. Сам по себе этот сервис погоду не определяет. Погоду определяет метеостанция, с которой он связывается с помощью специальных удалённых вызовов. Что происходит, когда мы используем кэширование?

Например, клиент обратился к серверу с запросом «Хочу узнать погоду». Что делает сервер?

Если мы его только запустили и используем кэширование или если мы не используем кэширование вообще — сервер обратится к метеостанции, а она вернёт ему ответ. Перед тем, как сервер ответит клиенту, он должен сохранить эту информацию в кэше. И только потом вернуть ответ. Для чего?

Когда клиент в следующий раз отправит ровно такой же запрос, сервер сможет не обращаться к метеостанции. Он сможет извлечь прогноз из кэша и вернуть ответ клиенту.

![Пример реализации архитектуры с использованием кэширования](https://habrastorage.org/r/w1560/getpro/habr/upload_files/e38/6ff/43f/e386ff43feb7ca70615f1eb2111abe4f.png "Пример реализации архитектуры с использованием кэширования")

Пример реализации архитектуры с использованием кэширования

Чего мы добились? Мы убрали одну часть взаимодействия между сервером и метеостанцией. Зачем нам это нужно? Это нужно и полезно, если у сервера часто запрашивают одинаковую информацию. Например, кэширование активно используется на новостных сайтах или в соцсетях (на веб-ресурсах, к которым происходит много обращений).

Какие у кэширования плюсы?

- Уменьшение количества сетевых взаимодействий.
    
- Уменьшение нагрузки на системы (не грузим их дополнительными запросами).
    

В каких-то случаях одинаковых обращений будет не так много. Тогда кэширование использовать нет смысла.

При этом важно понимать, что кэширование — это совсем не простая штука. Она бывает достаточно сложна и нетривиальна в реализации.  
Также мы должны учитывать, что если отдаём какие-то данные, которые сохранили раньше, то важно помнить, что эти данные могли уже устареть.

В каких-то случаях это может быть приемлемо, но в каких-то случаях — абсолютно недопустимо. Соответственно, стоит ли использовать кэширование — всегда нужно обдумывать на конкретном примере.

## Принцип 4. Единообразие интерфейса. HATEOAS

Hypermedia as the Engine of Application State (HATEOAS) — одно из ограничений REST, согласно которому сервер возвращает не только ресурс, но и его связи с другими ресурсами и действия, которые можно с ним совершить.

Рассмотрим пример. Возьмём HTTP-запрос, в котором я хочу получить определенный ресурс:

![Пример запроса ресурса](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c6f/f65/0de/c6ff650de1290dc321400ffaa123f391.png "Пример запроса ресурса")

Пример запроса ресурса

Здесь мы используем HTTP-глагол GET, то есть хотим получить ресурс. Обращаемся к некоторому счёту с номером 12345.

Если бы мы не использовали подход HATEOAS, то получили бы примерно такой XML-ответ:  

![Пример ответа без использования принципа HATEOAS](https://habrastorage.org/r/w1560/getpro/habr/upload_files/f75/1b0/976/f751b09763b4c491b1ac399ca3a051dc.png "Пример ответа без использования принципа HATEOAS")

Пример ответа без использования принципа HATEOAS

Здесь указан номер счёта, баланс и валюта.

Что же предлагает HATEOAS? Если бы мы с учётом этого ограничения выполняли бы этот запрос, то в ответе получим не только информацию об этом объекте, но и все те действия, которые мы можем с ним совершить. И, если бы у него были бы какие-то важные связанные объекты, мы получили бы ещё и ссылки на них.  

![Пример ответа с использованием принципа HATEOAS](https://habrastorage.org/r/w1560/getpro/habr/upload_files/eff/a5a/0ef/effa5a0efbe600988caa50477b4cad44.png "Пример ответа с использованием принципа HATEOAS")

Пример ответа с использованием принципа HATEOAS

Получая такие ответы, клиент самостоятельно понимает, какие конкретные действия он может совершать над этим объектом и какую ещё информацию о связанных объектах он может получить. Мы даём клиентскому приложению намного больше информации и свободы действий. Логика клиента становится более гибкой, но при этом и более сложной.

Главный плюс этого подхода — клиент становится очень гибким в плане изменений на сервере с точки зрения изменения допустимых действий, изменения модели данных и т.д.

В качестве обратной стороны медали мы получаем сильное усложнение логики, в первую очередь, клиента. Это может потянуть за собой и усложнение логики на сервере, потому что такие ответы нужно правильно формировать. Фактически ответственность за действия, которые совершает клиент, мы передаём на его же сторону. Мы ослабляем контроль валидности совершаемых операций на стороне сервера.

## Принцип 5. Layered system (слоистая архитектура)

В предыдущих схемах мы рассматривали сторону клиента и сторону сервера, но не думали, что между ними могут быть посредники.

В реальной жизни между ними могут быть, к примеру, proxy-сервера, роутеры, балансировщики — все, что угодно. И то, по какому пути запрос проходит от клиента до сервера, мы часто не можем знать.

Концепция слоистой архитектуры заключается в том, что ни клиент, ни сервер не должны знать о том, как происходит цепочка вызовов дальше своих прямых соседей.

![Модель слоистой архитектуры](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d88/b7a/f4e/d88b7af4e68e3dfc8f40d6edfd03f6cf.png "Модель слоистой архитектуры")

Модель слоистой архитектуры

Знания балансировщика в этой схеме об участниках конкретно этой цепочки вызовов должны заканчиваться proxy-сервером слева и сервером справа. О клиенте он уже ничего не знает.

Если изменяется поведение proxy-сервера (балансировщика, роутера или чего-то ещё), это не должно повлечь изменения для клиентского приложения или для сервера. Помещая их в эту цепочку вызовов, мы не должны замечать никакой разницы. Это позволяет нам изменять общую архитектуру без доработок на стороне клиента или сервера.

Минусы:

- Увеличение нагрузки на сеть (больше участников и больше вызовов, чем если бы мы шли один раз от клиента до сервера напрямую).
    
- Увеличение времени получения ответа (из-за появления дополнительных участников).
    

## Принцип 6. Code on done (код по требованию)

Идея передачи некоторого исполняемого кода (по сути какой-то программы) от сервера клиенту.

Что это значит?

![Модель архитектуры, реализующей принцип "Код по запросу"](https://habrastorage.org/r/w1560/getpro/habr/upload_files/0e5/e62/4db/0e5e624db672ecf31542362d48eadf28.png "Модель архитектуры, реализующей принцип "Код по запросу"")

Модель архитектуры, реализующей принцип "Код по запросу"

Представьте, что клиент — это, например, обычный браузер. Клиент отправляет некоторый запрос и ждёт ответа — страницу с определённым интерактивом (например, должен появляться фейерверк в том месте, где пользователь кликает кнопкой мышки). Это всё может быть реализовано на стороне клиента.

Либо клиент, запрашивая данную страницу приветствия, получит в ответ от сервера не просто HTML-код для отображения, а ещё программу, которую он сам и исполнит. Получается, что сервер передаёт исходный код клиенту, а тот его выполняет.

Что мы за счёт этого получаем? Отчасти, это схоже с принципом HATEOAS. Мы позволяем клиенту стать гибче. Если мы захотим изменить цвет фейерверка, то нам не нужно вносить изменений на клиенте — мы можем сделать это на сервере, а затем передавать клиенту. Пример такого языка — javascript.

## Насколько же сходятся идеи, которые вложил Рэй Филдинг в концепцию REST, с восприятием REST аналитиками?

Давайте рассмотрим наиболее частые заблуждения, которые вы можете встретить относительно концепции REST.

**1. Ограничения REST опциональны (необязательны)**

С точки зрения создателя этой концепции существует ровно одно необязательное ограничение — код по требованию. Все остальные ограничения должны выполняться. Если одно из них не выполняется — это уже не REST-подход.  

**2. REST — протокол передачи данных**

REST — это не протокол передачи данных. Он не определяет правила о том, как мы должны передавать запросы, какая у них должна быть структура, что мы должны возвращать в ошибках. Единственное, что косвенно можно было бы приписать — это указание на то, что каждый ответ сервера должен содержать информацию о том, можно ли его кэшировать.

Но, в целом, REST — это концепция, парадигма, но не протокол. В отличие от HTTP, который действительно является протоколом.

**3. REST — это всегда HTTP**

С одной стороны, ни один из архитектурных принципов REST не говорит нам о том, какой транспорт мы должны использовать — HTTP или очереди.

Но при этом в жизни очень часто встречаются люди, для которых REST и HTTP — это аксиома.

Поэтому, если сказать человеку, что REST — это необязательно HTTP, то вас могут посчитать сумасшедшими.

Почему же все считают, что REST — это HTTP? Здесь нужно сделать ремарку, что одним из главных авторов протокола HTTP — это Рэй Филдинг, автор концепции REST. Рэй Филдинг стремился спроектировать HTTP так, чтобы с помощью него концепцию REST было максимально удобно реализовывать.

**4. REST — это обязательно JSON**

Почему так сложилось? Главная причина в том, что какое-то время назад сервисы вида JSON over HTTP стали противопоставлять SOAP. JSON одновременно стал популярным и стал антагонистом XML, как SOAP подходу. JSON использовался, потому что это не SOAP.

## Модель зрелости REST-сервисов

![Модель зрелости REST-сервисов Ричардсона](https://habrastorage.org/r/w1560/getpro/habr/upload_files/bd8/e4b/848/bd8e4b8488e0085b7404a37dc93faf6c.png "Модель зрелости REST-сервисов Ричардсона")

Модель зрелости REST-сервисов Ричардсона

Ричардсон выделил [уровни зрелости](https://en.wikipedia.org/wiki/Richardson_Maturity_Model) REST-сервисов. Выделение происходило исходя из подхода, что REST — это, с точки зрения протокола, всё-таки HTTP. Соответственно, он спроектировал модель, по которой можно понять: насколько сервис REST или не REST.

### Уровень 0

В первую очередь, он выделил **нулевой уровень**. К нему относятся любые сервисы, которые в качестве транспорта используют HTTP и какой-то формат представления данных. Например, когда мы говорим про JSON over HTTP – мы говорим про нулевой уровень.

Если более наглядно «пощупать ручками» с точки зрения использования протокола HTTP, то можно представить, что мы выставляем некоторый API. Мы начинаем с того, что объявляем единый путь для отправки команд и всегда используем один и тот же HTTP-глагол для совершения абсолютно любых действий с любыми объектами. Например: создай вебинар, запиши вебинар, удали вебинар и т.д. То есть мы всегда используем один и тот же URL и всегда используем один и тот же HTTP-метод, обычно POST.

Как один из примеров:

![Пример 0-го уровня соответствия REST](https://habrastorage.org/r/w1560/getpro/habr/upload_files/036/6f6/e74/0366f6e74d7e98eff650a0103aad1661.png "Пример 0-го уровня соответствия REST")

Пример 0-го уровня соответствия REST

### Уровень 1

Следующий уровень — **первый**. Мы уже научились использовать разные ресурсы и делаем это не по одному URL. Но при этом всё ещё игнорируем HTTP-глаголы.

Мы просто разделяем явно наши объекты, как некоторые ресурсы. Например: спикер, курс, вебинар. Но, независимо от того, что мы хотим сделать — удалить, создать, редактировать, мы всё равно используем один и тот же HTTP-глагол POST.

![Пример 1-го уровня соответствия REST](https://habrastorage.org/r/w1560/getpro/habr/upload_files/e30/9d3/4f3/e309d34f37b77a8673d27cea21487e0b.png "Пример 1-го уровня соответствия REST")

Пример 1-го уровня соответствия REST

### Уровень 2

**Второй уровень** — это когда мы начинаем правильно с точки зрения спецификации HTTP-протокола использовать HTTP-глаголы.

Например, если есть спикер, то, чтобы создать спикера и получить информацию о нём, я использую соответствующий глагол: GET, POST. Когда хочу создать или удалить спикера — я использую глаголы: PUT, DELETE.

По сути, второй уровень зрелости — это то, что чаще всего называют REST.

Надо понимать, что, с точки зрения изначальной концепции, если мы дошли до второго уровня зрелости, то это еще не означает, что мы спроектировали REST-систему/ REST-сервис. Но в очень распространённом понимании соответствие 2-ому уровню часто называют RESTfull сервисом.

RESTfull-сервис — это такой сервис, который спроектирован с учётом REST-ограничений. Хотя, в целом, правильнее сервис такого уровня зрелости называть HTTP-сервисом или HTTP-API, нежели REST-API.

![Пример 2-го уровня соответствия REST](https://habrastorage.org/r/w1560/getpro/habr/upload_files/987/5fc/07b/9875fc07b0ef7bb645f6be5c052b0f3c.png "Пример 2-го уровня соответствия REST")

Пример 2-го уровня соответствия REST

### Уровень 3

**Третий уровень** зрелости — это уровень, в котором мы начинаем использовать концепцию HATEOAS. Когда мы передаём информацию, ресурсы, мы сообщаем потребителям (клиентам) о том, какие ещё действия необходимо совершить ресурсу, а также связи с другими ресурсами.

![Пример 3-го уровня соответствия REST](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c57/477/37c/c5747737c6e904be37b9ae1bc5a74904.png "Пример 3-го уровня соответствия REST")

Пример 3-го уровня соответствия REST

## Выводы, которые мы можем сделать из модели зрелости

Итак, как нам эта модель может помочь понять то, что наши коллеги называют RESTом в каждой отдельно взятой компании? REST у вас или не REST?

Первая распространенная трактовка термина REST — всё, что передаётся в виде JSON поверх HTTP.

Вторая, не менее популярная версия, REST — это сервис второго уровня зрелости, то есть HTTP-API, составленное в соответствии со спецификацией HTTP-протокола. Если мы правильно выделяем ресурсы, правильно используем HTTP-глаголы, а также выполняем некоторые требования HTTP-протокола, то у нас REST.

![Что называют RESTом?](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c25/84d/8fd/c2584d8fd8921277207e702a1f605b5a.png "Что называют RESTом?")

Что называют RESTом?

---

## Подведём итоги

Во-первых, **у каждого свой REST**. Мнения о том, что такое REST, часто разнятся. Когда мы работаем с новыми проектами, новыми коллегами или специалистами, очень важно понять, что именно ваш коллега называет RESTом. Это полезно для того, чтобы на одном из этапов проектирования или разработки не оказалось, что мы половину проекта говорили о разных вещах.

Во-вторых, **принципы REST мы часто применяем в жизни**. Они очень полезны для осмысления. Кэширование, STATELESS и STATEFUL, клиент-серверная модель или код по требованию — это те вещи, которые аналитику полезно знать для понимания.

Третье — это то, что **парадигма REST помогает нам выявить и определить важнейшие свойства архитектуры** — масштабируемость, производительность и т.д.

---

Рекомендуемые ссылки

**1. Способы описания API**

- [https://swagger.io/specification/](https://swagger.io/specification/)
    
- [https://raml.org](https://raml.org/)
    

**2. Инструменты для тестирования API**

- [https://www.postman.com](https://www.postman.com/)
    
- [https://www.soapui.org](https://www.soapui.org/)
    

**3. Большой список открытых API**

- [https://github.com/docops-hq/learnapidoc-ru/blob/m...](https://github.com/docops-hq/learnapidoc-ru/blob/master/Publishing-doc/API-doc-sites-list.md#100-)
    

**4. Ещё открытые API**

- [https://jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/)
    
- [https://dadata.ru/api/](https://dadata.ru/api/)
    
- [https://coda.io/developers/apis/v1](https://coda.io/developers/apis/v1)
    
- [https://developer.kontur.ru/doc/focus?about=2](https://developer.kontur.ru/doc/focus?about=2)
    

---

## Вопросы участников вебинара и ответы на них Андрея

Вопрос:

**Что входит в задачи системного аналитика при проектировании REST-сервиса?**

Ответ:

Предположу, что в вопросе говорится про REST-сервисы второго уровня зрелости, когда мы говорим про HTTP API. Здесь системный аналитик может, в зависимости от компании, от проекта и от договоренности с руководителем, делать многое.

Кто-то проектирует архитектуру сервиса, кто-то только формирует API. Наиболее часто аналитик готовит описание REST-сервиса с помощью каких-нибудь формализованных языков (например, Swagger или JSON-схемы).

Если не рассматривать описание формализованных языков, то остается описание структуры запросов/ответов, описание возможных ошибок, проектирование внутренней логики сервиса и того, что он делает.  

Вопрос:

**В каких программах можно потренироваться новичкам и разобраться в командах, взаимодействиях REST (возможно, SOAP)?**

Ответ:

Первое, о чём хочется рассказать сказать, это об инструменте Postman. Его можно как скачать и установить на ПК, так и работать онлайн. Postman — это некоторая утилита, которая позволяет вызывать внешние сервисы, внешние API, реальные REST-сервисы (которые работают поверх протокола HTTP) и используется для тестирования.

Также можно упомянуть SOAP UI и Swagger UI. Кстати, Swagger — это не только некоторый язык формального описания API, но ещё и редактор, с помощью которого можно вызывать реальные сервисы.

Какую последовательность действий можно посоветовать?

1. Найти общедоступное API;
    
2. Выбрать одну из утилит (я бы рекомендовал начать с Postman);
    
3. Тренироваться.
    

Вопрос:

**Как определить необходимую детализацию описания требований REST API в конкретном проекте? Есть ли хорошие шаблоны описания?**

Ответ:

К сожалению, это очень сложный и абстрактный вопрос, на который трудно ответить. Хочется сказать, что при определении детализации описания требований очень важно договариваться с командой.

На одном из проектов мы действовали оперативно: начинали с самого минималистичного варианта, говорили команде, что будем экспериментировать. И затем с фидбеком от команды оперативно перейдём к тому формату требований, который всех устраивает.  

Вопрос:

**Какую документацию по интеграции должен уметь делать аналитик?**

Ответ:

Ответ такой же, как и в предыдущем вопросе. Всё зависит от проекта и от того, как вы договоритесь с командой.

Если говорить про описание API, то это могут быть разные формальные языки. Описание REST API с помощью Swagger, описание транспортов/протоколов с помощью JSON-схемы, с помощью XSD + WSDL, если это SOAP-сервисы.

Ещё аналитик проектирует взаимодействие между системами или сервисами. Очень часто это визуализируют с помощью диаграммы последовательности (sequence diagram). Также можно использовать use case для описания взаимодействий не только пользователь-система, но и для описания интеграций. Также используют диаграмму потоков данных и компонентные схемы.  

**Об авторе**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/628/b73/f62/628b73f62130e0d4d37e6e77755c7f40.png)

##### Андрей Бураков

Разработчик, аналитик и product owner в кровавом энтерпрайзе и продуктовой разработке

- Создал отдел системного и бизнес анализа VK Pay;
    
- Автор телеграм-канала об анализе и архитектуре [Yet another SA channel](https://t.me/another_sa);
    
- Автор и ведущий курсов по системной интеграции.
    

Теги: 

- [rest](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Brest%5D)
- [restful](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Brestful%5D)
- [rest api](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Brest%20api%5D)
- [stateless](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Bstateless%5D)
- [richardson maturity model](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Brichardson%20maturity%20model%5D)
- [soap](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Bsoap%5D)
- [restapi](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Brestapi%5D)
- [http](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Bhttp%5D)

Хабы: 

- [Анализ и проектирование систем](https://habr.com/ru/hubs/analysis_design/)
- [API](https://habr.com/ru/hubs/api/)
- [Терминология IT](https://habr.com/ru/hubs/terminator/)
- [Тестирование веб-сервисов](https://habr.com/ru/hubs/web_testing/)
- [Микросервисы](https://habr.com/ru/hubs/microservices/)