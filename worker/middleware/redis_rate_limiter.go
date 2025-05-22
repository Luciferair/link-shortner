package middleware

import (
	"fmt"
	"shortener/services"
	"time"

	"github.com/gofiber/fiber/v2"
)

const (
	RateLimitPrefix = "ratelimit:"
	BlockedPrefix   = "blocked:"
	MaxRequests     = 10
	BlockDuration   = 5 * time.Minute
	WindowSize      = 1 * time.Second
)

func checkRateLimit(ip string) bool {
	ctx := services.Ctx
	client := services.Client

	blockedKey := BlockedPrefix + ip
	blocked, _ := client.Exists(ctx, blockedKey).Result()
	if blocked > 0 {
		return false
	}

	requestKey := fmt.Sprintf("%s%s", RateLimitPrefix, ip)

	count, err := client.Get(ctx, requestKey).Int()
	if err != nil {
		pipe := client.Pipeline()
		pipe.Set(ctx, requestKey, 1, WindowSize)
		_, err = pipe.Exec(ctx)
		return err == nil
	}

	if count >= MaxRequests {
		pipe := client.Pipeline()
		pipe.Set(ctx, blockedKey, "blocked", BlockDuration)
		pipe.Del(ctx, requestKey)
		_, _ = pipe.Exec(ctx)
		return false
	}

	_ = client.Incr(ctx, requestKey).Err()
	return true
}

func getBlockedTimeRemaining(ip string) int {
	blockedKey := BlockedPrefix + ip
	ttl, err := services.Client.TTL(services.Ctx, blockedKey).Result()
	if err != nil || ttl.Seconds() < 0 {
		return 0
	}
	return int(ttl.Seconds())
}

func RedisRateLimitMiddleware(c *fiber.Ctx) error {
	ip := c.IP()

	if checkRateLimit(ip) {
		return c.Next()
	}

	remaining := getBlockedTimeRemaining(ip)

	return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
		"error":           "Too Many Requests",
		"retry_after_sec": remaining,
		"message":         fmt.Sprintf("Rate limit exceeded. Try again in %d seconds", remaining),
	})
}
