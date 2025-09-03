появляется когда есть поле помеченное @Lazy
то есть хибер делает такой запрос который не заполняет поле
чтобы поле заполнялось можно :
1 - сделать его Eager
2 - написать join fetch (тогда по сути это уже будет не Lazy тк мы всегда при построении обьекта будем тянуть эти данные)
3- написать entity graph - почти тоже что и 2 только другой синтаксис (вроде)
4- сделать вот такую дичь в рамках сессии 

   Session session = sessionFactory.openSession();
   User user = session.get(User.class, 1L);
   Hibernate.initialize(user.getOrders()); // Инициализируем коллекцию
   session.close();

   // Теперь коллекция доступна даже после закрытия сессии
   List<Order> orders = user.getOrders();
   
5- вот эта штука позволяет держать сессию открытой пока жив HTTP запрос - хз как. Но плохо тк происходит утечка ресурсов
@Configuration
public class HibernateConfig {

    @Bean
    public OpenEntityManagerInViewFilter openEntityManagerInViewFilter() {
        return new OpenEntityManagerInViewFilter();
    }
}

6- можно вернуть обьект в сессию ( про это явно нигде не пишут но должно работать )

Session session1 = sessionFactory.openSession();
User user = session1.get(User.class, 1L); // Загружаем пользователя
session1.close();

Session session2 = sessionFactory.openSession();
session2.update(user); // Присоединяем объект к новой сессии

// Теперь можно получить доступ к ленивым полям
List<Order> orders = user.getOrders(); // Работает!
session2.close();
