package groovejames.util;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Set;
import java.util.TreeSet;

public class JsonUnmarshaller {

    private static final Log log = LogFactory.getLog(JsonUnmarshaller.class);
    private static final boolean checkForUnusedParameters = false;

    public Object unmarshall(Object jsonResult, Class<?> type) {
        try {
            if (type.isArray())
                return unmarshallArray(jsonResult, type.getComponentType());
            else
                return unmarshallObject(jsonResult, type);
        } catch (Exception ex) {
            throw new RuntimeException("error unmarshalling object of type " + type, ex);
        }
    }

    private Object unmarshallObject(Object jsonResult, Class<?> type) throws InstantiationException, IllegalAccessException, IntrospectionException, InvocationTargetException {
        if (jsonResult == null)
            return null;
        if (!(jsonResult instanceof JSONObject))
            throw new RuntimeException("expected JSONObject, got " + jsonResult.getClass() + ", for type " + type);
        JSONObject jsonObject = (JSONObject) jsonResult;
        Object result = type.newInstance();
        BeanInfo beanInfo = Introspector.getBeanInfo(type);
        Set<String> usedPropertyNames = new TreeSet<String>();
        for (PropertyDescriptor propertyDescriptor : beanInfo.getPropertyDescriptors()) {
            String propertyName = propertyDescriptor.getName();
            if (!"class".equals(propertyName)) {
                Object value = jsonObject.get(propertyName);
                if (value == null) {
                    // try again capitalized or decapitalized
                    if (Character.isLowerCase(propertyName.charAt(0)))
                        propertyName = Util.capitalize(propertyName);
                    else
                        propertyName = Util.decapitalize(propertyName);
                    value = jsonObject.get(propertyName);
                }
                if (value != null && (value instanceof JSONObject || value instanceof JSONArray))
                    value = unmarshall(value, propertyDescriptor.getPropertyType());
                if (value != null) {
                    if (log.isTraceEnabled()) log.trace("set " + propertyName + " = " + value);
                    Method writeMethod = propertyDescriptor.getWriteMethod();
                    if (value instanceof String)
                        value = Util.coerce((String) value, propertyDescriptor.getPropertyType());
                    writeMethod.invoke(result, value);
                    usedPropertyNames.add(propertyName);
                }
            }
        }
        if (checkForUnusedParameters)
            for (Object key : jsonObject.keySet())
                if (!usedPropertyNames.contains(key.toString()))
                    log.warn("unused json result parameter: " + key);
        return result;
    }

    private Object[] unmarshallArray(Object jsonResult, Class<?> componentType) {
        if (!(jsonResult instanceof JSONArray))
            throw new RuntimeException("expected JSONArray, got " + jsonResult.getClass() + ", for component type " + componentType);
        JSONArray jsonArray = (JSONArray) jsonResult;
        int size = jsonArray.size();
        Object[] array = (Object[]) Array.newInstance(componentType, size);
        for (int i = 0; i < size; i++) {
            array[i] = unmarshall(jsonArray.get(i), componentType);
        }
        return array;
    }

}