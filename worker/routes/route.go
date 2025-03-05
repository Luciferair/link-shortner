package routes

import (
	"shortener/store"
	"shortener/utils"

	"github.com/gofiber/fiber/v3"
)

func ShortenURLHandler(c fiber.Ctx) error {
	var req utils.ShortenRequest
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid JSON body",
		})
	}

	if req.URL == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Missing URL parameter",
		})
	}

	shortID := utils.GenerateShortID()
	err := store.SetURL(shortID, req.URL)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to store URL",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"ShortURL": shortID,
	})
}

func RedirectHandler(c fiber.Ctx) error {
	shortID := c.Params("shortID")
	longURL, err := store.GetURL(shortID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Short URL not found",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"url": longURL,
	})
}
