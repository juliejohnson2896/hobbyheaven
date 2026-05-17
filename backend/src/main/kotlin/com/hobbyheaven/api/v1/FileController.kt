package com.hobbyheaven.api.v1

import com.hobbyheaven.storage.StorageService
import org.springframework.core.io.FileSystemResource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/files")
class FileController(private val storageService: StorageService) {

    /**
     * Serve any stored file by its relative path.
     * e.g. GET /api/v1/files/patterns/images/abc123.jpg
     */
    @GetMapping("/**")
    fun serveFile(@RequestParam("path") relativePath: String): ResponseEntity<FileSystemResource> {
        val file = storageService.resolve(relativePath)
        if (!file.toFile().exists()) return ResponseEntity.notFound().build()

        val mediaType = when (file.toFile().extension.lowercase()) {
            "jpg", "jpeg" -> MediaType.IMAGE_JPEG
            "png"         -> MediaType.IMAGE_PNG
            "gif"         -> MediaType.IMAGE_GIF
            "webp"        -> MediaType.parseMediaType("image/webp")
            "pdf"         -> MediaType.APPLICATION_PDF
            else          -> MediaType.APPLICATION_OCTET_STREAM
        }

        return ResponseEntity.ok()
            .contentType(mediaType)
            .body(FileSystemResource(file))
    }
}
