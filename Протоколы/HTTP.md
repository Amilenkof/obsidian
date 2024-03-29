# ПРОТОКОЛ HTTP — ЧТО ТАКОЕ HYPERTEXT TRANSFER PROTOCOL

[

Подробнее

vscale.io

Перейти на сайт

![favicon](https://avatars.mds.yandex.net/get-direct/4733431/B9wJmGVIpMb2TpKqn6LnDw/x80)

](https://vscale.io/?utm_source=yandex&utm_medium=cpc&utm_campaign=VID-RUS-RG-INT/Vscale_Target-Segment_Display&utm_term=&utm_content=ch_yandex_direct|cid_108494197|gid_5418532565|ad_15941978038|ph_65613294|crt_1130802514|pst_none|ps_0|srct_context|src_webonto.ru|devt_desktop|ret_65613294|geo_51|cf_0|int_|tgt_65613294|add_no)

Реклама

Содержание статьи:

- [Протокол HTTP](https://webonto.ru/protokol-http/#%d0%9f%d1%80%d0%be%d1%82%d0%be%d0%ba%d0%be%d0%bb_http "Протокол HTTP")
- [URL](https://webonto.ru/protokol-http/#url "URL")
- [Методы HTTP запросов](https://webonto.ru/protokol-http/#%d0%9c%d0%b5%d1%82%d0%be%d0%b4%d1%8b_http_%d0%b7%d0%b0%d0%bf%d1%80%d0%be%d1%81%d0%be%d0%b2 "Методы HTTP запросов")
- [Методы HTTP](https://webonto.ru/protokol-http/#%d0%9c%d0%b5%d1%82%d0%be%d0%b4%d1%8b_http "Методы HTTP")
    - [Разберем методы HTTP подробнее](https://webonto.ru/protokol-http/#%d0%a0%d0%b0%d0%b7%d0%b1%d0%b5%d1%80%d0%b5%d0%bc_%d0%bc%d0%b5%d1%82%d0%be%d0%b4%d1%8b_http_%d0%bf%d0%be%d0%b4%d1%80%d0%be%d0%b1%d0%bd%d0%b5%d0%b5 "Разберем методы HTTP подробнее")
- [Группы кодов состояния](https://webonto.ru/protokol-http/#%d0%93%d1%80%d1%83%d0%bf%d0%bf%d1%8b_%d0%ba%d0%be%d0%b4%d0%be%d0%b2_%d1%81%d0%be%d1%81%d1%82%d0%be%d1%8f%d0%bd%d0%b8%d1%8f "Группы кодов состояния")
    - [Статьи раздела: Интернет технологии](https://webonto.ru/protokol-http/#%d0%a1%d1%82%d0%b0%d1%82%d1%8c%d0%b8_%d1%80%d0%b0%d0%b7%d0%b4%d0%b5%d0%bb%d0%b0_%d0%98%d0%bd%d1%82%d0%b5%d1%80%d0%bd%d0%b5%d1%82_%d1%82%d0%b5%d1%85%d0%bd%d0%be%d0%bb%d0%be%d0%b3%d0%b8%d0%b8 "Статьи раздела: Интернет технологии")

[VK](https://webonto.ru/#vk "VK")[Odnoklassniki](https://webonto.ru/#odnoklassniki "Odnoklassniki")[Mail.Ru](https://webonto.ru/#mail_ru "Mail.Ru")[Telegram](https://webonto.ru/#telegram "Telegram")[Pinterest](https://webonto.ru/#pinterest "Pinterest")

## Протокол HTTP

Протокол HTTP или HyperText Transfer Protocol это главный прокол [сервиса Интернет WWW](http://webonto.ru/www-samyiy-izvestnyiy-servis-internet/ "WWW самый известный сервис Интернет") (всемирной паутины). Основная задача протокола, обеспечить передачу гипертекста в сети. В протоколе точно описывается формат сообщений, для обмена клиентов и серверов.

Описан протокол HTTP в RFC 2616(HTTP1.1).

Основа протокола обеспечить взаимодействие клиента и сервера по средством одного ASCII-запроса, и следующего на него ответа в стандарте RFC 822 MIME.

На практике протокол HTTP работает на основе [TCP/IP](http://webonto.ru/protokolyi-tcp-ip-prostyim-yazyikom/ "Протоколы TCP/IP простым языком") порт 80, но можно настроить и по-другому. И хоть TCP/IP не является обязательным, он остается предпочтительным, так как берет на себя разбиение и сборку сообщений на себя и не «напрягает» ни браузер, ни сервер.

[

Подробнее

cloud.vk.com

Узнать больше

![favicon](https://avatars.mds.yandex.net/get-direct/4628184/ijQCPAcZ9NpUZpQ4Vl49Sw/x80)

](https://cloud.vk.com/?mt_link_id=m58ye2&mt_network=360YandexOLV&mt_campaign=360YandexOLV_VKCloud_media-marapr24_WEB_CPM_RU(1mln+)_all25-54/LIST(prof-it/Int-business)_Takhtamyshev_21/03/2024_15s25s_mc(video-skip)&mt_creative=15s25s&mt_adset=15982531819&mt_sub1=webonto.ru&mt_sub2=360YandexOLV_VKCloud_media-marapr24_WEB_CPM_RU(1mln+)_all25-54/LIST(prof-it/Int-business)_Takhtamyshev_21/03/2024_15s25s_mc(video-skip)&mt_sub3=CPM&mt_sub4=15982531819&mt_sub5=108922472&utm_source=360YandexOLV&utm_term=15s25s&utm_content=15982531819&utm_campaing=360YandexOLV_VKCloud_media-marapr24_WEB_CPM_RU(1mln+)_all25-54/LIST(prof-it/Int-business)_Takhtamyshev_21/03/2024_15s25s_mc(video-skip)&utm_medium=CPM)

Реклама

Следует отметить, что протокол HTTP может использоваться не только в веб-технологиях, но и других ООП приложениях (объективно-ориентированных).

## URL

Основой  веб-общения клиент-сервер является запрос. Запрос отправляется при помощи URL– единого указателя ресурсов Интернет. Напомню, что такое URL адрес.

[

Подробнее

media.staffcop.ru

Смотреть

![favicon](https://favicon.yandex.net/favicon/media.staffcop.ru?size=32&stub=1)

](https://media.staffcop.ru/install/?utm_ad=15839902456&utm_medium=cpm&utm_source=YandexDirect&utm_campaign=kontur-sc-media&utm_content=article_1_step_video|tid|64380847_64380847|src|context|dev|desktop|rgn|%D0%A1%D0%B0%D0%BC%D0%B0%D1%80%D0%B0|mtp|&utm_term=)

Реклама

[![Протокол HTTP](http://webonto.ru/wp-content/uploads/2014/06/url.png)](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[

](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[

](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[

](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[

](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)[

Подробнее

sovcombank.ru

Перейти на сайт

![favicon](https://avatars.mds.yandex.net/get-direct/4902855/RK3EHbxTzWKrjdsVeMh4Zw/x80)

](https://wcm-ru.frontend.weborama.fr/fcgi-bin/dispatch.fcgi?a.A=cl&erid=[ERID]&a.si=8947&a.te=20463&a.ra=%25aw_random%25&g.lu=)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)Реклама

[](http://webonto.ru/wp-content/uploads/2014/06/url.png)

Понятная и простая структура URL состоит из следующих элементов:

[

Подробнее

kari.com

Перейти на сайт

![favicon](https://avatars.mds.yandex.net/get-direct/4966934/b1ECv44fRQUX_91LA6o45A/x80)

](https://amc.yandex.ru/show?cmn_id=53960&plt_id=182695&crv_id=440860&evt_t=click&ad_type=video&rnd=-aw_random-&utm_source=yandex-videonetwork&utm_medium=cpm&utm_campaign=sl_kari_running-shoes_olv_all-roll_samara_1_2024_custom&utm_content=all18-54_02697-0003&utm_term=![sdt]&erid=![erir0])

Реклама

- Протокол;
- Хост;
- Порт;
- Каталок ресурса;
- Метки (Запрос).

Примечание: Протокол http это протокол для простых, не защищенных соединений. Защищенные соединения работают по протоколу https. Он более безопасен для обмена данными.

[

Статьи по теме:  Как создать зеркало сайта

](https://webonto.ru/kak-sozdat-zerkalo-sayta/)

## Методы HTTP запросов

Один из параметров URL,  определяет название хоста, с которым мы хотим общаться. Но этого мало. Нужно определить действие, которое нужно совершить. Сделать это можно при помощи метода определенного протоколом HTTP.

## Методы HTTP

- Метод/Описание
- HEAD/Прочитать заголовок веб-страницы
- GET/Прочитать веб-страницу
- POST/Добавить к веб-странице
- PUT/Сохранить веб-страницу
- TRACE/Отослать назад запрос
- DELETE/Удалить веб-страницу
- OPTIONS/Отобразить параметры
- CONNECT/Зарезервировано для будущего использования

### Разберем методы HTTP подробнее

**Метод GET.** запрашивает страницу (файл, объект), закодированную по стандарту MIME. Это самый употребляемый метод. Структура метода:  
GET имя_файла HTTP/1.1

**Метод HEAD.** Этот метод запрашивает заголовок сообщения. При этом страница не загружается. Этот метод позволяет узнать время последнего обновления страницы, что нужно для управления КЭШем страниц. Этот метод позволяет проверить работоспособность запрашиваемого URL.

**Метод PUT.** Этот метод может поместить страницу на сервер. Тело запроса PUT включает размещаемую страницу, которая закодирована по MIME. Это метод требует идентификации клиента.

**Метод POST.** Этот метод добавляет содержимое к уже имеющейся странице. Используется, как пример, для добавления записи на форум.

**Метод DELETE.** Этот метод уничтожает страницу. Метод удаления требует подтверждения прав пользователя на удаление.

**Метод TRACE.** Этот метод отладки. Он указывает серверу отослать запрос назад и позволяет узнать, искажается или нет, запрос клиента, вернувшись от сервера.

**Метод CONNECT** – метод резерва, не используется.

**Метод OPTIONS** позволяет запросить свойства сервера и свойства любого файла.

[

Статьи по теме:  Что такое RSS, простыми словами о сервисе автоматического распространения контента

](https://webonto.ru/chto-takoe-rss-prostymi-slovami/)

В общении клиента и сервера «запрос-ответ», сервер обязательно генерирует ответ. Это может быть веб-страница или строку состояния с кодом состояния. Код состояния вам хорошо известен. Один из кодов известный код 404 –Страница не найдена.

## Группы кодов состояния

1хх: Готовность сервера, Код 100 – сервер готов обрабатывать запросы клиента;

2хх: Успех.

- Код 200 – запрос обработан успешно;
- Код  204 – Содержимого нет.

3хх: Перенаправление.

- Код 301 – Запрашиваемая страница перенесена;
- Код 304 – Страница в КЭШе еще актуальна.

4хх: Ошибка клиента.

- Код 403 – Ошибка доступа;
- Код 404 – Страница не найдена.

5хх: Ошибки сервера

- Код 500 – Ошибка сервера внутренняя;
- Код 503 – Предпринять попытку запроса позже.