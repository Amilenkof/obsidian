
Имплементим интерфейс `UserDetails`, он содержит необходимые методы для работы секьюрити, которые должны переопределить.
`UserDetail` это обертка над нашей сущностью `User` (entity)
~~~java
@RequiredArgsConstructor  
public class UserDetailsImpl implements UserDetails {  
  
    private final User user;  
  
    @Override  
    public Collection<? extends GrantedAuthority> getAuthorities() {  
        return null;  
    }  
  
    @Override  
    public String getPassword() {  
        return user.getPassword();  
    }  
  
    @Override  
    public String getUsername() {  
        return user.getEmail();  
    }  
  
    // Аккаунт не просрочен  
    @Override  
    public boolean isAccountNonExpired() {  
        return true;  
    }  
  
    // Аккаунт не заблокирован  
    @Override  
    public boolean isAccountNonLocked() {  
        return true;  
    }  
  
    // Пароль не просрочен  
    @Override  
    public boolean isCredentialsNonExpired() {  
        return true;  
    }  
  
    // Аккаунт включен  
    @Override  
    public boolean isEnabled() {  
        return true;  
    }  
}
~~~

~~~java

~~~