package com.hobbyheaven.domain

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import org.hibernate.annotations.Type
import java.time.Instant
import java.util.*

enum class Difficulty { BEGINNER, EASY, INTERMEDIATE, ADVANCED, EXPERT }

@Entity
@Table(name = "patterns")
class Pattern(

    @Column(nullable = false)
    var title: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    var difficulty: Difficulty = Difficulty.BEGINNER,

    @Column(length = 255)
    var author: String? = null,

    @Column(name = "source_url", columnDefinition = "TEXT")
    var sourceUrl: String? = null,

    @Column(name = "cover_image_path", columnDefinition = "TEXT")
    var coverImagePath: String? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hobby_type_id", nullable = false)
    var hobbyType: HobbyType,

    // Hobby-specific fields (hook size, yarn weight, gauge, etc.)
    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb", nullable = false)
    var metadata: MutableMap<String, Any> = mutableMapOf(),

    // Ordered step-by-step instructions
    @Type(JsonBinaryType::class)
    @Column(columnDefinition = "jsonb", nullable = false)
    var instructions: MutableList<Map<String, Any>> = mutableListOf(),

    @Column(name = "created_by")
    var createdBy: UUID? = null,

) {
    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    val id: UUID = UUID.randomUUID()

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant = Instant.now()

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now()

    @OneToMany(mappedBy = "pattern", cascade = [CascadeType.ALL], orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    val materials: MutableList<Material> = mutableListOf()

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "pattern_categories",
        joinColumns = [JoinColumn(name = "pattern_id")],
        inverseJoinColumns = [JoinColumn(name = "category_id")]
    )
    val categories: MutableSet<Category> = mutableSetOf()

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "pattern_tags",
        joinColumns = [JoinColumn(name = "pattern_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    val tags: MutableSet<Tag> = mutableSetOf()

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }
}
