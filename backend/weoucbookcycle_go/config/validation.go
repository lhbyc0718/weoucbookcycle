package config

import (
	"fmt"
	"log"
	"os"
)

/**
 * ValidateRequiredEnv 验证必需的环境变量
 *
 * 检查以下环境变量：
 * - JWT_SECRET: JWT签名密钥（必需）
 * - DB_HOST: 数据库主机（必需）
 * - DB_USER: 数据库用户（必需）
 * - DB_PASSWORD: 数据库密码（必需）
 * - DB_NAME: 数据库名称（必需）
 * - REDIS_HOST: Redis主机（可选，作为缓存）
 *
 * @return error 如果缺少必需的环境变量，返回错误
 */
func ValidateRequiredEnv() error {
	requiredEnvs := []string{
		"JWT_SECRET",
		"DB_HOST",
		"DB_USER",
		"DB_PASSWORD",
		"DB_NAME",
	}

	var missingEnvs []string
	for _, env := range requiredEnvs {
		if value := os.Getenv(env); value == "" {
			missingEnvs = append(missingEnvs, env)
		}
	}

	if len(missingEnvs) > 0 {
		return fmt.Errorf("缺少必需的环境变量: %v", missingEnvs)
	}

	return nil
}

/**
 * ValidateDatabase 验证数据库连接
 *
 * 进行简单的Ping测试确保数据库可用
 *
 * @param sqlDB *sql.DB 数据库连接对象
 * @return error 如果连接失败，返回错误
 */
func ValidateDatabase(sqlDB interface{}) error {
	if sqlDB == nil {
		return fmt.Errorf("数据库连接为nil")
	}

	// 这里假设sqlDB是*sql.DB类型，可以调用Ping
	type pinger interface {
		Ping() error
	}

	if db, ok := sqlDB.(pinger); ok {
		if err := db.Ping(); err != nil {
			return fmt.Errorf("数据库连接验证失败: %w", err)
		}
	}

	return nil
}

/**
 * ValidateRedis 验证Redis连接（可选）
 *
 * Redis是可选的，用于缓存。如果可用将使用，否则仅记录警告
 *
 * @param redisClient interface{} Redis客户端对象
 * @return error 返回错误但不会导致应用启动失败
 */
func ValidateRedis(redisClient interface{}) error {
	if redisClient == nil {
		log.Println("[warning] Redis 客户端未初始化，缓存功能将被禁用")
		return nil
	}

	// 这里假设redisClient有一个Ping方法
	type redisClienter interface {
		Ping() (string, error)
	}

	if client, ok := redisClient.(redisClienter); ok {
		if _, err := client.Ping(); err != nil {
			log.Printf("[warning] Redis 连接失败: %v，缓存功能将被禁用\n", err)
			return nil // Redis失败不应该影响应用启动
		}
	}

	return nil
}

/**
 * PrintStartupInfo 打印启动信息
 *
 * 输出应用启动时的配置信息，便于调试和监控
 *
 * @param port string 应用监听端口
 * @param apiBase string API基础路径
 * @param useCloud bool 是否使用云函数
 */
func PrintStartupInfo(port string, apiBase string, useCloud bool) {
	fmt.Println("\n========== Book Cycle Application ==========")
	fmt.Printf("📍 Server Port: %s\n", port)
	fmt.Printf("🔗 API Base: %s\n", apiBase)

	if useCloud {
		fmt.Println("☁️  Cloud Functions: ENABLED")
	} else {
		fmt.Println("☁️  Cloud Functions: DISABLED")
	}

	fmt.Printf("🔐 JWT Secret: %s\n", maskString(os.Getenv("JWT_SECRET")))
	fmt.Printf("🗄️  Database: %s@%s/%s\n",
		os.Getenv("DB_USER"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"),
	)

	if os.Getenv("REDIS_HOST") != "" {
		fmt.Printf("💾 Redis: %s:%s\n",
			os.Getenv("REDIS_HOST"),
			os.Getenv("REDIS_PORT"),
		)
	}

	fmt.Println("=============================================\n")
}

/**
 * maskString 掩盖敏感字符串（仅显示前后3个字符）
 *
 * @param s string 要掩盖的字符串
 * @return string 掩盖后的字符串
 */
func maskString(s string) string {
	if len(s) <= 6 {
		return "***"
	}
	return s[:3] + "***" + s[len(s)-3:]
}
