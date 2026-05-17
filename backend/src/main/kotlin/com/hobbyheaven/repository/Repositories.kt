package com.hobbyheaven.repository

import com.hobbyheaven.domain.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, UUID> {
    fun findByUsername(username: String): User?
    fun findByEmail(email: String): User?
    fun findByOidcSubject(subject: String): User?
    fun existsByUsername(username: String): Boolean
    fun existsByEmail(email: String): Boolean
}

@Repository
interface HobbyTypeRepository : JpaRepository<HobbyType, UUID> {
    fun findBySlug(slug: String): HobbyType?
    fun existsBySlug(slug: String): Boolean
}

@Repository
interface CategoryRepository : JpaRepository<Category, UUID> {
    fun findByHobbyTypeId(hobbyTypeId: UUID): List<Category>
    fun findBySlugAndHobbyTypeId(slug: String, hobbyTypeId: UUID): Category?
}

@Repository
interface TagRepository : JpaRepository<Tag, UUID> {
    fun findBySlug(slug: String): Tag?
    fun findByNameIn(names: List<String>): List<Tag>
}

@Repository
interface MaterialRepository : JpaRepository<Material, UUID> {
    fun findByPatternIdOrderBySortOrderAsc(patternId: UUID): List<Material>
    fun deleteByPatternId(patternId: UUID)
}

@Repository
interface PatternRepository : JpaRepository<Pattern, UUID> {

    @Query("""
        SELECT DISTINCT p FROM Pattern p
        LEFT JOIN FETCH p.hobbyType
        LEFT JOIN FETCH p.categories
        LEFT JOIN FETCH p.tags
        WHERE (:hobbyTypeId IS NULL OR p.hobbyType.id = :hobbyTypeId)
          AND (:difficulty IS NULL OR p.difficulty = :difficulty)
          AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
    """,
    countQuery = """
        SELECT COUNT(DISTINCT p) FROM Pattern p
        WHERE (:hobbyTypeId IS NULL OR p.hobbyType.id = :hobbyTypeId)
          AND (:difficulty IS NULL OR p.difficulty = :difficulty)
          AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    fun findWithFilters(
        @Param("hobbyTypeId") hobbyTypeId: UUID?,
        @Param("difficulty") difficulty: Difficulty?,
        @Param("search") search: String?,
        pageable: Pageable,
    ): Page<Pattern>

    @Query("""
        SELECT DISTINCT p FROM Pattern p
        LEFT JOIN FETCH p.hobbyType
        LEFT JOIN FETCH p.categories
        LEFT JOIN FETCH p.tags
        JOIN p.categories c
        WHERE c.id = :categoryId
    """)
    fun findByCategoryId(@Param("categoryId") categoryId: UUID, pageable: Pageable): Page<Pattern>

    @Query("""
        SELECT DISTINCT p FROM Pattern p
        LEFT JOIN FETCH p.hobbyType
        LEFT JOIN FETCH p.categories
        LEFT JOIN FETCH p.tags
        JOIN p.tags t
        WHERE t.slug = :tagSlug
    """)
    fun findByTagSlug(@Param("tagSlug") tagSlug: String, pageable: Pageable): Page<Pattern>
}

@Repository
interface UserProgressRepository : JpaRepository<UserProgress, UUID> {
    fun findByUserIdAndPatternId(userId: UUID, patternId: UUID): UserProgress?
    fun findByUserId(userId: UUID, pageable: Pageable): Page<UserProgress>
    fun findByUserIdAndStatus(userId: UUID, status: ProgressStatus): List<UserProgress>
}
