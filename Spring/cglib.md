### cglib: Отсутствующее руководство

Библиотека [инструментирования байт-кода](http://en.wikipedia.org/wiki/Java_bytecode) [**cglib**](http://cglib.sourceforge.net/) является популярным выбором среди многих известных Java-фреймворков, таких как [Hibernate](http://www.hibernate.org/) ([больше не поддерживается](http://relation.to/16658.lace)) или [Spring](http://spring.io/), для выполнения «грязной» работы. Инструментирование байт-кода позволяет манипулировать классами или создавать их после этапа компиляции Java-приложения. Поскольку Java-классы связываются динамически во время выполнения, можно добавлять новые классы в уже работающую Java-программу. Например, Hibernate использует cglib для создания динамических прокси-серверов. Вместо того чтобы возвращать полный объект, который вы сохранили в базе данных, Hibernate вернёт вам модифицированную версию сохранённого класса, которая отложенно загружает некоторые значения из базы данных только при запросе. Например, Spring использует cglib при добавлении ограничений безопасности к вызовам методов. Вместо того чтобы напрямую вызывать ваш метод, Spring Security сначала проверит, проходит ли заданная проверка безопасности, и только после этого делегирует выполнение вашему методу. Другое популярное применение cglib — в фреймворках для имитации, таких как [mockito](http://code.google.com/p/mockito/), где имитации — это не что иное, как инструментированные классы, в которых методы заменены пустыми реализациями (плюс некоторая логика отслеживания).  
  
Помимо [ASM](http://asm.ow2.org/) — ещё одной библиотеки для работы с байт-кодом очень высокого уровня, на основе которой построена cglib, — cglib предлагает низкоуровневые преобразователи байт-кода, которые можно использовать, даже не зная подробностей о скомпилированном классе Java. К сожалению, документация по cglib довольно короткая, если не сказать, что её практически нет. Помимо [единственной статьи в блоге за 2005 год](http://jnb.ociweb.com/jnb/jnbNov2005.html), в которой демонстрируется класс Enhancer, найти что-то ещё сложно. Эта статья в блоге — попытка продемонстрировать cglib и его, к сожалению, часто неудобный API.  
  

# Усилитель

Давайте начнем с `Enhancer` class, вероятно, наиболее используемого класса библиотеки cglib. Усилитель позволяет создавать Java-прокси для неинтерфейсных типов. `Enhancer`Можно сравнить с [`Proxy`](http://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html) классом стандартной библиотеки Java, который был представлен в Java 1.3. `Enhancer` динамически создает подкласс заданного типа, но перехватывает все вызовы методов. Кроме случая с `Proxy` классом, это работает как для классов, так и для интерфейсных типов. Следующий пример и некоторые последующие примеры основаны на этом простом Java-объекте POJO:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5|`открытый класс SampleClass {`<br><br> `открытый строковый тест (строковый ввод) {`<br><br> `возвращает` `"Привет, мир!"``;`<br><br>`}`<br><br>`}`|

  
С помощью cglib возвращаемое значение метода `test(String)` можно легко заменить другим значением с помощью `Enhancer` и `FixedValue` обратного вызова:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10|`@Тест`<br><br>`public` `void` `testFixedValue() выдает исключение {`<br><br> `Enhancer enhancer = новый Enhancer(); enhancer.setSuperclass(SampleClass.``class``); enhancer.setCallback(новый FixedValue() {`<br><br> `@Переопределить`<br><br> `public` `Object loadObject() выдает исключение {`<br><br> `return` `"Привет, cglib!"``; }`<br><br> `});`<br><br> `прокси-сервер SampleClass = (SampleClass) enhancer.create();`<br><br>`assertEquals(``"Привет, cglib!"``, proxy.test(``null``));`<br><br>`}`|

  
В приведенном выше примере усилитель вернет экземпляр инструментального подкласса `SampleClass`, где все вызовы методов возвращают фиксированное значение, которое генерируется анонимной `FixedValue` реализацией выше. Объект создается с помощью `Enhancer#create(Object...)` где метод принимает любое количество аргументов, которые используются для выбора любого конструктора расширенного класса. (Хотя конструкторы являются всего лишь методами на уровне байтового кода Java, `Enhancer` класс не может использовать конструкторы. Он также не может использовать `static` или `final` классы.) Если вы хотите создать только класс, но не экземпляр, `Enhancer#createClass` создаст экземпляр `Class`, который можно использовать для динамического создания экземпляров. Все конструкторы расширенного класса будут доступны в качестве конструкторов делегирования в этом динамически создаваемом классе.  
  
Имейте в виду, что в приведенном выше примере будет делегирован любой вызов метода, а также вызовы методов, определенных в `java.lang.Object`. В результате вызов `proxy.toString()` также вернет "Hello cglib!". В отличие от этого, вызов `proxy.hashCode()` приведет к a `ClassCastException`, поскольку `FixedValue` перехватчик всегда возвращает a, `String` даже если для `Object#hashCode` подписи требуется примитивное целое число.  
  
Ещё одно наблюдение, которое можно сделать, заключается в том, что финальные методы не перехватываются. Примером такого метода является `Object#getClass` который при вызове возвращает что-то вроде "SampleClass$$EnhancerByCGLIB$$e277c63c". Это имя класса генерируется случайным образом cglib, чтобы избежать конфликтов имён. Помните о другом классе расширенного экземпляра, если вы используете явные типы в своём программном коде. Однако класс, сгенерированный cglib, будет находиться в том же пакете, что и расширенный класс (и, следовательно, сможет переопределять закрытые для пакета методы). Как и в случае с окончательными методами, подход с использованием подклассов не позволяет расширять окончательные классы. Поэтому такие фреймворки, как Hibernate, не могут сохранять окончательные классы.  
  
  
Далее давайте рассмотрим более мощный класс обратного вызова `InvocationHandler`, который также можно использовать с `Enhancer`:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13<br><br>14<br><br>15<br><br>16<br><br>17<br><br>18<br><br>19|`@Test`<br><br>`public` `void` `testInvocationHandler() выдает исключение {`<br><br> `Enhancer enhancer = новый Enhancer();`<br><br> `enhancer.setSuperclass(SampleClass.``class``);`<br><br> `enhancer.setCallback(новый обработчик вызова() {`<br><br> `@Переопределение`<br><br> `вызов общедоступного объекта (прокси-сервер объекта, метод method, аргументы Object[])`<br><br> `выдает Throwable {`<br><br> `if``(метод.getDeclaringClass() != Object.``class` `&& метод.getReturnType() == String.``class``) {`<br><br> `return` `"Привет, cglib!"``;`<br><br> `}` `else` `{`<br><br> `throw` `new` `RuntimeException(``"Не знаю, что делать."``);`<br><br> `}`<br><br> `}`<br><br> `});`<br><br> `SampleClass proxy = (SampleClass) enhancer.create();`<br><br> `assertEquals(``"Привет, cglib!"``, proxy.test(``null``));`<br><br> `assertNotEquals(``"Привет, cglib!"``, proxy.toString());`<br><br>`}`|

  
  
Этот обратный вызов позволяет нам отвечать на вызовы метода. Однако следует быть осторожным при вызове метода на прокси-объекте, который поставляется с методом `InvocationHandler#invoke` . Все вызовы этого метода будут обрабатываться с помощью одного и того же `InvocationHandler` и могут привести к бесконечному циклу. Чтобы избежать этого, мы можем использовать ещё один диспетчер обратных вызовов:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13<br><br>14<br><br>15<br><br>16<br><br>17<br><br>18<br><br>19<br><br>20|`@Test`<br><br>`public` `void` `testMethodInterceptor()` `throws` `Exception {`<br><br>  `Enhancer enhancer =` `new` `Enhancer();`<br><br>  `enhancer.setSuperclass(SampleClass.``class``);`<br><br>  `enhancer.setCallback(``new` `MethodInterceptor() {`<br><br>    `@Override`<br><br>    `public` `Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy)`<br><br>        `throws` `Throwable {`<br><br>      `if``(method.getDeclaringClass() != Object.``class` `&& method.getReturnType() == String.``class``) {`<br><br>        `return` `"Hello cglib!"``;`<br><br>      `}` `else` `{`<br><br>        `proxy.invokeSuper(obj, args);`<br><br>      `}`<br><br>    `}`<br><br>  `});`<br><br>  `SampleClass proxy = (SampleClass) enhancer.create();`<br><br>  `assertEquals(``"Hello cglib!"``, proxy.test(``null``));`<br><br>  `assertNotEquals(``"Hello cglib!"``, proxy.toString());`<br><br>  `proxy.hashCode();` `// Does not throw an exception or result in an endless loop.`<br><br>`}`|

  
  
`MethodInterceptor` обеспечивает полный контроль над перехваченным методом и предлагает несколько утилит для вызова метода расширенного класса в исходном состоянии. Но зачем вообще использовать другие методы? Потому что другие методы более эффективны, а cglib часто используется в пограничных случаях, где эффективность играет важную роль. Для создания и связывания `MethodInterceptor` требуется, например, генерация байт-кода другого типа и создание некоторых объектов во время выполнения, которые не требуются для InvocationHandler. Поэтому существуют другие классы, которые можно использовать с Enhancer:  

- `LazyLoader`: Несмотря на то, что единственный метод `LazyLoader` имеет ту же сигнатуру метода, что и `FixedValue`, `LazyLoader` принципиально отличается от `FixedValue` перехватчика. `LazyLoader`На самом деле предполагается, что он возвращает экземпляр подкласса расширенного класса. Этот экземпляр запрашивается только тогда, когда метод вызывается для расширенного объекта, а затем сохраняется для будущих вызовов сгенерированного прокси-сервера. Это имеет смысл, если ваш объект требует больших затрат при его создании, не зная, будет ли он когда-либо использоваться. Имейте в виду, что для прокси-объекта и для отложенно загружаемого объекта должен быть вызван один и тот же конструктор расширенного класса. Поэтому убедитесь, что доступен другой дешёвый (возможно, `protected`) конструктор, или используйте для прокси-объекта тип интерфейса. Вы можете выбрать вызываемый конструктор, передав аргументы в `Enhancer#create(Object...)`.
- `Dispatcher``Dispatcher` похож на `LazyLoader`, но будет вызываться при каждом вызове метода без сохранения загруженного объекта. Это позволяет изменить реализацию класса, не меняя ссылку на него. Опять же, имейте в виду, что для прокси-сервера и сгенерированных объектов необходимо вызвать конструктор.
- `ProxyRefDispatcher`Этот класс содержит ссылку на прокси-объект, из которого он вызывается, в своей сигнатуре. Это позволяет, например, делегировать вызовы методов другому методу этого прокси-объекта. Имейте в виду, что это может легко привести к бесконечному циклу и всегда приведёт к бесконечному циклу, если один и тот же метод вызывается внутри `ProxyRefDispatcher#loadObject(Object)`.
- `NoOp`Класс `NoOp` делает не то, что следует из его названия. Вместо этого он делегирует каждый вызов метода расширенному классу.

  
На этом этапе последние два перехватчика могут показаться вам бессмысленными. Зачем вообще расширять класс, если вы всё равно будете делегировать вызовы методов расширенному классу? И вы правы. Эти перехватчики следует использовать только вместе с `CallbackFilter` как показано в следующем фрагменте кода:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13<br><br>14<br><br>15<br><br>16<br><br>17<br><br>18<br><br>19<br><br>20<br><br>21<br><br>22<br><br>23<br><br>24<br><br>25<br><br>26|`@Test`<br><br>`public` `void` `testCallbackFilter()` `throws` `Exception {`<br><br>  `Enhancer enhancer =` `new` `Enhancer();`<br><br>  `CallbackHelper callbackHelper =` `new` `CallbackHelper(SampleClass.``class``,` `new` `Class[``0``]) {`<br><br>    `@Override`<br><br>    `protected` `Object getCallback(Method method) {`<br><br>      `if``(method.getDeclaringClass() != Object.``class` `&& method.getReturnType() == String.``class``) {`<br><br>        `return` `new` `FixedValue() {`<br><br>          `@Override`<br><br>          `public` `Object loadObject()` `throws` `Exception {`<br><br>            `return` `"Hello cglib!"``;`<br><br>          `};`<br><br>        `}`<br><br>      `}` `else` `{`<br><br>        `return` `NoOp.INSTANCE;` `// A singleton provided by NoOp.`<br><br>      `}`<br><br>    `}`<br><br>  `};`<br><br>  `enhancer.setSuperclass(MyClass.``class``);`<br><br>  `enhancer.setCallbackFilter(callbackHelper);`<br><br>  `enhancer.setCallbacks(callbackHelper.getCallbacks());`<br><br>  `SampleClass proxy = (SampleClass) enhancer.create();`<br><br>  `assertEquals(``"Hello cglib!"``, proxy.test(``null``));`<br><br>  `assertNotEquals(``"Hello cglib!"``, proxy.toString());`<br><br>  `proxy.hashCode();` `// Does not throw an exception or result in an endless loop.`<br><br>`}`|

  
Экземпляр `Enhancer` принимает `CallbackFilter` в своём методе `Enhancer#setCallbackFilter(CallbackFilter)` и ожидает, что методы расширенного класса будут сопоставлены с индексами массива экземпляров `Callback` в этом массиве. Когда метод вызывается на созданном прокси-сервере, `Enhancer` выбирает соответствующий перехватчик и отправляет вызываемый метод на соответствующий `Callback` (который является интерфейсом-маркером для всех перехватывающих функций, которые были представлены на данный момент). Чтобы сделать этот API менее неудобным, cglib предлагает `CallbackHelper` для представления `CallbackFilter` и создания массива `Callback` для вас. Расширенный объект, описанный выше, будет функционально эквивалентен объекту из примера для `MethodInterceptor` но позволит вам писать специализированные перехватчики, сохраняя логику отправки этих перехватчиков отдельно.  

### Как это работает?

  
Когда `Enhancer` создаёт класс, он устанавливает `private` ~~`static`~~ поле для каждого перехватчика, который был зарегистрирован как `Callback` для расширенного класса после его создания. Это также означает, что определения классов, созданные с помощью cglib, не могут быть повторно использованы после их создания, поскольку регистрация обратных вызовов не является частью этапа инициализации сгенерированного класса, а подготавливается вручную с помощью cglib после инициализации класса JVM. Это также означает, что классы, созданные с помощью cglib, технически не готовы после инициализации и, например, не могут быть отправлены по сети, поскольку обратные вызовы для класса, загруженного на целевом компьютере, не существуют.  
  
В зависимости от зарегистрированных перехватчиков cglib может регистрировать дополнительные поля, например, для `MethodInterceptor` два поля `private` `static` (одно содержит отражающее `Method` значение, а другое содержит `MethodProxy` значение) регистрируются для каждого метода, который перехватывается в расширенном классе или любом из его подклассов. Имейте в виду, что `MethodProxy` чрезмерно использует `FastClass` значение, что приводит к созданию дополнительных классов и более подробно описано ниже.  
  
По всем этим причинам будьте осторожны при использовании `Enhancer`. И всегда регистрируйте типы обратных вызовов с осторожностью, так как `MethodInterceptor` может, например, вызвать создание дополнительных классов и регистрацию дополнительных полей в расширенном классе. Это особенно опасно, так как переменные обратного вызова также хранятся в кэше расширенного класса: это означает, что экземпляры обратного вызова **не** удаляются сборщиком мусора (если только все экземпляры и `ClassLoader` расширенного класса не будут удалены, что является необычным). Это особенно опасно при использовании анонимных классов, которые незаметно сохраняют ссылку на внешний класс. Вспомните приведенный выше пример:  
  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13|`@Test`<br><br>`public` `void` `testFixedValue()` `throws` `Exception {`<br><br>  `Enhancer enhancer =` `new` `Enhancer();`<br><br>  `enhancer.setSuperclass(SampleClass.``class``);`<br><br>  `enhancer.setCallback(``new` `FixedValue() {`<br><br>    `@Override`<br><br>    `public` `Object loadObject()` `throws` `Exception {`<br><br>      `return` `"Hello cglib!"``;`<br><br>    `}`<br><br>  `});`<br><br>  `SampleClass proxy = (SampleClass) enhancer.create();`<br><br>  `assertEquals(``"Hello cglib!"``, proxy.test(``null``));`<br><br>`}`|

  
Анонимный подкласс `FixedValue` вряд ли стал бы ссылаться из расширенного, `SampleClass` так что ни анонимный `FixedValue` экземпляр, ни класс, содержащий `@Test` метод, никогда не будут собираться мусором. Это может привести к серьезным утечкам памяти в ваших приложениях. Поэтому не используйте не `static` внутренние классы с cglib. (Я использую их в этой записи блога только для краткости примеров.)  
  
Наконец, вам не следует перехватывать `Object#finalize()`. Из-за подхода cglib к подклассификации перехват `finalize` реализуется путём переопределения, что [в целом является плохой идеей](http://howtodoinjava.com/2012/10/31/why-not-to-use-finalize-method-in-java/). Расширенные экземпляры, перехватывающие finalize, будут по-другому обрабатываться сборщиком мусора, а также приведут к тому, что эти объекты будут поставлены в очередь финализации JVM. Кроме того, если вы (случайно) создадите жёсткую ссылку на расширенный класс в перехваченном вызове `finalize`, вы фактически создадите экземпляр, который нельзя будет собрать. Как правило, это не то, чего вы хотите. Обратите внимание, что методы `final` никогда не перехватываются cglib. Таким образом, `Object#wait`, `Object#notify` и `Object#notifyAll` не создают таких же проблем. Однако имейте в виду, что `Object#clone` может быть перехвачен, чего вы, возможно, не захотите делать.  
  

# Неизменяемый компонент

cglib `ImmutableBean` позволяет создать оболочку неизменяемости, аналогичную, например, `Collections#immutableSet`. Все изменения базового компонента будут предотвращаться с помощью `IllegalStateException` (но не с помощью `UnsupportedOperationException`, как рекомендуется в Java API). Рассмотрим некоторые компоненты  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9|`public` `class` `SampleBean {`<br><br>  `private` `String value;`<br><br>  `public` `String getValue() {`<br><br>    `return` `value;`<br><br>  `}`<br><br>  `public` `void` `setValue(String value) {`<br><br>    `this``.value = value;`<br><br>  `}`<br><br>`}`|

  
мы можем сделать этот компонент неизменяемым:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10|`@Test``(expected = IllegalStateException.``class``)`<br><br>`public` `void` `testImmutableBean()` `throws` `Exception {`<br><br>  `SampleBean bean =` `new` `SampleBean();`<br><br>  `bean.setValue(``"Hello world!"``);`<br><br>  `SampleBean immutableBean = (SampleBean) ImmutableBean.create(bean);`<br><br>  `assertEquals(``"Hello world!"``, immutableBean.getValue());`<br><br>  `bean.setValue(``"Hello world, again!"``);`<br><br>  `assertEquals(``"Hello world, again!"``, immutableBean.getValue());`<br><br>  `immutableBean.setValue(``"Hello cglib!"``);` `// Causes exception.`<br><br>`}`|

  
Как видно из примера, неизменяемый компонент предотвращает все изменения состояния, выдавая `IllegalStateException`. Однако состояние компонента можно изменить, изменив исходный объект. Все такие изменения будут отражены в `ImmutableBean`.  
  

# Генератор бобов

`BeanGenerator` — это ещё одна утилита для работы с компонентами cglib. Она создаст для вас компонент во время выполнения:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11|`@Test`<br><br>`public` `void` `testBeanGenerator()` `throws` `Exception {`<br><br>  `BeanGenerator beanGenerator =` `new` `BeanGenerator();`<br><br>  `beanGenerator.addProperty(``"value"``, String.``class``);`<br><br>  `Object myBean = beanGenerator.create();`<br><br>  `Method setter = myBean.getClass().getMethod(``"setValue"``, String.``class``);`<br><br>  `setter.invoke(myBean,` `"Hello cglib!"``);`<br><br>  `Method getter = myBean.getClass().getMethod(``"getValue"``);`<br><br>  `assertEquals(``"Hello cglib!"``, getter.invoke(myBean));`<br><br>`}`|

  
Как видно из примера, `BeanGenerator` сначала принимает некоторые свойства в виде пар «имя-значение». При создании `BeanGenerator` создаёт методы доступа  

- `<type> get<name>()`
- `void set<name>(<type>)`

для вас. Это может быть полезно, когда другая библиотека ожидает бобы, которые она определяет с помощью рефлексии, но вы не знаете эти бобы во время выполнения. (Примером может служить [Apache Wicket](http://wicket.apache.org/), которая активно работает с бобами.)  
  

# Копировальный аппарат Bean

`BeanCopier` — это ещё одна утилита для работы с компонентами, которая копирует компоненты по значениям их свойств. Рассмотрим другой компонент с аналогичными свойствами, как у `SampleBean`:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9|`public` `class` `OtherSampleBean {`<br><br>  `private` `String value;`<br><br>  `public` `String getValue() {`<br><br>    `return` `value;`<br><br>  `}`<br><br>  `public` `void` `setValue(String value) {`<br><br>    `this``.value = value;`<br><br>  `}`<br><br>`}`|

  
Теперь вы можете копировать свойства из одного компонента в другой:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9|`@Test`<br><br>`public` `void` `testBeanCopier()` `throws` `Exception {`<br><br>  `BeanCopier copier = BeanCopier.create(SampleBean.``class``, OtherSampleBean.``class``,` `false``);`<br><br>  `SampleBean bean =` `new` `SampleBean();`<br><br>  `myBean.setValue(``"Hello cglib!"``);`<br><br>  `OtherSampleBean otherBean =` `new` `OtherSampleBean();`<br><br>  `copier.copy(bean, otherBean,` `null``);`<br><br>  `assertEquals(``"Hello cglib!"``, otherBean.getValue());` <br><br>`}`|

  
без привязки к определённому типу. Метод `BeanCopier#copy` принимает (в конечном итоге) необязательный `Converter` параметр, который позволяет выполнять дополнительные манипуляции с каждым свойством компонента. Если `BeanCopier` создаётся с ложным значением в качестве третьего аргумента конструктора, `Converter` игнорируется и, следовательно, может быть `null`.  
  

# Фасоль оптом

`BulkBean` позволяет использовать заданный набор методов доступа к компоненту с помощью массивов вместо вызовов методов:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13|`@Test`<br><br>`public` `void` `testBulkBean()` `throws` `Exception {`<br><br>  `BulkBean bulkBean = BulkBean.create(SampleBean.``class``,`<br><br>      `new` `String[]{``"getValue"``},`<br><br>      `new` `String[]{``"setValue"``},`<br><br>      `new` `Class[]{String.``class``});`<br><br>  `SampleBean bean =` `new` `SampleBean();`<br><br>  `bean.setValue(``"Hello world!"``);`<br><br>  `assertEquals(``1``, bulkBean.getPropertyValues(bean).length);`<br><br>  `assertEquals(``"Hello world!"``, bulkBean.getPropertyValues(bean)[``0``]);`<br><br>  `bulkBean.setPropertyValues(bean,` `new` `Object[] {``"Hello cglib!"``});`<br><br>  `assertEquals(``"Hello cglib!"``, bean.getValue());`<br><br>`}`|

  
`BulkBean` принимает в качестве аргументов конструктора массив имён методов получения, массив имён методов установки и массив типов свойств. Полученный инструментированный класс затем можно извлечь в виде массива с помощью `BulkBean#getPropertyBalues(Object)`. Аналогичным образом свойства компонента можно задать с помощью `BulkBean#setPropertyBalues(Object, Object[])`.  
  

# Бобовая карта

Это последняя утилита для работы с компонентами в библиотеке cglib. Утилита `BeanMap` преобразует все свойства компонента в `String`-в-`Object` Java `Map`:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7|`@Test`<br><br>`public` `void` `testBeanGenerator()` `throws` `Exception {`<br><br>  `SampleBean bean =` `new` `SampleBean();`<br><br>  `BeanMap map = BeanMap.create(bean);`<br><br>  `bean.setValue(``"Hello cglib!"``);`<br><br>  `assertEquals(``"Hello cglib"``, map.get(``"value"``));`<br><br>`}`|

  
Кроме того, метод `BeanMap#newInstance(Object)` позволяет создавать карты для других компонентов, повторно используя тот же `Class`.  
  

# Фабрика ключей

Фабрика `KeyFactory` позволяет динамически создавать ключи, состоящие из нескольких значений, которые можно использовать, например, в реализациях `Map`. Для этого `KeyFactory` требуется интерфейс, определяющий значения, которые должны использоваться в таком ключе. Этот интерфейс должен содержать один метод с именем newInstance, который возвращает `Object`. Например:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3|`public` `interface` `SampleKeyFactory {`<br><br>  `Object newInstance(String first,` `int` `second);`<br><br>`}`|

  
Теперь экземпляр ключа a a может быть создан с помощью:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8|`@Test`<br><br>`public` `void` `testKeyFactory()` `throws` `Exception {`<br><br>  `SampleKeyFactory keyFactory = (SampleKeyFactory) KeyFactory.create(Key.``class``);`<br><br>  `Object key = keyFactory.newInstance(``"foo"``,` `42``);`<br><br>  `Map<Object, String> map =` `new` `HashMap<Object, String>();`<br><br>  `map.put(key,` `"Hello cglib!"``);`<br><br>  `assertEquals(``"Hello cglib!"``, map.get(keyFactory.newInstance(``"foo"``,` `42``)));`<br><br>`}`|

  
`KeyFactory` обеспечит правильную реализацию методов `Object#equals(Object)` и `Object#hashCode` таким образом, чтобы полученные ключевые объекты можно было использовать в `Map` или `Set`. `KeyFactory` также часто используется внутри библиотеки cglib.  
  

# Смешивание

Некоторые, возможно, уже знакомы с концепцией класса `Mixin` из других языков программирования, таких как Ruby или Scala (где миксины называются чертами). cglib `Mixin` позволяет объединять несколько объектов в один. Однако для этого эти объекты должны поддерживаться интерфейсами:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13<br><br>14<br><br>15<br><br>16<br><br>17<br><br>18<br><br>19<br><br>20<br><br>21|`public` `interface` `Interface1 {`<br><br>  `String first();`<br><br>`}`<br><br>`public` `interface` `Interface2 {`<br><br>  `String second();`<br><br>`}`<br><br>`public` `class` `Class1` `implements` `Interface1 {`<br><br>  `@Override`<br><br>  `public` `String first() {`<br><br>    `return` `"first"``;`<br><br>  `}`<br><br>`}`<br><br>`public` `class` `Class2` `implements` `Interface2 {`<br><br>  `@Override`<br><br>  `public` `String second() {`<br><br>    `return` `"second"``;`<br><br>  `}`<br><br>`}`|

  
Теперь классы `Class1` и `Class2` можно объединить в один класс с помощью дополнительного интерфейса:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10|`public` `interface` `MixinInterface` `extends` `Interface1, Interface2 {` `/* empty */` `}`<br><br>`@Test`<br><br>`public` `void` `testMixin()` `throws` `Exception {`<br><br>  `Mixin mixin = Mixin.create(``new` `Class[]{Interface1.``class``, Interface2.``class``,`<br><br>      `MixinInterface.``class``},` `new` `Object[]{``new` `Class1(),` `new` `Class2()});`<br><br>  `MixinInterface mixinDelegate = (MixinInterface) mixin;`<br><br>  `assertEquals(``"first"``, mixinDelegate.first());`<br><br>  `assertEquals(``"second"``, mixinDelegate.second());`<br><br>`}`|

  
Следует признать, что API `Mixin` довольно неудобен, поскольку требует, чтобы классы, используемые для миксина, реализовывали некоторый интерфейс, чтобы проблему можно было решить с помощью Java без дополнительных инструментов.  
  

# Переключатель строк

`StringSwitcher`Эмулирует a `String` в int Java `Map`:  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9|`@Test`<br><br>`public` `void` `testStringSwitcher()` `throws` `Exception {`<br><br>  `String[] strings =` `new` `String[]{``"one"``,` `"two"``};`<br><br>  `int``[] values =` `new` `int``[]{``10``,` `20``};`<br><br>  `StringSwitcher stringSwitcher = StringSwitcher.create(strings, values,` `true``);`<br><br>  `assertEquals(``10``, stringSwitcher.intValue(``"one"``));`<br><br>  `assertEquals(``20``, stringSwitcher.intValue(``"two"``));`<br><br>  `assertEquals(-``1``, stringSwitcher.intValue(``"three"``));`<br><br>`}`|

  
StringSwitcher позволяет эмулировать команду `switch` в `String` так же, как это возможно с помощью встроенного в Java оператора `switch` начиная с Java 7. Однако вопрос о том, действительно ли использование `StringSwitcher` в Java 6 или более ранних версиях улучшает ваш код, остаётся спорным, и я бы лично не рекомендовал его использовать.  
  

# Создатель интерфейса

InterfaceMaker делает то, что следует из его названия: он динамически создаёт новый интерфейс.  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10|`@Test`<br><br>`public` `void` `testInterfaceMaker()` `throws` `Exception {`<br><br>  `Signature signature =` `new` `Signature(``"foo"``, Type.DOUBLE_TYPE,` `new` `Type[]{Type.INT_TYPE});`<br><br>  `InterfaceMaker interfaceMaker =` `new` `InterfaceMaker();`<br><br>  `interfaceMaker.add(signature,` `new` `Type[``0``]);`<br><br>  `Class iface = interfaceMaker.create();`<br><br>  `assertEquals(``1``, iface.getMethods().length);`<br><br>  `assertEquals(``"foo"``, iface.getMethods()[``0``].getName());`<br><br>  `assertEquals(``double``.``class``, iface.getMethods()[``0``].getReturnType());`<br><br>`}`|

  
В отличие от любого другого класса общедоступного API cglib, разработчик интерфейса полагается на типы ASM. Создание интерфейса в запущенном приложении вряд ли будет иметь смысл, поскольку интерфейс представляет только тип, который может быть использован компилятором для проверки типов. Однако это может иметь смысл, когда вы генерируете код, который будет использоваться в более поздней разработке.  
  

# Делегат метода

`MethodDelegate` позволяет эмулировать [`C#`подобный делегату](http://msdn.microsoft.com/de-de/library/900fyy8e%28v=vs.90%29.aspx) объект для определённого метода, привязывая вызов метода к некоторому интерфейсу. Например, следующий код привязывает метод `SampleBean#getValue` к делегату:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12|`public` `interface` `BeanDelegate {`<br><br>  `String getValueFromDelegate();`<br><br>`}`<br><br>`@Test`<br><br>`public` `void` `testMethodDelegate()` `throws` `Exception {`<br><br>  `SampleBean bean =` `new` `SampleBean();`<br><br>  `bean.setValue(``"Hello cglib!"``);`<br><br>  `BeanDelegate delegate = (BeanDelegate) MethodDelegate.create(`<br><br>      `bean,` `"getValue"``, BeanDelegate.``class``);`<br><br>  `assertEquals(``"Hello world!"``, delegate.getValueFromDelegate());`<br><br>`}`|

  
Однако есть некоторые вещи, на которые следует обратить внимание:  

- Фабричный метод `MethodDelegate#create` принимает в качестве второго аргумента ровно одно имя метода. Это метод, который `MethodDelegate` будет выполнять за вас.
- Для объекта, передаваемого фабричному методу в качестве первого аргумента, должен быть определён метод **без** аргументов. Таким образом, `MethodDelegate` не так эффективен, как мог бы быть.
- Третий аргумент должен быть интерфейсом ровно с одним аргументом. `MethodDelegate` реализует этот интерфейс и может быть преобразован в него. При вызове метода он вызовет прокси-метод для объекта, который является первым аргументом.

Кроме того, учтите эти недостатки:  

- cglib создаёт новый класс для каждого прокси-сервера. В конечном итоге это приведёт к захламлению пространства кучи постоянной генерации
- Вы не можете прокси-методы, которые принимают аргументы.
- Если ваш интерфейс принимает аргументы, делегирование метода просто не сработает без выброса исключения (возвращаемое значение всегда будет `null`). Если ваш интерфейс требует другого типа возвращаемого значения (даже если он более общий), вы получите `IllegalArgumentException`.

  
  

# Делегат многоадресной рассылки

`MulticastDelegate` работает немного иначе, чем `MethodDelegate`, хотя и выполняет аналогичную функцию. Для использования `MulticastDelegate` нам нужен объект, реализующий интерфейс:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13|`public` `interface` `DelegatationProvider {`<br><br>  `void` `setValue(String value);`<br><br>`}`<br><br>`public` `class` `SimpleMulticastBean` `implements` `DelegatationProvider {`<br><br>  `private` `String value;`<br><br>  `public` `String getValue() {`<br><br>    `return` `value;`<br><br>  `}`<br><br>  `public` `void` `setValue(String value) {`<br><br>    `this``.value = value;`<br><br>  `}`<br><br>`}`|

  
На основе этого компонента с поддержкой интерфейса мы можем создать `MulticastDelegate` который перенаправляет все вызовы `setValue(String)` на несколько классов, реализующих интерфейс `DelegationProvider`:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13<br><br>14<br><br>15|`@Test`<br><br>`public` `void` `testMulticastDelegate()` `throws` `Exception {`<br><br>  `MulticastDelegate multicastDelegate = MulticastDelegate.create(`<br><br>      `DelegatationProvider.``class``);`<br><br>  `SimpleMulticastBean first =` `new` `SimpleMulticastBean();`<br><br>  `SimpleMulticastBean second =` `new` `SimpleMulticastBean();`<br><br>  `multicastDelegate = multicastDelegate.add(first);`<br><br>  `multicastDelegate = multicastDelegate.add(second);`<br><br>  `DelegatationProvider provider = (DelegatationProvider)multicastDelegate;`<br><br>  `provider.setValue(``"Hello world!"``);`<br><br>  `assertEquals(``"Hello world!"``, first.getValue());`<br><br>  `assertEquals(``"Hello world!"``, second.getValue());`<br><br>`}`|

  
Опять же, есть некоторые недостатки:  

- Объекты должны реализовывать интерфейс с одним методом. Это плохо для сторонних библиотек и неудобно, когда вы используете CGlib для выполнения _магии_, которая становится доступной для _обычного кода_. Кроме того, вы можете легко реализовать собственного делегата (хотя и без байт-кода, но я сомневаюсь, что вы сильно выиграете по сравнению с ручным делегированием).
- Когда ваши делегаты возвращают значение, вы получаете только значение последнего добавленного вами делегата. Все остальные возвращаемые значения теряются (но в какой-то момент извлекаются делегатом многоадресной рассылки).

  
  

# Делегат конструктора

`ConstructorDelegate` позволяет создать [фабричный метод](http://en.wikipedia.org/wiki/Factory_method_pattern) с байт-инструментом. Для этого сначала требуется интерфейс с одним методом `newInstance`, который возвращает `Object` и принимает любое количество параметров, используемых для вызова конструктора указанного класса. Например, чтобы создать `ConstructorDelegate` для `SampleBean`, нам требуется следующее для вызова конструктора `SampleBean` по умолчанию (без аргументов):  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11|`public` `interface` `SampleBeanConstructorDelegate {`<br><br>  `Object newInstance();`<br><br>`}`<br><br>`@Test`<br><br>`public` `void` `testConstructorDelegate()` `throws` `Exception {`<br><br>  `SampleBeanConstructorDelegate constructorDelegate = (SampleBeanConstructorDelegate) ConstructorDelegate.create(`<br><br>    `SampleBean.``class``, SampleBeanConstructorDelegate.``class``);`<br><br>  `SampleBean bean = (SampleBean) constructorDelegate.newInstance();`<br><br>  `assertTrue(SampleBean.``class``.isAssignableFrom(bean.getClass()));`<br><br>`}`|

  
  

# Параллельный сортировщик

`ParallelSorter` претендует на звание более быстрой альтернативы сортировщикам массивов из стандартной библиотеки Java при сортировке массивов массивов:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8<br><br>9<br><br>10<br><br>11<br><br>12<br><br>13<br><br>14<br><br>15|`@Test`<br><br>`public` `void` `testParallelSorter()` `throws` `Exception {`<br><br>  `Integer[][] value = {`<br><br>    `{``4``,` `3``,` `9``,` `0``},`<br><br>    `{``2``,` `1``,` `6``,` `0``}`<br><br>  `};`<br><br>  `ParallelSorter.create(value).mergeSort(``0``);`<br><br>  `for``(Integer[] row : value) {`<br><br>    `int` `former = -``1``;`<br><br>    `for``(``int` `val : row) {`<br><br>      `assertTrue(former < val);`<br><br>      `former = val;`<br><br>    `}`<br><br>  `}`<br><br>`}`|

  
`ParallelSorter` принимает массив массивов и позволяет применить сортировку слиянием или быструю сортировку к каждой строке массива. Однако будьте осторожны при его использовании:  

- При использовании массивов примитивов необходимо вызывать сортировку слиянием с явными диапазонами сортировки (например, `ParallelSorter.create(value).mergeSort(0, 0, 3)` в примере. В противном случае в `ParallelSorter` есть довольно очевидная ошибка, из-за которой он пытается преобразовать массив примитивов в массив `Object[]`, что приведёт к `ClassCastException`.
- Если строки массива имеют разную длину, первый аргумент определяет, какую строку следует учитывать. Неравномерные строки либо приведут к тому, что дополнительные значения не будут учитываться при сортировке, либо к `ArrayIndexOutOfBoundException`.

Лично я сомневаюсь, что `ParallelSorter` действительно даёт преимущество во времени. Признаюсь, я ещё не пробовал его протестировать. Если вы попробуете, я буду рад услышать об этом в комментариях.  

  
  

# Быстрый класс и быстрые участники

`FastClass` обещает более быстрое выполнение методов, чем [Java Reflection API](http://docs.oracle.com/javase/tutorial/reflect/), за счёт обертывания класса Java и предоставления методов, аналогичных API отражения:  
  

[](https://mydailyjava.blogspot.com/2013/11/cglib-missing-manual.html#)

|   |   |
|---|---|
|1<br><br>2<br><br>3<br><br>4<br><br>5<br><br>6<br><br>7<br><br>8|`@Test`<br><br>`public` `void` `testFastClass()` `throws` `Exception {`<br><br>  `FastClass fastClass = FastClass.create(SampleBean.``class``);`<br><br>  `FastMethod fastMethod = fastClass.getMethod(SampleBean.``class``.getMethod(``"getValue"``));`<br><br>  `MyBean myBean =` `new` `MyBean();`<br><br>  `myBean.setValue(``"Hello cglib!"``);`<br><br>  `assertTrue(``"Hello cglib!"``, fastMethod.invoke(myBean,` `new` `Object[``0``]));`<br><br>`}`|

  
Помимо продемонстрированного `FastMethod`, `FastClass` также может создавать `FastConstructor`-ы, но не быстрые поля. Но как FastClass может быть быстрее обычного отражения? Отражение в Java выполняется с помощью JNI, где вызовы методов выполняются с помощью `C`-кода. С другой стороны, `FastClass` создаёт байт-код, который вызывает метод напрямую из JVM. Однако в более новых версиях HotSpot JVM (и, вероятно, во многих других современных JVM) есть концепция, называемая инфляцией, при которой JVM [преобразует вызовы рефлексивных методов](http://www.docjar.com/html/api/sun/reflect/ReflectionFactory.java.html) в [собственные версии](http://www.docjar.com/html/api/sun/reflect/NativeMethodAccessorImpl.java.html) `FastClass` при достаточно частом выполнении рефлексивного метода. Вы даже можете управлять этим поведением (по крайней мере, в HotSpot JVM), установив для свойства `sun.reflect.inflationThreshold` меньшее значение. (По умолчанию оно равно 15.) Это свойство определяет, после скольких рефлексивных вызовов вызов JNI должен быть заменён версией с байт-кодом. Поэтому я бы рекомендовал не использовать `FastClass` в современных JVM, но это может повысить производительность на старых виртуальных машинах Java.  
  

# прокси-сервер cglib

cglib `Proxy` — это переписанный класс Java `Proxy`, упомянутый в начале этой статьи. Он предназначен для использования прокси-серверов библиотеки Java в версиях Java до Java 1.3 и отличается лишь незначительными деталями. Однако более подробную документацию по cglib `Proxy` можно найти в [стандартной библиотеке Java`Proxy`javadoc](http://docs.oracle.com/javase/7/docs/api/java/lang/reflect/Proxy.html), где приведён пример его использования. По этой причине я не буду подробно обсуждать cglib `Proxy` в этой статье.  
  

# Последнее предупреждение

После этого краткого обзора функций cglib я хочу сказать несколько слов в качестве предупреждения. Все классы cglib генерируют байт-код, что приводит к тому, что дополнительные классы хранятся в специальном разделе памяти JVM: так называемом постоянном пространстве. Это постоянное пространство, как следует из названия, используется для постоянных объектов, которые обычно не удаляются сборщиком мусора. Однако это не совсем так: после загрузки `Class` он не может быть выгружен до тех пор, пока загрузка `ClassLoader` не станет доступной для сборки мусора. Это возможно только в том случае, если класс был загружен с помощью пользовательского `ClassLoader`, который не является частью системы JVM `ClassLoader`. Этот `ClassLoader` может быть удалён сборщиком мусора, если сам, все `Class`-ы, которые он когда-либо загружал, и все экземпляры всех `Class`-ов, которые он когда-либо загружал, станут доступны для сборки мусора. Это означает, что если вы создаёте всё больше и больше классов в течение всего срока службы Java-приложения и не заботитесь об удалении этих классов, то рано или поздно у вас закончится место в памяти, что приведёт к [завершению работы приложения`OutOfMemoryError`](http://ghb.freshblurbs.com/blog/2005/05/19/explaining-java-lang-outofmemoryerror-permgen-space.html). Поэтому используйте cglib с осторожностью. Однако, если вы будете использовать cglib разумно и аккуратно, вы сможете делать с его помощью удивительные вещи, которые выходят за рамки того, что можно сделать с обычными приложениями Java.  
  
Наконец, при создании проектов, зависящих от cglib, следует учитывать тот факт, что проект cglib не так хорошо поддерживается и активен, как следовало бы, учитывая его популярность. Отсутствие документации — первый признак. Часто беспорядочный публичный API — второй. Кроме того, cglib не всегда корректно устанавливается в Maven Central. Список рассылки похож на архив спам-сообщений. А циклы выпуска довольно нестабильны. Поэтому вы можете обратить внимание на [javassist](http://www.csg.ci.i.u-tokyo.ac.jp/~chiba/javassist/), единственную реальную низкоуровневую альтернативу cglib. Javassist поставляется в комплекте с псевдо-компилятором Java, который позволяет создавать потрясающие инструменты для работы с байт-кодом, даже не разбираясь в байт-коде Java. Если вам нравится пачкать руки, вам также может понравиться [ASM](http://asm.ow2.org/), на основе которого построена cglib. ASM поставляется с подробной документацией по библиотеке, файлам классов Java и их байт-коду.  
  
Обратите внимание, что эти примеры работают только с cglib 2.2.2 и несовместимы с [последней версией 3 cglib](http://sourceforge.net/projects/cglib/files/cglib3/). К сожалению, я столкнулся с тем, что новейшая версия cglib иногда генерирует некорректный байт-код, поэтому я выбрал старую версию и использую её в рабочей среде. Также обратите внимание, что большинство проектов, использующих cglib, перемещают библиотеку в собственное пространство имён, чтобы избежать конфликтов версий с другими зависимостями, такими как [например, Spring](http://docs.spring.io/spring/docs/3.2.5.RELEASE/javadoc-api/org/springframework/cglib/package-summary.html). Вам следует сделать то же самое в своём проекте при использовании cglib. Такие инструменты, как [jarjar](https://code.google.com/p/jarjar/), могут помочь вам автоматизировать эту полезную практику.