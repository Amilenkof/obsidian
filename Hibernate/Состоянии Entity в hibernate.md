
Состояние сущности (entity) в Hibernate — это жизненный цикл объекта, определяющий его связь с сессией и базой данных. Основных состояний четыре: **transient**, **persistent**, **detached** и **removed**.[stackoverflow+4](https://ru.stackoverflow.com/questions/702186/%D0%92-%D1%87%D0%B5%D0%BC-%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D1%86%D0%B0-%D0%BC%D0%B5%D0%B6%D0%B4%D1%83-transient-%D0%B8-detached-%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B9-hibernate-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9)

## Основные состояния сущности

- **Transient** — новая, только что созданная сущность, не связана ни с сессией, ни с базой данных. У объекта обычно нет идентификатора, его можно сохранить в сессии и перевести в persistent.[urvanov+1](https://urvanov.ru/2016/07/17/%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9-%D0%B2-hibernate/)
    
- **Persistent (Managed)** — сущность связана с сессией и соответствующей записью в базе данных. Все изменения отслеживаются и автоматически синхронизируются при коммите транзакции.[habr+2](https://habr.com/ru/articles/271115/)
    
- **Detached** — объект был persistent, но сессия завершена или объект отсоединён. Идентификатор есть, запись в БД есть, но изменения больше не отслеживаются.[profit247+3](https://www.profit247.ru/posts/407)
    
- **Removed** — сущность помечена на удаление. После коммита транзакции будет удалена из базы данных, но может ещё существовать в сессии.[javarush+2](https://javarush.com/quests/lectures/questhibernate.level11.lecture00)
    

## Переходы между состояниями

- Перевести transient в persistent можно через persist()/save(), а detached можно "присоединить" обратно с помощью merge()/update().[javastudy+2](https://javastudy.ru/interview/jee-hibernate-questions-answers/)
    
- После завершения сессии (или detach операции), persistent-объект становится detached.[habr+1](https://habr.com/ru/articles/271115/)
    
- Удаление происходит через remove()/delete(); такая сущность становится removed.[habr+2](https://habr.com/ru/articles/265061/)
    

## Роль состояний для разработчика

Понимание жизненного цикла позволяет правильно работать с кэшированием, оптимизировать транзакции, контролировать синхронизацию изменений и предотвращать ошибки при работе с объектами вне сессии.[profit247+2](https://www.profit247.ru/posts/407)

Эти состояния — ключ к эффективному использованию Hibernate и JPA в разработке корпоративных приложений.[urvanov+1](https://urvanov.ru/2016/07/17/%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9-%D0%B2-hibernate/)

1. [https://ru.stackoverflow.com/questions/702186/%D0%92-%D1%87%D0%B5%D0%BC-%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D1%86%D0%B0-%D0%BC%D0%B5%D0%B6%D0%B4%D1%83-transient-%D0%B8-detached-%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B9-hibernate-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9](https://ru.stackoverflow.com/questions/702186/%D0%92-%D1%87%D0%B5%D0%BC-%D1%80%D0%B0%D0%B7%D0%BD%D0%B8%D1%86%D0%B0-%D0%BC%D0%B5%D0%B6%D0%B4%D1%83-transient-%D0%B8-detached-%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D0%B9-hibernate-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9)
2. [https://javastudy.ru/interview/jee-hibernate-questions-answers/](https://javastudy.ru/interview/jee-hibernate-questions-answers/)
3. [https://habr.com/ru/articles/271115/](https://habr.com/ru/articles/271115/)
4. [https://sky.pro/wiki/java/kak-verno-prisoedinit-otsoedinennye-obyekty-v-hibernate/](https://sky.pro/wiki/java/kak-verno-prisoedinit-otsoedinennye-obyekty-v-hibernate/)
5. [https://urvanov.ru/2016/07/17/%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9-%D0%B2-hibernate/](https://urvanov.ru/2016/07/17/%D1%81%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D0%BD%D0%B8%D1%8F-%D1%81%D1%83%D1%89%D0%BD%D0%BE%D1%81%D1%82%D0%B5%D0%B9-%D0%B2-hibernate/)
6. [https://skyeng.ru/it-industry/programming/uznayte-chto-takoe-java-hibernate-i-kak-on-rabotaet/](https://skyeng.ru/it-industry/programming/uznayte-chto-takoe-java-hibernate-i-kak-on-rabotaet/)
7. [https://javarush.com/quests/lectures/questhibernate.level11.lecture00](https://javarush.com/quests/lectures/questhibernate.level11.lecture00)
8. [https://habr.com/ru/articles/416851/](https://habr.com/ru/articles/416851/)
9. [https://www.profit247.ru/posts/407](https://www.profit247.ru/posts/407)
10. [https://habr.com/ru/articles/265061/](https://habr.com/ru/articles/265061/)