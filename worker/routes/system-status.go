package routes

import (
	"os"
	"runtime"
	"shortener/services"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/shirou/gopsutil/v3/process"
)

type Sysbody struct {
	Passkey string `json:"passkey"`
}

func SystemStatusHandler(c *fiber.Ctx) error {
	passkey := os.Getenv("PASS_KEY")

	var req Sysbody

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid JSON body",
		})
	}

	if req.Passkey != passkey {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Unauthorized",
		})
	}

	p, err := process.NewProcess(int32(os.Getpid()))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	mem, err := p.MemoryInfo()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to get memory info: " + err.Error()})
	}

	redisLatency, err := services.MeasureRedisLatency()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Redis latency check failed: " + err.Error()})
	}

	var rtm runtime.MemStats
	runtime.ReadMemStats(&rtm)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "ok",
		"memory": fiber.Map{
			"rss":         fmt.Sprintf("%.2f MB", float64(mem.RSS)/(1024*1024)),       
			"goroutines":  runtime.NumGoroutine(),
		},
		"redis": fiber.Map{
			"latency_ms": redisLatency,
			"connected":  err == nil,
		},
	})
}
