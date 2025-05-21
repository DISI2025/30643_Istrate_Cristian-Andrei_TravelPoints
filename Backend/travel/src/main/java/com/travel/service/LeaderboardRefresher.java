package com.travel.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardRefresher {

    private final LeaderboardCache leaderboardCache;

    public LeaderboardRefresher(LeaderboardCache leaderboardCache) {
        this.leaderboardCache = leaderboardCache;
    }

    @Scheduled(cron = "0 15 17 * * *") // At 17:15 every day
    public void refreshLeaderboardCache() {
        System.out.println("Refreshing Redis leaderboard cache at 17:15...");

        leaderboardCache.clear();

        System.out.println("Cache refresh complete.");
    }
}
