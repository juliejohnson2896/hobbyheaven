package com.hobbyheaven.api.v1

import com.hobbyheaven.domain.Category
import com.hobbyheaven.domain.Difficulty
import com.hobbyheaven.domain.HobbyType
import com.hobbyheaven.domain.Material
import com.hobbyheaven.domain.Pattern
import com.hobbyheaven.domain.ProgressStatus
import com.hobbyheaven.domain.Tag
import com.hobbyheaven.domain.UserProgress
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
import java.time.Instant
import java.util.*

// ─── Shared ───────────────────────────────────────────────────────────────────

data class PageResponse<T>(
    val content: List<T>,
    val totalElements: Long,
    val totalPages: Int,
    val size: Int,
    val number: Int,
)

// ─── HobbyType ────────────────────────────────────────────────────────────────

data class HobbyTypeResponse(
    val id: UUID,
    val name: String,
    val slug: String,
    val description: String?,
    val icon: String?,
    val createdAt: Instant,
) {
    companion object {
        fun from(h: HobbyType) = HobbyTypeResponse(h.id, h.name, h.slug, h.description, h.icon, h.createdAt)
    }
}

data class CreateHobbyTypeRequest(
    @field:NotBlank @field:Size(max = 64) val name: String,
    @field:NotBlank @field:Size(max = 64) val slug: String,
    val description: String? = null,
    val icon: String? = null,
)

// ─── Category ─────────────────────────────────────────────────────────────────

data class CategoryResponse(
    val id: UUID,
    val name: String,
    val slug: String,
    val hobbyTypeId: UUID,
    val createdAt: Instant,
) {
    companion object {
        fun from(c: Category) = CategoryResponse(c.id, c.name, c.slug, c.hobbyType.id, c.createdAt)
    }
}

data class CreateCategoryRequest(
    @field:NotBlank @field:Size(max = 64) val name: String,
    @field:NotBlank @field:Size(max = 64) val slug: String,
    @field:NotNull val hobbyTypeId: UUID,
)

// ─── Tag ──────────────────────────────────────────────────────────────────────

data class TagResponse(
    val id: UUID,
    val name: String,
    val slug: String,
) {
    companion object {
        fun from(t: Tag) = TagResponse(t.id, t.name, t.slug)
    }
}

// ─── Material ─────────────────────────────────────────────────────────────────

data class MaterialResponse(
    val id: UUID,
    val name: String,
    val quantity: BigDecimal?,
    val unit: String?,
    val notes: String?,
    val sortOrder: Int,
) {
    companion object {
        fun from(m: Material) = MaterialResponse(m.id, m.name, m.quantity, m.unit, m.notes, m.sortOrder)
    }
}

data class MaterialRequest(
    @field:NotBlank @field:Size(max = 128) val name: String,
    val quantity: BigDecimal? = null,
    @field:Size(max = 32) val unit: String? = null,
    val notes: String? = null,
    val sortOrder: Int = 0,
)

// ─── Pattern ──────────────────────────────────────────────────────────────────

data class PatternSummaryResponse(
    val id: UUID,
    val title: String,
    val description: String?,
    val difficulty: Difficulty,
    val author: String?,
    val coverImagePath: String?,
    val hobbyType: HobbyTypeResponse,
    val categories: List<CategoryResponse>,
    val tags: List<TagResponse>,
    val createdAt: Instant,
    val updatedAt: Instant,
) {
    companion object {
        fun from(p: Pattern) = PatternSummaryResponse(
            id = p.id,
            title = p.title,
            description = p.description,
            difficulty = p.difficulty,
            author = p.author,
            coverImagePath = p.coverImagePath,
            hobbyType = HobbyTypeResponse.from(p.hobbyType),
            categories = p.categories.map { CategoryResponse.from(it) },
            tags = p.tags.map { TagResponse.from(it) },
            createdAt = p.createdAt,
            updatedAt = p.updatedAt,
        )
    }
}

data class PatternDetailResponse(
    val id: UUID,
    val title: String,
    val description: String?,
    val difficulty: Difficulty,
    val author: String?,
    val sourceUrl: String?,
    val coverImagePath: String?,
    val hobbyType: HobbyTypeResponse,
    val metadata: Map<String, Any>,
    val instructions: List<Map<String, Any>>,
    val materials: List<MaterialResponse>,
    val categories: List<CategoryResponse>,
    val tags: List<TagResponse>,
    val createdBy: UUID?,
    val createdAt: Instant,
    val updatedAt: Instant,
) {
    companion object {
        fun from(p: Pattern) = PatternDetailResponse(
            id = p.id,
            title = p.title,
            description = p.description,
            difficulty = p.difficulty,
            author = p.author,
            sourceUrl = p.sourceUrl,
            coverImagePath = p.coverImagePath,
            hobbyType = HobbyTypeResponse.from(p.hobbyType),
            metadata = p.metadata,
            instructions = p.instructions,
            materials = p.materials.map { MaterialResponse.from(it) },
            categories = p.categories.map { CategoryResponse.from(it) },
            tags = p.tags.map { TagResponse.from(it) },
            createdBy = p.createdBy,
            createdAt = p.createdAt,
            updatedAt = p.updatedAt,
        )
    }
}

data class CreatePatternRequest(
    @field:NotBlank @field:Size(max = 255) val title: String,
    val description: String? = null,
    val difficulty: Difficulty = Difficulty.BEGINNER,
    @field:Size(max = 255) val author: String? = null,
    val sourceUrl: String? = null,
    @field:NotNull val hobbyTypeId: UUID,
    val categoryIds: Set<UUID> = emptySet(),
    val tagNames: Set<String> = emptySet(),
    val materials: List<MaterialRequest> = emptyList(),
    val metadata: Map<String, Any> = emptyMap(),
    val instructions: List<Map<String, Any>> = emptyList(),
)

data class UpdatePatternRequest(
    @field:Size(max = 255) val title: String? = null,
    val description: String? = null,
    val difficulty: Difficulty? = null,
    @field:Size(max = 255) val author: String? = null,
    val sourceUrl: String? = null,
    val hobbyTypeId: UUID? = null,
    val categoryIds: Set<UUID>? = null,
    val tagNames: Set<String>? = null,
    val materials: List<MaterialRequest>? = null,
    val metadata: Map<String, Any>? = null,
    val instructions: List<Map<String, Any>>? = null,
)

// ─── User Progress ────────────────────────────────────────────────────────────

data class UserProgressResponse(
    val id: UUID,
    val patternId: UUID,
    val status: ProgressStatus,
    val currentStep: Int,
    val notes: String?,
    val startedAt: Instant?,
    val completedAt: Instant?,
) {
    companion object {
        fun from(p: UserProgress) = UserProgressResponse(
            id = p.id,
            patternId = p.pattern.id,
            status = p.status,
            currentStep = p.currentStep,
            notes = p.notes,
            startedAt = p.startedAt,
            completedAt = p.completedAt,
        )
    }
}

data class UpsertProgressRequest(
    @field:NotNull val status: ProgressStatus,
    val currentStep: Int = 0,
    val notes: String? = null,
)
