package groovejames.service;

import java.lang.annotation.Documented;
import static java.lang.annotation.ElementType.PARAMETER;
import java.lang.annotation.Retention;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import java.lang.annotation.Target;

@Target(PARAMETER)
@Retention(RUNTIME)
@Documented
public @interface Param {

    String value();

}
