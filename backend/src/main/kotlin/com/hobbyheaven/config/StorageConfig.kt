package com.hobbyheaven.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

@Configuration
class StorageConfig {

    @Value("\${hobbyheaven.storage.base-path:/data}")
    private lateinit var basePath: String

    val rootPath: Path by lazy {
        Paths.get(basePath).also { path ->
            // Ensure all required subdirectories exist on startup
            listOf(
                path,
                path.resolve("patterns/images"),
                path.resolve("patterns/files"),
                path.resolve("patterns/steps"),
            ).forEach { Files.createDirectories(it) }
        }
    }

    fun patternsImagePath(): Path = rootPath.resolve("patterns/images")
    fun patternsFilePath(): Path = rootPath.resolve("patterns/files")
    fun patternsStepsPath(): Path = rootPath.resolve("patterns/steps")
}
