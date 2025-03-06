package main

import (
	"fmt"
	"math/rand"
	"shortener/middleware"
	"shortener/routes"
	"time"

	"github.com/gofiber/fiber/v3"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func main() {
	app := fiber.New()
	app.Use(func(c fiber.Ctx) error {
		allowedOrigin := "https://shortify-link-shortener.vercel.app"
		c.Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Content-Type")

		if c.Method() == "OPTIONS" {
			return c.SendStatus(fiber.StatusNoContent)
		}

		return c.Next()
	})

	app.Use(middleware.RateLimitMiddleware)

	// Routes
	app.Post("/shorten", routes.ShortenURLHandler)
	app.Get("/:shortID", routes.RedirectHandler)

	fmt.Println("Server running on :8080")
	if err := app.Listen(":8080"); err != nil {
		fmt.Println("Server error:", err)
	}
}
