package middleware

import (
	"shortener/utils"
	"sync"

	"golang.org/x/time/rate"

	"github.com/gofiber/fiber/v3"
)

var ipLimiters = make(map[string]*rate.Limiter)
var mu sync.Mutex

func getLimiter(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()
	if limiter, exists := ipLimiters[ip]; exists {
		return limiter
	}
	newLimiter := rate.NewLimiter(1, 5)
	ipLimiters[ip] = newLimiter
	return newLimiter
}

func RateLimitMiddleware(c fiber.Ctx) error {
	ip := c.IP()
	limiter := getLimiter(ip)
	if !limiter.Allow() {
		return c.Status(fiber.StatusTooManyRequests).JSON(utils.ErrorResponse{
			Error: "Too Many Requests",
		})
	}
	return c.Next()
}
