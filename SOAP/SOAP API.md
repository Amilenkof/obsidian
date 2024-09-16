# SOAP API

[Глоссарий](https://blog.skillfactory.ru/glossary/)

20 августа 2024

Поделиться

[](https://t.me/share/url?url=https://blog.skillfactory.ru/glossary/soap-api/&text=SOAP%20API "Поделится статьёй в ТГ")[](http://vk.com/share.php?url=https://blog.skillfactory.ru/glossary/soap-api/&title=SOAP%20API&description=SOAP%20%E2%80%94%20%D1%8D%D1%82%D0%BE%20%D0%BF%D1%80%D0%BE%D1%82%D0%BE%D0%BA%D0%BE%D0%BB,%20%D0%BF%D0%BE%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%BE%D0%BC%D1%83%20%D0%B2%D0%B5%D0%B1-%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D1%8B%20%D0%B2%D0%B7%D0%B0%D0%B8%D0%BC%D0%BE%D0%B4%D0%B5%D0%B9%D1%81%D1%82%D0%B2%D1%83%D1%8E%D1%82%20%D0%B4%D1%80%D1%83%D0%B3%20%D1%81%20%D0%B4%D1%80%D1%83%D0%B3%D0%BE%D0%BC%20%D0%B8%D0%BB%D0%B8%20%D1%81%20%D0%BA%D0%BB%D0%B8%D0%B5%D0%BD%D1%82%D0%B0%D0%BC%D0%B8.%20%D0%9D%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B8%D1%81%D1%85%D0%BE%D0%B4%D0%B8%D1%82%20%D0%BE%D1%82...&image=https://blog.skillfactory.ru/wp-content/uploads/2023/02/soap-1-9068894.png&noparse=true "Поделится статьёй в Vk")[](https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=https://blog.skillfactory.ru/glossary/soap-api/ "Поделится статьёй в ОК")

Содержание

SOAP — это протокол, по которому веб-сервисы взаимодействуют друг с другом или с клиентами. Название происходит от сокращения Simple Object Access Protocol («простой протокол доступа к объектам»). SOAP API — это веб-сервис, использующий протокол SOAP для обмена сообщениями между серверами и клиентами. При этом сообщения должны быть написаны на языке [XML](https://blog.skillfactory.ru/glossary/xml/) в соответствии со строгими стандартами, иначе сервер вернет ошибку.

![взаимодействие приложений по протоколу SOAP API](https://blog.skillfactory.ru/wp-content/uploads/2023/02/soap-1-9987073.png)

Схема взаимодействия веб-приложений по протоколу SOAP

## Появление, развитие и актуальность SOAP API

Протокол SOAP был представлен в 1998 году и быстро стал одним из главных стандартов веб-служб, когда Microsoft продвигала платформу .NET, приложения которой взаимодействовали с помощью SOAP API. Сейчас протокол и API уступают по популярности архитектурному стилю REST. Но веб-приложения, использующие SOAP API, все еще пользуются спросом, особенно в банковском и телекоммуникационном секторах. 

![](https://blog.skillfactory.ru/wp-content/uploads/2023/03/kartinka-82.png)

Освойте профессию «Frontend-разработчик»

[Подробнее](https://skillfactory.ru/frontend-razrabotchik-pro/?utm_source=blog&utm_medium=glossary&utm_campaign=none_coding_frpro_blog_glossary_course_none_none_all_sf_soap-api_barbanner&utm_content=soap-api&utm_term=barbanner)

[Освойте профессию «Frontend-разработчик»](https://skillfactory.ru/frontend-razrabotchik-pro/?utm_source=blog&utm_medium=glossary&utm_campaign=none_coding_frpro_blog_glossary_course_none_none_all_sf_soap-api_barbanner&utm_content=soap-api&utm_term=barbanner)

IT-рентген

Бесплатный профориентационный проект  
  
Пройдите тест и определите ваше направление в IT. Выигрывайте призы, получайте подарки и личный план развития через бесплатные гайды и карьерную консультацию

Участвовать бесплатно

![cables (4)](https://blog.skillfactory.ru/wp-content/uploads/2024/07/cables-4.png)

[IT-рентген](https://free.skillfactory.ru/itrentgen-s?utm_source=blog&utm_medium=glossary&utm_campaign=np_sf_all_blog_glossary_lp_itrentgen-4_none_all_sf_soap-api_sidebanner_picture_fix&utm_content=soap-api&utm_term=sidebanner_picture_fix)

## Особенности SOAP API

SOAP может использоваться с протоколами SMTP, FTP, [HTTP](https://blog.skillfactory.ru/glossary/http/), HTTPS. Чаще всего — с HTTP как с наиболее универсальным: его поддерживают все браузеры и серверы. Корректное SOAP-сообщение состоит из нескольких структурных элементов: Envelope, Header, Body и Fault.

![](https://blog.skillfactory.ru/wp-content/uploads/2023/02/soap-2-1670174.png)

Структура SOAP-сообщения

**Envelope («конверт»).** Это корневой элемент. Определяет [XML-документ](https://blog.skillfactory.ru/glossary/xml/) как сообщение SOAP с помощью пространства имен _xmlns_soap=»http://www.w3.org/2003/05/soap-envelope/»._ Если в определении будет указан другой адрес, сервер вернет ошибку.

**Header («заголовок»).** Включает в себя атрибуты сообщения, связанные с конкретным приложением (аутентификация, проведение платежей и так далее). В заголовке могут использоваться три атрибута, которые указывают, как принимающая сторона должна обрабатывать сообщение, — _mustUnderstand_, _actor_ и _encodingStyle_**.** Значение _mustUnderstand_ — 1 или 0 — говорит принимающему приложению о том, следует ли распознавать заголовок в обязательном или опциональном порядке. Атрибут _actor_ задает конкретную конечную точку для сообщения. Атрибут _encodingStyle_ устанавливает специфическую кодировку для элемента. По умолчанию SOAP-сообщение не имеет определенной кодировки.

**Body («тело»).** Сообщение, которое передает веб-приложение. Может содержать запрос к серверу или ответ от него. Пример сообщения, которое запрашивает стоимость ноутбука в онлайн-магазине:

`_<?xml version="1.0"?> <soap:Envelope xmlns_soap="http://www.w3.org/2003/05/soap-envelope/" soap_encodingStyle="http://www.w3.org/2003/05/soap-encoding"> <soap:Body> <m:GetPrice xmlns_m="https://online-shop.ru/prices"> <m:Item>Dell Vostro 3515-5371</m:Item> </m:GetPrice> </soap:Body> </soap:Envelope>_`

Пример ответа сервера онлайн-магазина:

`_<?xml version="1.0"?> <soap:Envelope xmlns_soap="http://www.w3.org/2003/05/soap-envelope/" soap_encodingStyle="http://www.w3.org/2003/05/soap-encoding"> <soap:Body> <m:GetPriceResponse xmlns_m="https://online-shop.ru/prices"> <m:Price>37299</m:Price> </m:GetPriceResponse> </soap:Body> </soap:Envelope>_`

![](https://blog.skillfactory.ru/wp-content/uploads/2023/03/kartinka-58.png)

Станьте Frontend-разработчиком  
и создавайте интерфейсы сервисов, которыми пользуются все

[Подробнее](https://skillfactory.ru/frontend-razrabotchik-pro/?utm_source=blog&utm_medium=glossary&utm_campaign=none_coding_frpro_blog_glossary_course_none_none_all_sf_soap-api_mediumbanner&utm_content=soap-api&utm_term=mediumbanner)

[Станьте Frontend-разработчикоми создавайте интерфейсы сервисов, которыми пользуются все](https://skillfactory.ru/frontend-razrabotchik-pro/?utm_source=blog&utm_medium=glossary&utm_campaign=none_coding_frpro_blog_glossary_course_none_none_all_sf_soap-api_mediumbanner&utm_content=soap-api&utm_term=mediumbanner)

**Fault** **(«ошибка»)**. Опциональный элемент. Передает уведомление об ошибках, если они возникли в ходе обработки сообщения. Может содержать вложенные элементы, которые проясняют причину возникновения ошибки:

- faultcode — код неполадки;
- faultstring — «человекопонятное» описание проблемы;
- faultactor — информация о программном компоненте, который вызвал ошибку;
- detail — дополнительные сведения о месте возникновения неполадки.

Читайте также[Кто такой frontend-разработчик?](https://blog.skillfactory.ru/kto-takoj-frontend/) 

## Отличия SOAP от REST

SOAP — протокол, а REST — архитектурный стиль, набор правил по написанию кода. REST был представлен в 2000 году. К этому времени недостатки SOAP были очевидны:

- объемные сообщения;
- поддержка только одного формата — XML;
- схема работы по принципу «один запрос — один ответ»;
- смена описания веб-сервиса может нарушить работу клиента.

Разработчик стиля REST Рой Филдинг учел недостатки SOAP. REST поддерживает несколько форматов помимо XML: [JSON](https://blog.skillfactory.ru/glossary/json/), TXT, CSV, [HTML](https://blog.skillfactory.ru/glossary/html/). Вместо создания громоздкой структуры XML-запросов при использовании REST чаще всего можно передать нужный URL. Эти особенности делают стиль REST простым и понятным, а приложения и веб-сервисы, использующие его, отличаются высокой производительностью и легко масштабируются.

Пример простого URL-запроса, возвращающего результаты поиска по ключевому слову DNA («ДНК»), можно посмотреть в международной базе научных статей.

Несмотря на простоту использования, у REST есть ряд недостатков, которые отсутствуют у SOAP:

- при использовании REST сложнее обеспечить безопасность конфиденциальных данных;
- трудности с проведением операций, которым необходимо сохранение состояния. Как, например, в случае с корзиной в онлайн-магазине, которая должна сохранять добавленные товары до момента оплаты.

Основные различия SOAP и REST API мы собрали в таблице для большей наглядности:

|Особенности|SOAP API|REST API|
|---|---|---|
|Тип протокола|SOAP является протоколом сообщений.|REST является архитектурным стилем.|
|Протокол обмена данными|XML|Различные форматы, чаще всего JSON.|
|Транспортный протокол|Может использовать разные транспортные протоколы, но чаще всего использует HTTP, SMTP, TCP и т. д.|Использует преимущественно HTTP.|
|WS-* стандарты|SOAP поддерживает стандарты WS-Security, WS-ReliableMessaging, WS-AtomicTransaction и другие.|REST не определяет стандарты безопасности и надежности. Но может использовать дополнительные стандарты, если необходимо.|
|Stateful / Stateless|Может быть как stateful, так и stateless.|RESTful API обычно stateless.|
|Разработка|Более сложная разработка и более объемный размер сообщений из-за XML.|Проще разработка и более легкий размер сообщений благодаря JSON и другим легковесным форматам.|
|Кэширование|Обычно имеет ограниченную поддержку кэширования.|Поддерживает хорошее кэширование на уровне HTTP.|
|Модель безопасности|Следует стандартам WS-Security для безопасности.|Использует HTTPS для обеспечения безопасности. Также может использовать токены авторизации, как OAuth.|
|Поддержка|Имеет более широкую поддержку в старых системах и в предприятии.|Популярен в веб-приложениях и мобильных приложениях. Широко используется в RESTful веб-сервисах.|

## В каких случаях используют SOAP

- Асинхронная обработка и последующий вызов. Стандарт SOAP 1.2 обеспечивает клиенту гарантированный уровень надежности и безопасности.
- Формальное средство коммуникации. Если клиент и сервер имеют соглашение о формате обмена, то SOAP 1.2 предоставляет жесткие спецификации для такого типа взаимодействия. Пример — сайт онлайн-покупок, на котором пользователи добавляют товары в корзину перед оплатой. Предположим, что есть веб-служба, которая выполняет окончательный платеж. Может быть достигнуто соглашение, что веб-сервис будет принимать только название товара, цену за единицу и количество. Если сценарий существует, лучше использовать протокол SOAP.
- Операции с состоянием. Если приложение требует, чтобы состояние сохранялось от одного запроса к другому, то стандарт SOAP 1.2 предоставляет структуру для поддержки таких требований.