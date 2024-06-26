# Сборщик мусора Garbage Collection

Чтобы понять, как работает сборщик мусора _Garbage Collection_, необходимо иметь представление о распределении памяти в JVM (Java Virtual Machine). Данная статья не претендует на то, чтобы покрыть весь объем знаний о распределении памяти в JVM и описании Garbage Collection, поскольку он слишком огромен. Да, к тому же, об этом достаточно информации уже имеется в Сети, чтобы желающие могли докапаться до ее глубин. Но, думаю, данной статьи будет достаточно, чтобы иметь представление о том, как JVM работает с памятью java-приложения.

### Респределение памяти в JVM

Для рассмотрения вопроса распределения памяти JVM будем использовать широко распространенную виртуальную машину для Windows от Oracle HotSpot JVM (раньше был от Sun). Другие виртуальные машины (из комплекта WebLogic или open source JVM из Linux) работают с памятью по похожей на HotSpot схеме. Возможности адресации памяти, предоставляемые архитектурой ОС, зависят от разрядности процессора, определяющего общий диапазон емкости памяти. Так, например, 32-х разрядный процессор обеспечивает диапазон адресации 232, то есть 4 ГБ. Диапазон адресации для 64-разрядного процессора (264) составляет 16 экзабайт.

#### Разделение памяти JVM

Память процесса делится на Stack (стек) и Heap (куча) и включает 5 областей :

- Stack
    - Permanent Generation — используемая JVM память для хранения метаинформации; классы, методы и т.п.
    - Code Cache — используемая JVM память при включенной JIT-компиляции; в этой области памяти кешируется скомпилированный платформенно-зависимый код.
- Heap
    - Eden Space — в этой области выделяется память под все создаваемые программой объекты. Жизненный цикл большей части объектов, к которым относятся итераторы, объекты внутри методов и т.п., недолгий.
    - Survivor Space — здесь хранятся перемещенные из Eden Space объекты после первой сборки мусора. Объекты, пережившие несколько сборок мусора, перемещаются в следующую сборку Tenured Generation.
    - Tenured Generation хранит долгоживущие объекты. Когда данная область памяти заполняется, выполняется полная сборка мусора (full, major collection).

#### Permanent Generation

Область памяти Permanent Generation используется виртуальной машиной JVM для хранения необходимых для управления программой данных, в том числе метаданные о созданных объектах. При каждом создании объекта JVM будет сохранять некоторый набор данных об объекте в области Permanent Generation. Соответственно, чем больше создается в программе объектов, тем больше требуется «пространства» в Permanent Generation.

Размер Permanent Generation можно задать двумя параметрами виртуальной машины JVM :

- -XX:PermSize – минимальный размер выделяемой памяти для Permanent Generation;
- -XX:MaxPermSize – максимальный размер выделяемой памяти для Permanent Generation.

Для «больших» Java-приложений можно при запуске определить одинаковые значения данных параметров, чтобы Permanent Generation была создана с максимальным размером. Это может увеличить производительность, поскольку динамическое изменение размера Permanent Generation является «дорогостоящей» (трудоёмкой) операцией. Определение одинаковых значений этих параметров может избавить JVM от выполнения дополнительных операций, связанных с проверкой необходимости изменения размера Permanent Generation.

#### Область памяти Heap

Куча Heap является основным сегментом памяти, где хранятся создаваемые объекты. Heap делится на два подсегмента : Tenured (Old) Generation и New Generation. New Generation в свою очередь делится на Eden Space и Survivor.

При создании нового объекта, когда используется оператор 'new', например byte[] data = new byte[1024], этот объект создаётся в сегменте Eden Space. Кроме, собственно данных для массива байт, создается также ссылка (указатель) на эти данные. Если места в сегменте Eden Space уже нет, то JVM выполняет сборку мусора. При сборке мусора объекты, на которые имеются ссылки, не удаляются, а перемещаются из одной области в другую. Так, объекты со ссылками перемещаются из Eden Space в Survivor Space, а объекты без ссылок удаляются.

Если количество используемой Eden Space памяти превышает некоторый заданный объем, то Garbage Collection может выполнить быструю (minor collection) сборку мусора. По сравнению с полной сборкой мусора данный процесс занимает немного времени, и затрагивает только область Eden Space — устаревшие объекты без ссылок удаляются, а выжившие перемещаются в область Survivor Space.

Размер сегмента Heap можно определить двумя параметрами : Xms (минимум) и -Xmx (максимум).

#### В чем отличие между сегментами Stack и Heap?

- Heap (куча) используется всеми частями приложения, а Stack используется только одним потоком исполнения программы.
- Новый объект создается в Heap, а в памяти Stack'a размещается ссылка на него. В памяти стека также размещаются локальные переменные примитивных типов.
- Объекты в куче доступны из любого места программы, в то время, как стековая память не доступна для других потоков.
- Если память стека полностью занята, то Java Runtime вызывает исключение java.lang.StackOverflowError, а если память кучи заполнена, то вызывается исключение java.lang.OutOfMemoryError: Java Heap Space.
- Размер памяти стека, как правило, намного меньше памяти в куче. Из-за простоты распределения памяти (LIFO), стековая память работает намного быстрее кучи.

## Garbage Collector

Сборщик мусора Garbage Collector выполняет всего две задачи, связанные с поиском мусора и его очисткой. Для обнаружения мусора существует два подхода :

- Reference counting – учет ссылок;
- Tracing – трассировка.

#### Reference counting

Суть подхода «Reference counting» связана с тем, что каждый объект имеет счетчик, который хранит информацию о количестве указывающих на него ссылок. При уничтожении ссылки счетчик уменьшается. При нулевом значении счетчика объект можно считать мусором.

Главным недостатком данного подхода является сложность обеспечения точности счетчика и «невозможность» выявлять циклические зависимости. Так, например, два объекта могут ссылаться друг на друга, но ни на один из них нет внешней ссылки. Это сопровождается утечками памяти. В этой связи данный подход не получил распространения.

#### Tracing

Главная идея «Tracing» связана с тем, что до «живого» объекта можно добраться из корневых точек (GC Root). Всё, что доступно из «живого» объекта, также является «живым». Если представить все объекты и ссылки между ними как дерево, то необходимо пройти от корневых узлов GC Roots по всем узлам. При этом узлы, до которых нельзя добраться, являются мусором.

![](https://java-online.ru/images/basic/garbage-collection1.png)

Данный подход, обеспечивающий выявление циклических ссылок, используется в виртуальной машине HotSpot VM. Теперь, осталось понять, а что представляет из себя корневая точка (GC Root)? «Источники» говорят, что существуют следующие типы корневых точек :

- Основной Java поток.
- Локальные переменные в основном методе.
- Статические переменные основного класса.

Таким образом, простое java-приложение будет иметь следующие корневые точки:

- Параметры main метода и локальные переменные внутри main метода.
- Поток, который выполняет main.
- Статические переменные основного класса, внутри которого находится main метод.

### Очистка памяти

Имеется несколько подходов к очистке памяти, которые в совокупности определяют принцип функционирования Garbage Collection.

#### Copying collectors

При использовании «Copying collectors» область памяти делится на две части : в одной части размещаются объекты, а вторая часть остается чистой. На время очистки мусора приложение останавливает работу и запускается сборщик мусора, который находит в первой области объекты со ссылками и переносит их во вторую (чистую) область. После этого, первая область очищается от оставшихся там объектов без ссылок, и области меняются местами.

Главным достоинством данного подхода является плотное заполнение памяти. Недостатком «Copying collectors» является необходимость остановки приложения и размеры двух частей памяти должны быть одинаковыми на случай, когда все объекты остаются «живыми».

Данный подход в чистом виде в HotSpot VM не используется.

#### Mark-and-sweep

При использовании «mark-and-sweep» все объекты размещаются в одном сегменте памяти. Сборка мусора также приостанавливает приложение, и Garbage Collection проходит по дереву объектов, помечая занятые ими области памяти, как «живые». После этого, все не помеченные участки памяти сохраняются в «free list», в которой будут, после завершения сборки мусора, размещаться новые объекты.

К недостаткам данного подхода следует отнести необходимость приостановки приложения. Кроме этого, время сборки мусора, как и время приостановки приложения, зависит от размера памяти. Память становится «решетчатой», и, если не применить «уплотнение», то память будет использоваться неэффективно.

Данный подход также в чистом виде в HotSpot VM не используется.

#### Generational Garbage Collection

JVM HotSpot использует алгоритм сборки мусора типа «Generational Garbage Collection», который позволяет применять разные модули для разных этапов сборки мусора. Всего в HotSpot реализовано четыре сборщика мусора :

- Serial Garbage Collection
- Parallel Garbage Collection
- CMS Garbage Collection
- G1 Garbage Collection

**Serial Garbage Collection** относится к одним из первых сборщиков мусора в HotSpot VM. Во время работы этого сборщика приложение приостанавливается и возобновляет работу только после прекращения сборки мусора. В _Serial Garbage Collection_ область памяти делится на две части («young generation» и «old generation»), для которых выполняются два типа сборки мусора :

- minor GC – частый и быстрый c областью памяти «young generation»;
- mark-sweep-compact – редкий и более длительный c областью памяти «old generation».

Область памяти «young generation», представленная на следующем рисунке, разделена на две части, одна из которых Survior также разделена на 2 части (From, To).

![](https://java-online.ru/images/basic/garbage-collection2.png)

### Алгоритм работы minor GC

Алгоритм работы _minor GC_ очень похож на описанный выше «Copying collectors». Отличие связано с дополнительным использованием области памяти «Eden». Очистка мусора выполняется в несколько шагов :

- приложение приостанавливается на начало сборки мусора;
- «живые» объекты из Eden перемещаются в область памяти «To»;
- «живые» объекты из «From» перемещаются в «To» или в «old generation», если они достаточно «старые»;
- Eden и «From» очищаются от мусора;
- «To» и «From» меняются местами;
- приложение возобновляет работу.

![](https://java-online.ru/images/basic/garbage-collection3.png)

В результате сборки мусора картинка области памяти изменится и будет выглядеть следующим образом :

![](https://java-online.ru/images/basic/garbage-collection4.png)

Некоторые объекты, пережившие несколько сборок мусора в области From, переносятся в «old generation». Следует, также отметить, что и «большие живые» объекты могут также сразу же пеместиться из области Eden в «old generation» (на картинке не показаны).

### Алгоритм работы mark-sweep-compact

Алгоритм «mark-sweep-compact» связяан с очисткой и уплотнением области памяти «old generation».

![](https://java-online.ru/images/basic/garbage-collection5.png)

Принцип работы «mark-sweep-compact» похож на описанный выше «Mark-and-sweep», но добавляется процедура «уплотнения», позволяющая более эффективно использовать память. В процедуре живые объекты перемещаются в начало. Таким образом, мусор остается в конце памяти.

_При работе с областью памяти используется механизм «bump-the-pointer», определяющий указатель на начало свободной памяти, в которой размещается создаваемый объект, после чего указатель смещается. В многопоточном приложении используется механизм TLAB (Thread-Local Allocation Buffers), который для каждого потока выделяет определенную область памяти._