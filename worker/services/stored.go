package services

import (
	"bytes"
	"compress/gzip"
	"encoding/base64"
	"io"
	"time"
)

const (
	OneWeekTTL = 7 * 24 * time.Hour
)

func compressData(data string) (string, error) {
	var b bytes.Buffer
	gz := gzip.NewWriter(&b)
	if _, err := gz.Write([]byte(data)); err != nil {
		return "", err
	}
	if err := gz.Close(); err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(b.Bytes()), nil
}

func decompressData(compressedData string) (string, error) {
	decoded, err := base64.StdEncoding.DecodeString(compressedData)
	if err != nil {
		return "", err
	}

	gr, err := gzip.NewReader(bytes.NewReader(decoded))
	if err != nil {
		return "", err
	}
	defer gr.Close()

	data, err := io.ReadAll(gr)
	if err != nil {
		return "", err
	}

	return string(data), nil
}

func SetURL(shortID, url string) error {
	compressedURL, err := compressData(url)
	if err != nil {
		return err
	}
	return Client.Set(Ctx, shortID, compressedURL, OneWeekTTL).Err()
}

func GetURL(shortID string) (string, error) {
	compressedURL, err := Client.Get(Ctx, shortID).Result()
	if err != nil {
		return "", err
	}

	return decompressData(compressedURL)
}


func MeasureRedisLatency() (float64, error) {
	start := time.Now()

	err := Client.Ping(Ctx).Err()
	if err != nil {
		return 0, err
	}

	latency := float64(time.Since(start).Microseconds()) / 1000.0

	return latency, nil
}
