# Требования ACID на простом языке

6 мин

239K

[Тестирование IT-систем*](https://habr.com/ru/hubs/it_testing/)[SQL*](https://habr.com/ru/hubs/sql/)[Тестирование веб-сервисов*](https://habr.com/ru/hubs/web_testing/)

Мне нравятся книги из серии [Head First O`Reilly](https://okiseleva.blogspot.com/2020/01/head-first-oreilly.html) — они рассказывают просто о сложном. И я стараюсь делать также.

Когда речь идёт о базах данных, могут всплыть магические слова «Требования ACID». На собеседовании или в разговоре разработчиков — не суть. В этой статье я расскажу о том, что это такое, как расшифровывается ACID и что означает каждая буква.

Требования ACID — набор требований, которые обеспечивают сохранность ваших данных. Что особенно важно для финансовых операций. Мы же не хотим остаться без денег из-за разрыва соединения или ошибки в ПО, не так ли?

> **См также:**
> 
> [Что такое транзакция](https://habr.com/ru/post/537594/)
> 
> [Что такое База Данных (БД)](https://habr.com/ru/post/555760/)

Давайте пройдемся по каждой букве ACID и посмотрим на примерах, чем архив лучше 10 разных файлов. И чем транзакция лучше 10 отдельных запросов.

1. [Atomicity — Атомарность](https://habr.com/ru/articles/555920/#atomicity)
    
2. [Consistency — Согласованность](https://habr.com/ru/articles/555920/#consistency)
    
3. [Isolation — Изолированность](https://habr.com/ru/articles/555920/#isolation)
    
4. [Durability — Надёжность](https://habr.com/ru/articles/555920/#durability)
    

### Atomicity — Атомарность

Атомарность гарантирует, что каждая транзакция будет выполнена полностью или не будет выполнена совсем. Не допускаются промежуточные состояния.

Друг познается в беде, а база данных — в работе с ошибками. О, если бы всё всегда было хорошо и без ошибок! Тогда бы никакие ACID были бы не нужны. Но как только возникает ошибка, атомарность становится очень важна.

Допустим, вы решили отправить маме деньги. Когда вы делаете перевод внутри банка, что происходит:

1. У вас деньги списались
    
2. Маме поступили
    

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/40a/1ff/fac/40a1fffac46a8b02d7b74f446f94f511.png)

И допустим, что у нас 2 отдельных запроса. А теперь посмотрим, что будет при возникновении ошибок:

1.  У вас на балансе нет нужной суммы — система вывела сообщение об ошибке, но катастрофы не произошло, атомарность тут не нужна.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5e8/c9f/c81/5e8c9fc81dbef323328a49b51a2712ba.png)

2.      У мамы заблокирована карточка, истек срок годности — деньги ей не поступили. Запрос отменен. Но минуточку... У вас то они уже списались!

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/76b/475/8dc/76b4758dc29cc58b4ca5e654104825e1.png)

Ошибка на первом этапе никаких проблем в себе не таит. А вот ошибка на втором... Приводит к потере денег, что явно недопустимо.

Если мы отправляем отдельные запросы, система не может связать их между собой. Запрос упал с ошибкой? Система его отменяет. Но только его, ведь она не знает о том, что запрос «у меня деньги спиши» связан с упавшим «сюда положи»!

Транзакция же позволяет сгруппировать запросы, то есть фактически показывает базе на взаимосвязи между ними. База сама о связях ничего не знает! Это знаете только вы =)

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/9b3/cfa/808/9b3cfa808a618f656ce905d55142b2cb.png)

И если падает запрос внутри транзакции, база откатывает всю транзакцию. И приходит в состояние «как было до начала транзакции». Даже если там внутри было 10 запросов, вы можете спать спокойно — сломался один, откатятся все.

### Consistency — Согласованность

> Транзакция, достигающая своего нормального завершения (_EOT — end of transaction_, завершение транзакции) и, тем самым, фиксирующая свои результаты, сохраняет согласованность базы данных. Другими словами, каждая успешная транзакция по определению фиксирует только допустимые результаты ​ [wikipedia](https://ru.wikipedia.org/wiki/ACID)

Это свойство вытекает из предыдущего. Благодаря тому, что транзакция не допускает промежуточных результатов, база остается консистентной. Есть такое определение транзакции: «Упорядоченное множество операций, **переводящих базу данных из одного согласованного состояния в другое**». То есть до выполнения операции и после база остается консистентной (в переводе на русский — согласованной).

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/ca8/d75/9d8/ca8d759d8678238c77a1a9cf1eedc023.png)

Например, пользователь в системе заполняет карточку:

- ФИО
    
- Дата рождения
    
- ИНН
    
- Телефон — отдельно код страны, города и номер
    
- Адрес — тоже разбит на несколько полей
    

В базе данных у нас есть несколько таблиц:

- client
    
- phone
    
- address
    

Так что когда пользователь заполнил форму и нажал «сохранить», система отправляет в базу данных 3 запроса:

```
insert into client… -- вставить в таблицу клиентов такие-то данныеinsert into phone…insert into address…
```

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/b00/02f/b7a/b0002fb7aa02d55967260a7194898c91.png)

Можно отправить 3 разных запроса, но лучше сделать одну транзакцию, внутри которой будут эти 3 запроса.

Атомарность гарантирует, что не получится такого, что адрес с телефоном сохранились, а сам клиент — нет. Это сделало бы базу неконсистентной, ведь у нас бы появились атрибуты, «висящие в воздухе», никому не принадлежащие. Что, в свою очередь, приведет к ошибкам в системе.

За консистентностью должен следить разработчик. Ведь это вопрос скорее бизнес-логики, чем технологий. Те же атрибуты, «висящие в воздухе» — это разработчик знает, что:

- если есть телефон в таблице phone
    
- он должен ссылаться на таблицу client
    

База об этом не знает ничего, если ей не рассказать. И она легко пропустит запрос «добавь в базу телефон без ссылки на клиента», если сам по себе запрос корректный, а разработчик не повесил на таблицу _foreign key_.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/7e7/34c/951/7e734c9514326f1d711b303543a1919c.png)

Можно повесить на таблицу _constraint_. Например, «баланс строго положительный». Тогда сценарий с ошибкой будет выглядеть так:

1.  Пользователь пытается перевести другу 100р, хотя у него самого 10

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/606/f24/095/606f24095d98f432c7d8de071a378d9f.png)

2.  Система отправляет в базу запрос — «обнови баланс карты, теперь там X – 100».

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/5f8/9ca/766/5f89ca766756adfe7ab7a3bf586ba946.png)

3.  База пытается выполнить запрос, но ой! Нарушен constraint, в итоге операции баланс стал отрицательным, эту ошибку она и возвращает.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/48c/c27/c41/48cc27c411522ad3f4ec98e4a7ca4e78.png)

4.  Система обрабатывает ошибку и выводит ее пользователю в читаемом виде.

К сожалению, нет единого механизма рассказать базе о том, какое состояние считается согласованным. Разработчик может использовать _foreign_ ключи, какие-то констрейнты — это БД проверит. Но что с одного счета списалось, а на другой пришло — это БД уже не проверит. Это бизнес-логика.

Разработчик пишет код, пошагово переводящий БД в нужное согласованное состояние и, если где-то посередине возникает ошибка или нежданчик, откатывает всю транзакцию. То есть можно после каждого шага делать запрос, проверяя какое-то поле:

— Эй, баланс, ты ведь положительный остался?

— Ку-ку, тебе деньги пришли?

Если вдруг проверка не прошла, то кидаем ошибку и делаем откат.

### Isolation — Изолированность

Во время выполнения транзакции параллельные транзакции не должны оказывать влияния на её результат.

Если у нас система строго для одного человека, проблем не будет. А если пользователей несколько? Тогда транзакции запускают в параллель — для ускорения работы системы. А иначе представьте себе, что вы делаете заказ в интернет-магазине и система вам говорит: «Вы в очереди, перед вами еще 100 человек хотят заказ оформить, подождите». Бред же? Бред!

Вот и приходится распараллеливать запросы. Но к каким эффектам может привести параллельная работа двух транзакций?

**1 эффект: "Потерянная запись"**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d85/48b/d21/d8548bd219da6fdcd722884949941911.png)

Есть некий счет А, на котором лежит 500 у.е.

Кассир 1 (К1 на рисунке) списал с него 300 у.е. Обозначим его действия рыжими стрелками. Списал 300, на выходе получает 200 = 500 - 300.

Кассир 2 (К2) тоже решил обратиться к этому же счету, и записал туда 300 у.е., пока К1 еще не успел закрыть свою транзакцию. Так как первая транзакция не закрыта, сумма на счете до сих пор 500, получаем 500 + 300 = 800.

Итог — мы "потеряли запись" первого кассира, ведь на выходе у нас А = 800, хотя должно быть 500. "Кто последний вписал результат - того и тапки". Получается так.

**2 эффект: "Грязное чтение"**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/968/0fe/6c6/9680fe6c6f228787ba9aee726b351268.png)

Есть некий счет А, на котором лежит 500 у.е.

Кассир 1 списал с него 300 у.е. Обозначим его действия рыжими стрелками. Списал 300. Потом передумал и сделал откат - на выходе остались те же 500 у.е.

Кассиру 2 (К2) понадобилась информация по этому счету и он ее считал до того, как К1 закрыл свою транзакцию.

Итог — второй кассир считал неверную сумму, построил неверный отчет/отказал в визе платежеспособному гражданину и т.д.

**3 эффект: "Повторимое чтение"**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/78c/2df/922/78c2df9224e109d16b0711e36ffc11d5.png)

Есть некие данные.

Кассир 1 строит отчет. Операции идут последовательно для каждой колонки. Система считала данные, записала в первую колонку (например, взяв минимум от них).

Обозначим получение данных зеленым цветом, а изменение - рыжим.

Кассир 2 влез в эту таблицу данных и изменил некоторые счета в ней.

У кассира 1 продолжается построение отчета. И во вторую колонку система считывает уже новые данные.

Итог - отчет построен на основании разных данных.

**4 эффект: "Фантомы"**

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/c7b/535/80d/c7b53580d02ef5f4362dfd1f3c54ff9f.png)

Есть некие данные.

Кассир 1 строит отчет. Операции идут последовательно для каждой колонки. Система считала данные, записала в первую колонку (например, взяв минимум от них).

Обозначим получение данных зеленым цветом, а изменение - рыжим.

Кассир 2 влез в эту таблицу данных и добавил новые счета/удалил некоторые старые.

У кассира 1 продолжается построение отчета. И во вторую колонку система считывает уже новые данные.

Итог — отчет построен на основании разных данных.

Разница между 3-им и 4-ым эффектами в том, что в одном случае данные _изменяются_, а во втором — _добавляются/удаляются_. То есть меняется ещё и их количество.

### Как бороться

Как бороться с этими проблемами? Нужно изолировать транзакцию. Способов есть несколько, но основные — блокировки и версии.

Блокировки — это когда мы блокируем данные в базе. Можно заблокировать одну строку в таблице, а можно всю таблицу. Можно заблокировать данные на редактирование, а можно и на чтение тоже.

Подробнее о блокировках можно почитать тут:

- [Блокировка (СУБД)](https://ru.wikipedia.org/wiki/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0_(%D0%A1%D0%A3%D0%91%D0%94)) — статья из вики
    
- [Режимы блокировки](http://serversql.ru/upravlenie-parallelnoj-rabotoj/rezhimy-blokirovki.html) — здесь хорошо описано, в чем отличие эксклюзивной от разделямой блокировки
    
- [Transaction Isolation Levels in DBMS](https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/) — статья на английском, но хорошо прошлись по разным уровням изоляции базы
    

Версии — это когда внутри базы при каждом обновлении создается новая версия данных и сохраняется старая. Версионирование скрыто от разработчика, то есть мы не видим в базе никаких номеров версий и данных по ним. Просто пока транзакция, обновляющая запись, не покомитит свое изменение, остальные потребители читают старую версию записи и не блокируются.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/20b/ae1/5f5/20bae15f59945a44f54462deabdf9440.png)

### Durability — Надёжность

Если пользователь получил подтверждение от системы, что транзакция выполнена, он может быть уверен, что сделанные им изменения не будут отменены из-за какого-либо сбоя. Обесточилась система, произошел сбой в оборудовании? На выполненную транзакцию это не повлияет.

**См также:**

[ACID в википедии](https://ru.wikipedia.org/wiki/ACID)

[Транзакции, ACID, CAP](https://geekbrains.ru/posts/acid_cap_transactions) — статья с geekbrains

[Разбираем ACID по буквам в NoSQL](https://habr.com/ru/post/228327/) — а это с Хабра

Ну и напомню ссылку на статьи «[Что такое транзакция](https://habr.com/ru/post/537594/)» и «[Что такое База Данных (БД)](https://habr.com/ru/post/555760/)».

_P.S. — больше полезных статей ищите_ [_в моем блоге по метке «полезное»_](https://okiseleva.blogspot.com/search/label/%D0%BF%D0%BE%D0%BB%D0%B5%D0%B7%D0%BD%D0%BE%D0%B5)_. А полезные видео — на_ [_моем youtube-канале_](https://www.youtube.com/c/okiseleva)

Теги: 

- [база данных](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5B%D0%B1%D0%B0%D0%B7%D0%B0%20%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85%5D)
- [транзакция](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5B%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B0%D0%BA%D1%86%D0%B8%D1%8F%5D)
- [acid](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5Bacid%5D)
- [тестирование](https://habr.com/ru/search/?target_type=posts&order=relevance&q=%5B%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%5D)

Хабы: 

- [Тестирование IT-систем](https://habr.com/ru/hubs/it_testing/)
- [SQL](https://habr.com/ru/hubs/sql/)
- [Тестирование веб-сервисов](https://habr.com/ru/hubs/web_testing/)