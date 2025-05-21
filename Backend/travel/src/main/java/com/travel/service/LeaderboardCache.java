package com.travel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class LeaderboardCache {

    private static final String LEADERBOARD_KEY = "leaderboard";

    private final ZSetOperations<String, String> zSetOps;

    @Autowired
    public LeaderboardCache(StringRedisTemplate redisTemplate) {
        this.zSetOps = redisTemplate.opsForZSet();
    }

    public void incrementScore(Long attractionId, double points) {
        zSetOps.incrementScore(LEADERBOARD_KEY, String.valueOf(attractionId), points);
    }

    public Set<ZSetOperations.TypedTuple<String>> getTop(int n) {
        return zSetOps.reverseRangeWithScores(LEADERBOARD_KEY, 0, n - 1);
    }

    public void clear() {
        zSetOps.getOperations().delete(LEADERBOARD_KEY);
    }
}
