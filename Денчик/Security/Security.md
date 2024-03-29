#### [Баелданк секурити](https://www.baeldung.com/security-spring)
### Сущности
~~~java
// Сущность 
public class User {
	private long id;
	private String email;
	private String password;
	private String firstName;
}
// ДТО к сущности
public class UserDto{
	private String userName;
	private String password;
	private String firstName;
}
~~~

### Регистрация пользователя
~~~java
public class AuthServise{

	private final PasswordEncoder encoder;

	public boolean register(UserDto userDto){
		User user = userMapper.toEntity(userDto);  
		if (userRepository.existsUserByEmailIgnoreCase(user.getEmail())){  
		    throw new ValidationException("Такой пользователь есть");  
		}  
		user.setPassword(encoder.encode(registerDto.getPassword()));  
		userRepository.save(user);
		return true;
	}
}
~~~

