package com.hobbyheaven.storage

import com.hobbyheaven.config.StorageConfig
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.util.*

@Service
class StorageService(private val storageConfig: StorageConfig) {

    /**
     * Save a pattern cover image. Returns the relative path stored in the DB.
     * e.g. "patterns/images/abc123.jpg"
     */
    fun savePatternImage(patternId: UUID, file: MultipartFile): String {
        val ext = file.originalFilename?.substringAfterLast('.', "jpg") ?: "jpg"
        val filename = "$patternId.$ext"
        val destination = storageConfig.patternsImagePath().resolve(filename)
        file.inputStream.use { input ->
            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING)
        }
        return "patterns/images/$filename"
    }

    /**
     * Save a step image. Returns the relative path.
     * e.g. "patterns/steps/abc123_step2.jpg"
     */
    fun saveStepImage(patternId: UUID, stepNumber: Int, file: MultipartFile): String {
        val ext = file.originalFilename?.substringAfterLast('.', "jpg") ?: "jpg"
        val filename = "${patternId}_step${stepNumber}.$ext"
        val destination = storageConfig.patternsStepsPath().resolve(filename)
        file.inputStream.use { input ->
            Files.copy(input, destination, StandardCopyOption.REPLACE_EXISTING)
        }
        return "patterns/steps/$filename"
    }

    /**
     * Resolve a relative stored path to an absolute path on disk.
     */
    fun resolve(relativePath: String) = storageConfig.rootPath.resolve(relativePath)

    /**
     * Delete a file by its relative path. Silently ignores missing files.
     */
    fun delete(relativePath: String) {
        val path = storageConfig.rootPath.resolve(relativePath)
        Files.deleteIfExists(path)
    }
}
