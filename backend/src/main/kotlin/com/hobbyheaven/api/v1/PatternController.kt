package com.hobbyheaven.api.v1

import com.hobbyheaven.domain.Difficulty
import com.hobbyheaven.service.PatternService
import com.hobbyheaven.storage.StorageService
import jakarta.validation.Valid
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.util.*

@RestController
@RequestMapping("/api/v1/patterns")
class PatternController(
    private val patternService: PatternService,
    private val storageService: StorageService,
) {

    @GetMapping
    fun list(
        @RequestParam(required = false) hobbyTypeId: UUID?,
        @RequestParam(required = false) difficulty: Difficulty?,
        @RequestParam(required = false) categoryId: UUID?,
        @RequestParam(required = false) tag: String?,
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "24") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String,
    ): ResponseEntity<PageResponse<PatternSummaryResponse>> {
        val sort = Sort.by(
            if (sortDir.equals("asc", ignoreCase = true)) Sort.Direction.ASC else Sort.Direction.DESC,
            sortBy
        )
        val pageable = PageRequest.of(page, size.coerceAtMost(100), sort)
        val result = patternService.findAll(hobbyTypeId, difficulty, categoryId, tag, search, pageable)
        return ResponseEntity.ok(
            PageResponse(
                content       = result.content.map { PatternSummaryResponse.from(it) },
                totalElements = result.totalElements,
                totalPages    = result.totalPages,
                size          = result.size,
                number        = result.number,
            )
        )
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: UUID): ResponseEntity<PatternDetailResponse> {
        val pattern = patternService.findById(id)
        return ResponseEntity.ok(PatternDetailResponse.from(pattern))
    }

    @PostMapping
    fun create(@Valid @RequestBody request: CreatePatternRequest): ResponseEntity<PatternDetailResponse> {
        val pattern = patternService.create(request)
        return ResponseEntity.status(201).body(PatternDetailResponse.from(pattern))
    }

    @PatchMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdatePatternRequest,
    ): ResponseEntity<PatternDetailResponse> {
        val pattern = patternService.update(id, request)
        return ResponseEntity.ok(PatternDetailResponse.from(pattern))
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        patternService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/cover-image", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadCoverImage(
        @PathVariable id: UUID,
        @RequestParam("file") file: MultipartFile,
    ): ResponseEntity<PatternDetailResponse> {
        val imagePath = storageService.savePatternImage(id, file)
        val pattern = patternService.updateCoverImage(id, imagePath)
        return ResponseEntity.ok(PatternDetailResponse.from(pattern))
    }
}
