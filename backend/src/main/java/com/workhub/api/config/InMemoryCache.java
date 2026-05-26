package com.workhub.api.config;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class InMemoryCache {

    private final ConcurrentHashMap<String, Entry> store = new ConcurrentHashMap<>();

    private record Entry(Object value, long expiresAtMs) {
        boolean expired() {
            return expiresAtMs > 0 && System.currentTimeMillis() > expiresAtMs;
        }
    }

    public void set(String key, Object value, long ttlSeconds) {
        long expiresAt = ttlSeconds > 0 ? System.currentTimeMillis() + ttlSeconds * 1000 : 0;
        store.put(key, new Entry(value, expiresAt));
    }

    public String getString(String key) {
        Object v = get(key);
        return v instanceof String s ? s : null;
    }

    public Integer getInt(String key) {
        Object v = get(key);
        if (v instanceof Integer i) return i;
        if (v instanceof Long l) return l.intValue();
        return null;
    }

    private Object get(String key) {
        Entry entry = store.get(key);
        if (entry == null) return null;
        if (entry.expired()) {
            store.remove(key);
            return null;
        }
        return entry.value();
    }

    public void delete(String key) {
        store.remove(key);
    }

    public long increment(String key, long ttlSeconds) {
        AtomicLong counter = new AtomicLong(0);
        store.compute(key, (k, existing) -> {
            long count = 1;
            long expiresAt = System.currentTimeMillis() + ttlSeconds * 1000;
            if (existing != null && !existing.expired() && existing.value() instanceof Number n) {
                count = n.longValue() + 1;
                expiresAt = existing.expiresAtMs;
            }
            counter.set(count);
            return new Entry(count, expiresAt);
        });
        return counter.get();
    }

    public long ttlSeconds(String key) {
        Entry entry = store.get(key);
        if (entry == null || entry.expiresAtMs <= 0) return 0;
        return Math.max(0, (entry.expiresAtMs - System.currentTimeMillis()) / 1000);
    }
}
