package groovejames.util;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.Map;

public class JsonMarshaller {

    @SuppressWarnings({"unchecked"})
    public static Object marshall(Object obj) {
        try {
            if (obj == null) {
                return null;
            } else if (obj instanceof Enum) {
                return ((Enum) obj).name();
            } else if (obj instanceof String || obj instanceof Number || obj instanceof Boolean) {
                return obj;
            } else if (obj instanceof Map) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.putAll((Map) obj);
                return jsonObject;
            } else if (obj instanceof Collection) {
                JSONArray jsonArray = new JSONArray();
                jsonArray.addAll((Collection) obj);
                return jsonArray;
            } else {
                return marshallBean(obj);
            }
        } catch (Exception ex) {
            throw new RuntimeException("error marshalling object" + (obj != null ? " of type " + obj.getClass() : ""), ex);
        }
    }

    @SuppressWarnings({"unchecked"})
    private static JSONObject marshallBean(Object obj) throws IntrospectionException, InvocationTargetException, IllegalAccessException {
        BeanInfo beanInfo = Introspector.getBeanInfo(obj.getClass());
        JSONObject jsonObject = new JSONObject();
        for (PropertyDescriptor propertyDescriptor : beanInfo.getPropertyDescriptors()) {
            String propertyName = propertyDescriptor.getName();
            if (!"class".equals(propertyName) && propertyDescriptor.getReadMethod() != null) {
                Object value = propertyDescriptor.getReadMethod().invoke(obj);
                Object jsonValue = marshall(value);
                jsonObject.put(propertyName, jsonValue);
            }
        }
        return jsonObject;
    }
}
